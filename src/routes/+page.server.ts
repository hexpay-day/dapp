// import { redirect } from "@sveltejs/kit"
import { redirect } from "@sveltejs/kit"
// import { getCurrentDay } from "../stores/day"

export const load = async () => {
  throw redirect(307, '/1/')
  // const currentDay = await getCurrentDay()
  // return {
  //   day: currentDay,
  // }
  // redirect(307, `/stakes/${currentDay}`)
}
