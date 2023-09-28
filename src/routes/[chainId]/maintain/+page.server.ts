export const load = async ({ params }: { params: { chainId: string } }) => {
  const chainId = +params.chainId || 1
  return {
    chainId,
  }
}
