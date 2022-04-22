import autobahn from 'autobahn-browser';

export class Api {
  _session = this._createSession();

  async getLootboxClaims(lootboxId: string) {
    const session = await this._session;
    const transactions = await session.call(
      'com.nearprotocol.testnet.explorer.transactions-list-by-account-id',
      [
        'dev-1650658484393-79396311861979',
        10000,
        {
          endTimestamp: 1938353482933,
          transactionIndex: 0,
        },
      ],
    );

    const actions = transactions.map((x: any) => ({
        hash: x.hash,
        signerId: x.signerId,
        date: new Date(x.blockTimestamp),
        method: x.actions[0]?.args?.method_name,
        args: x.actions[0]?.args?.args ? JSON.parse(atob(x.actions[0]?.args?.args)) : {}
    }));

    const claims = actions.filter((x: any) => x.method === "claim_lootbox" && x.args.lootbox_id === lootboxId);

    return claims;
  }

  private async _createSession() {
    const connection = new autobahn.Connection({
      url: 'wss://wamp.onrender.com/ws',
      realm: 'near-explorer',
      retry_if_unreachable: true,
      max_retries: Number.MAX_SAFE_INTEGER,
      max_retry_delay: 10,
    });
    const promise = new Promise((resolve, reject) => (connection.onopen = resolve));
    connection.open();
    const session: any = await promise;
    return session;
  }
}
