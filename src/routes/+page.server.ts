import { redirect } from "@sveltejs/kit"
export const ssr = false;

export const load = async () => {
  throw redirect(307, `/1`)
}
