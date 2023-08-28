import { redirect } from "@sveltejs/kit"
import { getCurrentDay } from "../../../../stores/day"

export const load = async ({ params }: { params: { chainId: string; day: string } }) => {
  const chainId = +params.chainId || 1
  const day = +params.day || await getCurrentDay()
  throw redirect(307, `/${chainId}/${day}/2`)
}
