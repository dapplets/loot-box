import { useEffect } from 'react'

export default function useApi(selectedParams: any, setApiParams: any, setLootboxesParams: any) {
  useEffect(() => {
    if (selectedParams === null) return

    setApiParams(selectedParams)
      .then((x: any) => {
        setLootboxesParams(x)
      })

      .catch((e: any) => {
        console.error(e)

        // ToDo: show error to user
      })
  }, [selectedParams])
}
