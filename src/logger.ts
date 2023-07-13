import d from 'debug'
const { debug } = d

const namespace = '🤖'
debug.enable(`${namespace}*`)

export const log = debug(namespace)
