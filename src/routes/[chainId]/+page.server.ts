
import { redirect } from "@sveltejs/kit"
import { getCurrentDay } from "../../stores/day"

export const load = async ({ params }: { params: { chainId: string } }) => {
  const chainId = +params.chainId || 1
  const currentDay = await getCurrentDay()
  throw redirect(307, `/${chainId}/${currentDay}/7`)
}
