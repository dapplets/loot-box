import { useMemo } from 'react'
export default function useClass(
  activeTokenType: number,
  creationForm: any,
  activeDropType: any,
  DropType: any,
  nodeFrom: any,
  nodeTo: any,
  nodeTokenAmount: any,
  onLink: (x: boolean) => void,
  activeDropTypeFt: any,
  DropTypeFt: any,
  check: any,
  link: boolean,
  nodeDropAmount: any,
  checkFT: () => boolean | undefined,
  nodeTokenContract: any,
  value: any,
  nodeDropChance: any,
  setDropType: any,
  booleanNodeTokenAmount: boolean | undefined,
  booleanNodeTokenContract: boolean | undefined,
  booleanNodeTokenTicer: any,
  booleanNodeFrom: any,
  booleanNodeTo: any,
  booleanNodeDropAmount: any
) {
  const LinkBlock = useMemo(() => {
    if (activeTokenType === 0) {
      if (
        creationForm.nearContentItems[0] &&
        creationForm.nearContentItems[0].tokenAmount &&
        creationForm.nearContentItems[0].tokenAmount.length >= 1 &&
        creationForm.nearContentItems[0].dropAmountFrom.length >= 1 &&
        creationForm.nearContentItems[0].dropAmountTo.length >= 1
      ) {
        if (
          activeDropType === DropType.Variable &&
          Number(nodeFrom?.current?.value) <= Number(nodeTo?.current?.value) &&
          Number(nodeTo?.current?.value) <= Number(nodeTokenAmount?.current?.value) &&
          Number(nodeFrom?.current?.value) > 0 &&
          Number(nodeTokenAmount?.current?.value) > 0
        ) {
          nodeFrom.current?.classList.remove('invalid')
          nodeTo.current?.classList.remove('invalid')
          onLink(false)
        } else if (
          activeDropTypeFt === DropTypeFt.Variable &&
          Number(nodeFrom?.current?.value) <= Number(nodeTo?.current?.value) &&
          Number(nodeTo?.current?.value) <= Number(nodeTokenAmount?.current?.value) &&
          Number(nodeFrom?.current?.value) > 0 &&
          Number(nodeTokenAmount?.current?.value) > 0
        ) {
          nodeFrom.current?.classList.remove('invalid')
          nodeTo.current?.classList.remove('invalid')
          onLink(false)
        } else if (activeDropType !== DropType.Variable) {
          check() ? onLink(false) : onLink(true)

          link
            ? nodeDropAmount.current?.classList.add('invalid')
            : nodeDropAmount.current?.classList.remove('invalid')
        } else {
          nodeFrom.current?.classList.add('invalid')
          nodeTo.current?.classList.add('invalid')
          onLink(true)
        }
      } else {
        onLink(true)
      }
    } else if (activeTokenType === 1) {
      if (
        creationForm.ftContentItems &&
        creationForm.ftContentItems[0] &&
        creationForm.ftContentItems[0].tokenAmount.length >= 1 &&
        creationForm.ftContentItems[0].dropAmountFrom.length >= 1 &&
        creationForm.ftContentItems[0].dropAmountTo.length >= 1 &&
        creationForm.ftContentItems[0].contractAddress.length >= 1
      ) {
        if (
          activeDropTypeFt === DropTypeFt.Variable &&
          Number(nodeFrom?.current?.value) <= Number(nodeTo?.current?.value) &&
          Number(nodeTo?.current?.value) <= Number(nodeTokenAmount?.current?.value) &&
          Number(nodeFrom?.current?.value) > 0 &&
          Number(nodeTokenAmount?.current?.value) > 0
        ) {
          nodeFrom.current?.classList.remove('invalid')
          nodeTo.current?.classList.remove('invalid')

          onLink(false)
        } else if (activeDropTypeFt !== DropTypeFt.Variable) {
          checkFT() ? onLink(false) : onLink(true)
          link
            ? nodeDropAmount.current?.classList.add('invalid')
            : nodeDropAmount.current?.classList.remove('invalid')
        } else {
          nodeFrom.current?.classList.add('invalid')
          nodeTo.current?.classList.add('invalid')
          onLink(true)
        }
      } else {
        creationForm.ftContentItems[0].contractAddress.length >= 1
          ? nodeDropAmount.current?.classList.remove('invalid') &&
            nodeTokenContract.current?.classList.add('invalid')
          : nodeTokenContract.current?.classList.remove('invalid')
        onLink(true)
      }
    }
    if (value < 101) {
      nodeDropChance.current?.classList.remove('invalid')
    } else {
      nodeDropChance.current?.classList.add('invalid')
    }
    if (Number(nodeFrom) < 0) {
      nodeFrom.current?.classList.add('invalid')
    } else {
      nodeFrom.current?.classList.remove('invalid')
    }
    setDropType(activeTokenType)
  }, [
    booleanNodeTokenAmount,
    booleanNodeTokenContract,
    booleanNodeTokenTicer,
    booleanNodeFrom,
    booleanNodeTo,
    booleanNodeDropAmount,

    creationForm,
    link,
    value,

    nodeTokenAmount,
    nodeFrom,
    nodeTo,
    nodeDropChance,

    activeDropType,
    activeDropTypeFt,
    activeTokenType,
  ])
  return LinkBlock
}
