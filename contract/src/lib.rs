use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, Vector};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, CryptoHash, Gas, Balance, PromiseOrValue, Promise };
// promise_result_as_success, PromiseResult
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::json_types::{U64, U128};
use near_sdk::{ext_contract};
use near_sdk::{serde_json};
use near_contract_standards::non_fungible_token::{TokenId};

const NO_DEPOSIT: Balance = 0;
const ONE_YOCTO: Balance = 1;
const BASE_GAS: Gas = Gas(20_000_000_000_000);
const GAS_FOR_NFT_CHECK_OWNERSHIP: Gas = Gas(100_000_000_000_000);
// const GAS_FOR_LOOTBOX_CREATION: Gas = Gas(20_000_000_000_000);

#[ext_contract(ext_nft)]
trait NonFungibleToken {
    fn nft_transfer(&mut self, receiver_id: String, token_id: String, approval_id: Option<u64>, memo: Option<String>);
    fn nft_transfer_call(&mut self, receiver_id: String, token_id: String, approval_id: Option<u64>, memo: Option<String>, msg: String) -> bool;
    fn nft_token(&self, token_id: String) -> Option<Token>;
    // fn nft_is_approved(&self, token_id: TokenId, approved_account_id: AccountId, approval_id: Option<u64>) -> bool;
}

#[ext_contract(ext_ft)]
trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: String, amount: U128, memo: Option<String>);
    fn ft_transfer_call(&mut self, receiver_id: String, amount: U128, msg: String, memo: Option<String>) -> Promise;
    fn ft_total_supply(&self) -> U128;
    fn ft_balance_of(&self, account_id: String) -> U128;
}

#[ext_contract(ext_self)]
trait SelfContract {
    fn callback_assert_nft_ownership(&mut self, lootbox_creator_address: AccountId);
    fn callback_transfer_tokens(&mut self, loot_items: Vec<LootItem>) -> Promise;
    fn callback_return_claim_result(claim_result: ClaimResult) -> ClaimResult;
    fn callback_register_lootbox(&mut self, owner_id: AccountId, picture_id: u16, drop_chance: u8, loot_items: Vec<LootItem>) -> U64;
}

pub type LootboxId = u64;
pub type ClaimResultId = u64;

