import { redirect } from "@sveltejs/kit"
import { getCurrentDay } from "../stores/day"

export const load = async () => {
  const currentDay = await getCurrentDay()
  throw redirect(307, `/1/${currentDay}/7`)
}
