# Lootbox NEAR Smart Contract

1. Set up the [prerequisites](https://github.com/near/near-sdk-rs#pre-requisites)
2. Begin writing your smart contract in `src/lib.rs`
3. Test the contract 

    `cargo test -- --nocapture`

4. Build the contract

    `./build.sh`

5. Login into CLI (testnet)

    `NEAR_ENV=mainnet near login`

6. Deploy (testnet)

    `./deploy.sh`

7. Initialize (testnet)

    `near call app.ltbx.testnet new '' --accountId ltbx.testnet`
    
    or

    `near deploy --wasmFile ./res/lootbox_near_contract.wasm --accountId=app.ltbx.testnet`

8. Login into CLI (mainnet)

    `NEAR_ENV=mainnet near login`

9. Deploy (mainnet)

    `NEAR_ENV=mainnet near deploy --wasmFile ./res/lootbox_near_contract.wasm --accountId=app.ltbx.near`

10. Initialize (mainnet)

    `NEAR_ENV=mainnet near call app.ltbx.near new '' --accountId ltbx.near`

**Get more info at:**

* [Rust Smart Contract Quick Start](https://docs.near.org/docs/develop/contracts/rust/intro)
* [Rust SDK Book](https://www.near-sdk.io/)