#[derive(BorshSerialize)]
pub enum StorageKey {
    LootboxesById,
    LootboxesPerOwner,
    LootboxesPerOwnerInner { account_id_hash: CryptoHash },
    ClaimsPerLootboxAndOwner,
    ClaimsPerLootboxAndOwnerInner { lootbox_id_hash: CryptoHash },
    ClaimResultsById,
    ClaimsPerLootbox,
    ClaimsPerLootboxInner { lootbox_id_hash: CryptoHash }
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub enum LootboxStatus {
    Filling = 0,
    Filled = 1,
    Dropping = 2,
    Dropped = 3
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum Either<S, T> {
    Left(S),
    Right(T),
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum ClaimResult {
    NotExists,
    NotOpened,
    NotWin { lootbox_id: U64, claimer_id: AccountId },
    WinNear { lootbox_id: U64, claimer_id: AccountId, total_amount: U128 },
    WinFt { lootbox_id: U64, claimer_id: AccountId, token_contract: AccountId, total_amount: U128 },
    WinNft { lootbox_id: U64, claimer_id: AccountId, token_contract: AccountId, token_id: String },
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum LootItem {
    Near { total_amount: U128, drop_amount_from: U128, drop_amount_to: U128, balance: U128 },
    Ft { token_contract: AccountId, total_amount: U128, drop_amount_from: U128, drop_amount_to: U128, balance: U128 },
    Nft { token_contract: AccountId, token_id: String },
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Lootbox {
    pub id: U64,
    pub owner_id: AccountId,
    pub picture_id: u16,
    pub drop_chance: u8,
    pub loot_items: Vec<LootItem>,
    pub status: LootboxStatus,
    pub distributed_items: Vec<LootItem>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)] // ToDo: check what's Default means
pub struct Contract {
    pub lootboxes_by_id: Vector<Lootbox>,
    pub lootboxes_per_owner: LookupMap<AccountId, Vector<LootboxId>>,
    pub claims_per_lootbox_and_account: LookupMap<LootboxId, LookupMap<AccountId, ClaimResultId>>,
    pub claim_results: Vector<ClaimResult>,
    pub claims_per_lootbox: LookupMap<LootboxId, Vector<ClaimResultId>>
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OnNftTransferArgs {
    pub lootbox_id: U64
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct OnFtTransferArgs {
    pub lootbox_id: U64,
    pub drop_amount_from: U128, 
    pub drop_amount_to: U128
}

//used to generate a unique prefix in our storage collections (this is to avoid data collisions)
pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

pub(crate) fn hash_lootbox_id(lootbox_id: &LootboxId) -> CryptoHash {
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(&lootbox_id.to_be_bytes()));
    hash
}

#[near_bindgen]
impl Contract {
    // ToDo: reserve Id 0 in lootboxes_by_id

    // Initialization functions

    #[init]
    pub fn new() -> Self {
        Self {
            lootboxes_by_id: Vector::new(StorageKey::LootboxesById.try_to_vec().unwrap()),
            lootboxes_per_owner: LookupMap::new(StorageKey::LootboxesPerOwner.try_to_vec().unwrap()),
            claims_per_lootbox_and_account: LookupMap::new(StorageKey::ClaimsPerLootboxAndOwner.try_to_vec().unwrap()),
            claim_results: Vector::new(StorageKey::ClaimResultsById.try_to_vec().unwrap()),
            claims_per_lootbox: LookupMap::new(StorageKey::ClaimsPerLootbox.try_to_vec().unwrap()),
        }
    }

    // View functions

    pub fn get_random() -> Vec<u8> {
        env::random_seed()
    }

    pub fn get_lootbox_by_id(&self, lootbox_id: U64) -> Option<Lootbox> {
        self.lootboxes_by_id.get(lootbox_id.0)
    }

    pub fn get_lootboxes_by_account(&self, account_id: &AccountId, from_index: Option<u64>, limit: Option<u64>) -> Vec<Lootbox> {
        let lootbox_ids = self.lootboxes_per_owner.get(account_id);

        let tokens = if let Some(lootbox_ids) = lootbox_ids {
            lootbox_ids
        } else {
            return vec![];
        };

        let start = u64::from(from_index.unwrap_or(0));

        tokens.iter()
            .skip(start as usize) 
            .take(limit.unwrap_or(50) as usize) 
            .map(|lootbox_id| self.lootboxes_by_id.get(lootbox_id).unwrap())
            .collect()
    }

    pub fn get_claim_by_id(&self, claim_result_id: ClaimResultId) -> Option<ClaimResult> {
        self.claim_results.get(claim_result_id)
    }

    pub fn get_lootbox_claim_status(&self, lootbox_id: U64, account_id: &AccountId) -> ClaimResult {
        let lootbox_id = lootbox_id.0;
        match self.lootboxes_by_id.get(lootbox_id) {
            Some(_x) => {
                match self.claims_per_lootbox_and_account.get(&lootbox_id) {
                    Some(claim_result_by_account_id) => {
                        match claim_result_by_account_id.get(&account_id) {
                            Some(x) => {
                                match self.claim_results.get(x) {
                                    Some(x) => x,
                                    None => ClaimResult::NotOpened
                                }
                            },
                            None => ClaimResult::NotOpened
                        }
                    },
                    None => ClaimResult::NotOpened
                }
            },
            None => ClaimResult::NotExists
        }
    }

    pub fn get_claims_by_lootbox(&self, lootbox_id: U64, from_index: Option<u64>, limit: Option<u64>) -> Vec<ClaimResult> {
        let lootbox_id: u64 = lootbox_id.0;
        let claims_ids = self.claims_per_lootbox.get(&lootbox_id);

        let claims = if let Some(claims_ids) = claims_ids {
            claims_ids
        } else {
            return vec![];
        };

        let start = u64::from(from_index.unwrap_or(0));

        claims.iter()
            .skip(start as usize) 
            .take(limit.unwrap_or(50) as usize) 
            .map(|claim_id| self.get_claim_by_id(claim_id.clone()).unwrap())
            .collect()
    }

    // Write functions
    #[payable]
    pub fn create_lootbox(&mut self, picture_id: u16, drop_chance: u8, loot_items: Vec<LootItem>) -> U64 {  
        
        if drop_chance == 0 {
            env::panic_str("Drop chance must be more than 0");
        }

        let mut status = LootboxStatus::Filling;

        if loot_items.len() > 0 {
            let mut near_loot_amount: u128 = 0;

            for item in &loot_items {
                match item {
                    LootItem::Near { total_amount, drop_amount_from, drop_amount_to, balance } => {
                        if !(drop_amount_from.0 <= drop_amount_to.0 && drop_amount_to.0 > 0 && drop_amount_to.0 <= total_amount.0) {
                            env::panic_str("Drop amount must be valid range");
                        }                    

                        if balance != total_amount {
                            env::panic_str("balance and total_amount must be equal");
                        }

                        near_loot_amount += total_amount.0;
                    },
                    LootItem::Nft { token_contract: _, token_id: _ } => {
                        env::panic_str("Use nft_on_transfer to top up the lootbox");
                    },
                    LootItem::Ft { token_contract: _, total_amount: _, drop_amount_from: _, drop_amount_to: _, balance: _ } => {
                        env::panic_str("Use ft_on_transfer to top up the lootbox");
                    }
                }
            }

            if env::attached_deposit() < near_loot_amount {
                env::panic_str("Attached deposit must not be less than loot items");
            }

            status = LootboxStatus::Filled;
        }

        let lootbox = Lootbox {
            id: self.lootboxes_by_id.len().into(),
            owner_id: env::predecessor_account_id(),
            picture_id: picture_id,
            drop_chance: drop_chance,
            loot_items: loot_items,
            distributed_items: vec![],
            status: status,
        };
        
        self.lootboxes_by_id.push(&lootbox);

        let mut lootboxes_vector = self.lootboxes_per_owner.get(&lootbox.owner_id).unwrap_or_else(|| {
            Vector::new(
                StorageKey::LootboxesPerOwnerInner {
                    account_id_hash: hash_account_id(&lootbox.owner_id),
                }
                .try_to_vec()
                .unwrap(),
            )
        });

        lootboxes_vector.push(&lootbox.id.0);
        self.lootboxes_per_owner.insert(&lootbox.owner_id, &lootboxes_vector);

        lootbox.id
    }

    pub fn nft_on_transfer(&mut self, sender_id: AccountId, previous_owner_id: AccountId, token_id: TokenId, msg: String) -> PromiseOrValue<bool> {
        let nft_contract_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        assert_ne!(
            env::current_account_id(), nft_contract_id,
            "Lootbox: nft_on_approve should only be called via cross-contract call"
        );
        assert_eq!(previous_owner_id, signer_id, "Lootbox: previous_owner_id should be signer_id");
        assert_eq!(previous_owner_id, sender_id, "Lootbox: previous_owner_id should be sender_id");
        assert_eq!(signer_id, sender_id, "Lootbox: signer_id should be sender_id");

        // ToDo: accept only approved NFT contracts
        // Example: https://github.com/ParasHQ/paras-marketplace-contract/blob/6a9d96adfaead4210499993f78f22b599a6f78d1/paras-marketplace-contract/src/nft_callbacks.rs#L64-L67

        let OnNftTransferArgs { lootbox_id} = serde_json::from_str(&msg).expect("Not valid OnNftTransferArgs");

        let mut lootbox = self.lootboxes_by_id.get(lootbox_id.0).expect("Lootbox: non-existent id");

        assert_eq!(lootbox.owner_id, previous_owner_id, "Lootbox: only owner can top up a lootbox");
        assert_ne!(lootbox.status, LootboxStatus::Dropping, "Lootbox: already dropping");

        let nft_loot = LootItem::Nft { token_contract: nft_contract_id.clone(), token_id: token_id.clone() };
        lootbox.loot_items.push(nft_loot);
        lootbox.status = LootboxStatus::Filled;

        self.lootboxes_by_id.replace(lootbox_id.0, &lootbox);

        env::log_str(&format!("NFT {} / {} added to lootbox {}", nft_contract_id, token_id, lootbox_id.0));

        PromiseOrValue::Value(false) // NFT should not be returned to `sender_id`
    }

    pub fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> PromiseOrValue<U128> {
        let ft_contract_id = env::predecessor_account_id();
        let signer_id = env::signer_account_id();
        assert_ne!(
            env::current_account_id(), ft_contract_id,
            "Lootbox: ft_on_approve should only be called via cross-contract call"
        );
        assert_eq!(signer_id, sender_id, "Lootbox: signer_id should be sender_id");

        let OnFtTransferArgs { lootbox_id, drop_amount_from, drop_amount_to } = serde_json::from_str(&msg).expect("Not valid NftTransferArgs");

        let mut lootbox = self.lootboxes_by_id.get(lootbox_id.0).expect("Lootbox: non-existent id");

        assert_eq!(lootbox.owner_id, signer_id, "Lootbox: only owner can top up a lootbox");
        assert_ne!(lootbox.status, LootboxStatus::Dropping, "Lootbox: already dropping");

        let ft_loot = LootItem::Ft { 
            token_contract: ft_contract_id.clone(), 
            total_amount: amount, 
            drop_amount_from, 
            drop_amount_to, 
            balance: amount 
        };
        lootbox.loot_items.push(ft_loot);
        lootbox.status = LootboxStatus::Filled;

        self.lootboxes_by_id.replace(lootbox_id.0, &lootbox);

        env::log_str(&format!("FT {} / {} added to lootbox {}", ft_contract_id, amount.0, lootbox_id.0));

        PromiseOrValue::Value(U128::from(0))
    }

    // /*
    //     The function panics if NFT's owner is not a lootbox creator
    //     or the lootbox contract is not approved in NFT.
    // */
    // #[private]
    // pub fn callback_assert_nft_ownership(&mut self, lootbox_creator_address: AccountId) {
    //     let token_serialized = promise_result_as_success().expect("NFT contract did not respond");
    //     let token = near_sdk::serde_json::from_slice::<Token>(&token_serialized).ok().expect("Cannot deserialize response from NFT");
    //     let lootbox_contract_address = env::current_account_id();

    //     env::log_str(&lootbox_contract_address.to_string());
    //     env::log_str(&lootbox_creator_address.to_string());

    //     if token.owner_id != lootbox_creator_address {
    //         env::panic_str("You are not an owner of NFT");
    //     }

    //     match token.approved_account_ids {
    //         Some(x) => {
    //             if !x.contains_key(&lootbox_contract_address) {
    //                 env::panic_str("NFT is not approved");
    //             }
    //         },
    //         None => env::panic_str("NFT is not approved")
    //     }
    // }

    pub fn claim_lootbox(&mut self, lootbox_id: U64) -> Either<Promise, ClaimResult> {
        let mut _lootbox = self.get_lootbox_by_id(lootbox_id).unwrap_or_else(|| env::panic_str("No lootbox"));

        assert_ne!(_lootbox.status, LootboxStatus::Filling, "Lootbox: is not filled yet");
        assert_ne!(_lootbox.status, LootboxStatus::Dropped, "Lootbox: is dropped already");
        
        let lootbox_id: u64 = lootbox_id.0;
        let account_id = env::predecessor_account_id();
        let mut lootboxes_map = self.claims_per_lootbox_and_account.get(&lootbox_id).unwrap_or_else(|| {
            LookupMap::new(
                StorageKey::ClaimsPerLootboxAndOwnerInner {
                    lootbox_id_hash: hash_lootbox_id(&lootbox_id),
                }
                .try_to_vec()
                .unwrap(),
            )
        });

        match lootboxes_map.get(&account_id) {
            Some(_x) => {
                env::panic_str("Lootbox: can not claim twice");
            },
            None => {
                // generate loot
                let claim_result = self.internal_pull_random_loot(&mut _lootbox);

                // change lootbox status
                if _lootbox.loot_items.len() == 0 {
                    _lootbox.status = LootboxStatus::Dropped;
                } else {
                    _lootbox.status = LootboxStatus::Dropping;
                }

                // update lootbox
                self.lootboxes_by_id.replace(lootbox_id, &_lootbox);

                // store claim result
                self.claim_results.push(&claim_result);
                let claim_result_id = self.claim_results.len() - 1;
                lootboxes_map.insert(&account_id, &claim_result_id);
                self.claims_per_lootbox_and_account.insert(&lootbox_id, &lootboxes_map);
                
                // store claim results per lootbox
                let mut claims_vector = self.claims_per_lootbox.get(&lootbox_id).unwrap_or_else(|| {
                    Vector::new(
                        StorageKey::ClaimsPerLootboxInner {
                            lootbox_id_hash: hash_lootbox_id(&lootbox_id),
                        }
                        .try_to_vec()
                        .unwrap(),
                    )
                });
                claims_vector.push(&claim_result_id);
                self.claims_per_lootbox.insert(&lootbox_id, &claims_vector);

                // ToDo: change lootbox status on completed if items are over.

                match claim_result {
                    ClaimResult::NotExists => Either::Right(claim_result),
                    ClaimResult::NotOpened => Either::Right(claim_result),
                    ClaimResult::NotWin { lootbox_id: _, claimer_id: _ } => Either::Right(claim_result),
                    ClaimResult::WinNear { lootbox_id, claimer_id, total_amount } => {
                        Either::Left(
                            Promise::new(claimer_id.clone())
                                .transfer(total_amount.0)
                                .then(
                                    ext_self::callback_return_claim_result(
                                        ClaimResult::WinNear { lootbox_id, claimer_id, total_amount },
                                        env::current_account_id(),
                                        NO_DEPOSIT,
                                        GAS_FOR_NFT_CHECK_OWNERSHIP,
                                    )
                                )
                        )
                    },
                    ClaimResult::WinFt { lootbox_id, claimer_id, token_contract, total_amount } => {
                        Either::Left(ext_ft::ft_transfer(
                            claimer_id.to_string(),
                            total_amount,
                            None,
                            token_contract.clone(),
                            ONE_YOCTO,
                            BASE_GAS
                        ).then(
                            ext_self::callback_return_claim_result(
                                ClaimResult::WinFt { lootbox_id, claimer_id, token_contract, total_amount },
                                env::current_account_id(),
                                NO_DEPOSIT,
                                GAS_FOR_NFT_CHECK_OWNERSHIP,
                            )
                        ))

                        // ToDo: catch error from promise
                    },
                    ClaimResult::WinNft { lootbox_id, claimer_id, token_contract, token_id } => {
                        Either::Left(ext_nft::nft_transfer(
                            claimer_id.to_string(),
                            token_id.clone(),
                            None,
                            None,
                            token_contract.clone(),
                            ONE_YOCTO,
                            BASE_GAS
                        ).then(
                            ext_self::callback_return_claim_result(
                                ClaimResult::WinNft { lootbox_id, claimer_id, token_contract, token_id },
                                env::current_account_id(),
                                NO_DEPOSIT,
                                GAS_FOR_NFT_CHECK_OWNERSHIP,
                            )
                        ))
                    },
                }
            }
        }
    }

    #[private]
    pub fn callback_return_claim_result(claim_result: ClaimResult) -> ClaimResult {
        claim_result
    }

    fn internal_pull_random_loot(&mut self, _lootbox: &mut Lootbox) -> ClaimResult {
        assert_ne!(_lootbox.loot_items.len(), 0, "Lootbox: items are over");

        let random = env::random_seed_array();
        let random_1 = u64::from_be_bytes(random[0..8].try_into().unwrap());
        let random_2 = u128::from_be_bytes(random[8..24].try_into().unwrap());

        let min_idx: u64 = 0;
        let max_idx: u64 = _lootbox.loot_items.len() as u64 - 1;
        let rand_idx = usize::try_from(random_1 % (max_idx - min_idx + 1) + min_idx).unwrap();

        if random[0] <= _lootbox.drop_chance {
            let item = &_lootbox.loot_items[rand_idx];
            match item {
                LootItem::Near { total_amount, drop_amount_from, drop_amount_to, balance} => {
                    let mut win_amount = random_2 % (drop_amount_to.0 - drop_amount_from.0 + 1) + drop_amount_from.0;

                    if win_amount > balance.0 {
                        win_amount = balance.0;
                    }

                    let new_balance = balance.0 - win_amount;

                    let new_item = LootItem::Near { 
                        total_amount: *total_amount, 
                        drop_amount_from: *drop_amount_from, 
                        drop_amount_to: *drop_amount_to, 
                        balance: new_balance.into()
                    };

                    if new_balance == 0 {
                        _lootbox.distributed_items.push(new_item);
                        _lootbox.loot_items.remove(rand_idx);
                    } else {
                        _lootbox.loot_items[rand_idx] = new_item;
                    }

                    ClaimResult::WinNear { 
                        lootbox_id: _lootbox.id, 
                        claimer_id: env::predecessor_account_id(), 
                        total_amount: win_amount.into()
                    }
                },
                LootItem::Ft { token_contract, total_amount, drop_amount_from, drop_amount_to, balance } => {
                    let mut win_amount = random_2 % (drop_amount_to.0 - drop_amount_from.0 + 1) + drop_amount_from.0;

                    if win_amount > balance.0 {
                        win_amount = balance.0;
                    }

                    let new_balance = balance.0 - win_amount;
                    let token_contract = token_contract.clone();

                    let new_item = LootItem::Ft {
                        token_contract: token_contract.clone(),
                        total_amount: *total_amount,
                        drop_amount_from: *drop_amount_from, 
                        drop_amount_to: *drop_amount_to, 
                        balance: new_balance.into()
                    };

                    if new_balance == 0 {
                        _lootbox.distributed_items.push(new_item);
                        _lootbox.loot_items.remove(rand_idx);
                    } else {
                        _lootbox.loot_items[rand_idx] = new_item;
                    }

                    ClaimResult::WinFt {
                        lootbox_id: _lootbox.id, 
                        claimer_id: env::predecessor_account_id(), 
                        token_contract: token_contract.clone(),
                        total_amount: win_amount.into()
                    }
                },
                LootItem::Nft { token_contract, token_id } => {
                    let new_item = LootItem::Nft { 
                        token_contract: token_contract.clone(),
                        token_id: token_id.clone()
                    };

                    _lootbox.distributed_items.push(new_item);

                    let claim_result = ClaimResult::WinNft { 
                        lootbox_id: _lootbox.id, 
                        claimer_id: env::predecessor_account_id(),
                        token_contract: token_contract.clone(),
                        token_id: token_id.clone()
                    };

                    _lootbox.loot_items.remove(rand_idx);

                    claim_result
                }
            }
        } else {
            ClaimResult::NotWin { 
                lootbox_id: _lootbox.id, 
                claimer_id: env::predecessor_account_id() 
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn to_account(account: &str) -> AccountId {
        AccountId::try_from(account.to_string()).expect("Invalid account")
    }

    fn get_contract() -> Contract {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(to_account("test.near"));
        
        testing_env!(builder.build());

        let contract = Contract {
            lootboxes_by_id: Vector::new(StorageKey::LootboxesById.try_to_vec().unwrap()),
            lootboxes_per_owner: LookupMap::new(StorageKey::LootboxesPerOwner.try_to_vec().unwrap()),
            claims_per_lootbox_and_account: LookupMap::new(StorageKey::ClaimsPerLootboxAndOwner.try_to_vec().unwrap()),
            claim_results: Vector::new(StorageKey::ClaimResultsById.try_to_vec().unwrap()),
            claims_per_lootbox: LookupMap::new(StorageKey::ClaimsPerLootbox.try_to_vec().unwrap()),
        };

        contract
    }

    #[test]
    fn should_create_lootbox() {
        let mut contract = get_contract();

        let loot_items = Vec::from([
            LootItem::Near { drop_amount_from: 1, drop_amount_to: 10, total_amount: 100, balance: 0 }
        ]);
        let lootbox_id = contract.create_lootbox(1, 0, loot_items);

        let lootbox = contract.get_lootbox_by_id(lootbox_id);

        let lootboxes = contract.get_lootboxes_by_account(&to_account("test.near"), None, None);
        assert_eq!(lootboxes.len(), 1);

        match lootbox {
            Some(x) => {
                assert_eq!(lootbox_id.0, x.id);
                assert_eq!(1, x.loot_items.len());
                // ToDo: check another properties

                let claim_result_before = contract.get_lootbox_claim_status(lootbox_id, &to_account("test.near"));
                assert_eq!(matches!(claim_result_before, ClaimResult::NotOpened), true);

                let _claim_result = contract.claim_lootbox(lootbox_id);
                let claim_result_after = contract.get_lootbox_claim_status(lootbox_id, &to_account("test.near"));
                assert_eq!(matches!(claim_result_after, _claim_result), true);

                let claim_results = contract.get_claims_by_lootbox(lootbox_id, None, None);
                assert_eq!(claim_results.len(), 1);

            },
            None => env::panic_str("No lootbox")
        }
    }
}
