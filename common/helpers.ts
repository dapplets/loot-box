export type NetworkConfig = {
  networkId: 'mainnet' | 'testnet';
  landingUrl: string;
  landingUrlRegexp: any;
  landingUrlReplace: string;
  contractAddress: string;
  nodeUrl: string;
  walletUrl: string;
  helperUrl: string;
  explorerUrl: string;
};

export function getNetworkConfig(networkId: string): NetworkConfig {
  if (networkId === 'mainnet') {
    return {
      networkId,
      contractAddress: 'app.ltbx.near',
      landingUrl: 'https://ltbx.app',
      landingUrlReplace: 'ltbx.app/',
      landingUrlRegexp: /.*(https:\/\/ltbx\.app\/\d+)/,
      nodeUrl: 'https://rpc.mainnet.near.org',
      walletUrl: 'https://wallet.mainnet.near.org',
      helperUrl: 'https://helper.mainnet.near.org',
      explorerUrl: 'https://explorer.mainnet.near.org',
    };
  } else if (networkId === 'testnet') {
    return {
      networkId,
      contractAddress: 'app.ltbx.testnet',
      landingUrl: 'https://test.ltbx.app',
      landingUrlReplace: 'test.ltbx.app/',
      landingUrlRegexp: /.*(https:\/\/test\.ltbx\.app\/\d+)/,
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org',
    };
  } else {
    throw new Error(
      'Only "mainnet" and "testnet" networks are supported. Change the network parameter in the dapplet settings.',
    );
  }
}
