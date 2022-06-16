export const Check= (creationForm:any, BigNumber:any)=> {
  const check=()=>{ if (creationForm) {
      if (
        creationForm &&
        creationForm.dropType === 'fixed' &&
        creationForm.tokenAmount &&
        Number(creationForm.tokenAmount) >=
          Number(creationForm.dropAmountFrom) &&
        Number(creationForm.dropAmountFrom) > 0 &&
        Number(creationForm.tokenAmount) > 0
      ) {
        const bigNumTokenAmount = new BigNumber(
          creationForm && creationForm.tokenAmount,
        );
        const result = bigNumTokenAmount.mod(
          Number(
            creationForm && creationForm.dropAmountFrom,
          ),
        );
        if (result && result.c && result.c[0] === 0) {
          return true;
        } else {
          false;
        }
      }
    } else {
      return false;
    }}
   return check
  };