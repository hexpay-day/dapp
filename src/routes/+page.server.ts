// import { redirect } from "@sveltejs/kit"
import { getCurrentDay } from "../stores/day"

export const load = async () => {
  const currentDay = await getCurrentDay()
  return {
    day: currentDay,
  }
  // redirect(307, `/stakes/${currentDay}`)
}
