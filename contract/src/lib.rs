use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedSet, Vector};
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, CryptoHash};
use near_sdk::serde::{Deserialize, Serialize};

pub type LootboxId = u64;
pub type ClaimResultId = u64;

#[derive(BorshSerialize)]
pub enum StorageKey {
    LootboxesById,
    LootboxesPerOwner,
    LootboxesPerOwnerInner { account_id_hash: CryptoHash },
    ClaimsPerLootboxAndOwner,
    ClaimResultsById
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum LootboxStatus {
    Created,
    Filled,
    Payed,
    Dropping,
    Dropped,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum ClaimResult {
    NotExists,
    NotOpened,
    NotWin,
    WinNear { total_amount: u64 },
    WinFt { token_contract: AccountId, total_amount: u64 },
    WinNft { token_contract: AccountId, token_id: u64 },
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum LootItem {
    Near { total_amount: u64, drop_amount_from: u64, drop_amount_to: u64 },
    Ft { token_contract: AccountId, total_amount: u64, drop_amount_from: u64, drop_amount_to: u64 },
    Nft { token_contract: AccountId, token_id: u64 },
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct Lootbox {
    pub id: u64,
    pub owner_id: AccountId,
    pub picture_id: u16,
    pub drop_chance: u16,
    pub loot_items: Vec<LootItem>,
    pub status: LootboxStatus,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)] // ToDo: check what's Default means
pub struct Contract {
    pub lootboxes_by_id: Vector<Lootbox>,
    pub lootboxes_per_owner: LookupMap<AccountId, UnorderedSet<LootboxId>>,
    pub claims_per_lootbox_and_account: LookupMap<LootboxId, LookupMap<AccountId, ClaimResultId>>,
    pub claim_results: Vector<ClaimResult>
}

//used to generate a unique prefix in our storage collections (this is to avoid data collisions)
pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

#[near_bindgen]
impl Contract {
    // ToDo: reserve Id 0 in lootboxes_by_id

    // View functions

    pub fn get_lootbox_by_id(&mut self, lootbox_id: LootboxId) -> Option<Lootbox> {
        self.lootboxes_by_id.get(lootbox_id)
    }

    pub fn get_lootboxes_by_account(&mut self, account_id: &AccountId, from_index: Option<u64>, limit: Option<u64>) -> Vec<Lootbox> {
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
            .map(|lootbox_id| self.get_lootbox_by_id(lootbox_id.clone()).unwrap())
            .collect()
    }

    pub fn get_lootbox_claim_status(&mut self, lootbox_id: LootboxId, account_id: &AccountId) -> ClaimResult {
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

    // Write functions

    pub fn create_lootbox(&mut self, picture_id: u16, drop_chance: u16, loot_items: Vec<LootItem>) -> LootboxId {        
        let lootbox = Lootbox {
            id: self.lootboxes_by_id.len(),
            owner_id: env::predecessor_account_id(),
            picture_id: picture_id,
            drop_chance: drop_chance,
            loot_items: loot_items,
            status: LootboxStatus::Created,
        };
        
        self.lootboxes_by_id.push(&lootbox);

        let mut lootboxes_set = self.lootboxes_per_owner.get(&lootbox.owner_id).unwrap_or_else(|| {
            UnorderedSet::new(
                StorageKey::LootboxesPerOwnerInner {
                    account_id_hash: hash_account_id(&lootbox.owner_id),
                }
                .try_to_vec()
                .unwrap(),
            )
        });

        lootboxes_set.insert(&lootbox.id);
        self.lootboxes_per_owner.insert(&lootbox.owner_id, &lootboxes_set);
        lootbox.id
    }

    pub fn claim_lootbox(&mut self, lootbox_id: LootboxId) -> ClaimResult {
        let _lootbox = self.get_lootbox_by_id(lootbox_id).expect("No lootbox");
        
        let account_id = env::predecessor_account_id();
        let mut lootboxes_map = self.claims_per_lootbox_and_account.get(&lootbox_id).unwrap_or_else(|| {
            LookupMap::new(
                StorageKey::ClaimsPerLootboxAndOwner
                .try_to_vec()
                .unwrap(),
            )
        });

        match lootboxes_map.get(&account_id) {
            Some(_x) => {
                panic!("Already claimed.");
            },
            None => {
                let claim_result = ClaimResult::WinNear { total_amount: 1 };
                self.claim_results.push(&claim_result);
                let claim_result_id = self.claim_results.len() - 1;
                lootboxes_map.insert(&account_id, &claim_result_id);
                claim_result
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
        };

        contract
    }

    #[test]
    fn should_create_lootbox() {
        let mut contract = get_contract();

        let loot_items = Vec::from([
            LootItem::Near { drop_amount_from: 1, drop_amount_to: 10, total_amount: 100 }
        ]);
        let lootbox_id = contract.create_lootbox(1, 0, loot_items);

        let lootbox = contract.get_lootbox_by_id(lootbox_id);

        match lootbox {
            Some(x) => {
                assert_eq!(lootbox_id, x.id);
                assert_eq!(1, x.loot_items.len());
                // ToDo: check another properties

                let claim_result_before = contract.get_lootbox_claim_status(lootbox_id, &to_account("test.near"));
                assert_eq!(matches!(claim_result_before, ClaimResult::NotOpened), true);

                let claim_result = contract.claim_lootbox(lootbox_id);
                let claim_result_after = contract.get_lootbox_claim_status(lootbox_id, &to_account("test.near"));
                assert_eq!(matches!(claim_result_after, claim_result), true);

            },
            None => env::panic_str("No lootbox")
        }
    }
}
