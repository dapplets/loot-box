export const getWin = (y: any, functionProps: any) => {
  if (y.ftContentItems.length !== 0) {
    y.ftContentItems.map((x: any) => functionProps(`${x.tokenAmount} ${x.tokenTicker}`))
  } else if (y.nearContentItems.length !== 0) {
    y.nearContentItems.map((x: any) => functionProps(`${x.tokenAmount} NEAR`))
  } else if (y.nftContentItems.length !== 0) {
    const winNft = String(y.nftContentItems.length) + ` NFT`
    functionProps(winNft)
  }
}
