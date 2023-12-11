import { readable } from "svelte/store";
import { loading } from "./loading";

export const bridge = readable<null | string>(null, (set) => {
  const update = async () => {
    loading.increment()
    const json = await fetch('https://bridge.pulsechain.com/version.json')
      .then((res) => res.json())
      .catch((err) => ({ipfs_gateways:[]}))
    const defaultUrl = 'https://bridge.mypinata.cloud/ipfs/bafybeiagreiatsnjvoriublqmv3bz4atiu33pecffdiyzponjbvzf3klwm'
    loading.decrement()
    set(json.ipfs_gateways[0] || defaultUrl)
  }
  update()
  // assume that bridge will not update while window is open
  return () => {}
})
