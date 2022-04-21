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
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    fn to_account(account: &str) -> AccountId {
        AccountId::try_from(account.to_string()).expect("Invalid account")
    }

    #[test]
    fn increment() {
        let context = get_context(to_account("test.near"));
        testing_env!(context.build());

        let mut contract = Contract {
            lootboxes_by_id: Vector::new(StorageKey::LootboxesById.try_to_vec().unwrap()),
            lootboxes_per_owner: LookupMap::new(StorageKey::LootboxesPerOwner.try_to_vec().unwrap()),
            claims_per_lootbox_and_account: LookupMap::new(StorageKey::ClaimsPerLootboxAndOwner.try_to_vec().unwrap()),
            claim_results: Vector::new(StorageKey::ClaimResultsById.try_to_vec().unwrap()),
        };

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
            },
            None => env::panic_str("No lootbox")
        }
    }
}
