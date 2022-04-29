# Lootbox NEAR Smart Contract

1. Set up the [prerequisites](https://github.com/near/near-sdk-rs#pre-requisites)
2. Begin writing your smart contract in `src/lib.rs`
3. Test the contract 

    `cargo test -- --nocapture`

4. Build the contract

    `RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release`

5. Deploy

    `near dev-deploy --wasmFile ./res/lootbox_near_contract.wasm`

6. Initialize

    `near call dev-1651162408741-46233879712819 new '' --accountId buidler.testnet`

**Get more info at:**

* [Rust Smart Contract Quick Start](https://docs.near.org/docs/develop/contracts/rust/intro)
* [Rust SDK Book](https://www.near-sdk.io/)
