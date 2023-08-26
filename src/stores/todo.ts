
export type TodoHandler = ((remove: () => void) => void)
export type Todo = {
  shouldRemove: boolean;
  handler: TodoHandler;
}
let todos: Todo[] = []
const loop = () => {
  const running = todos.slice(0)
  for (const oneTodo of running) {
    if (oneTodo.shouldRemove) continue
    oneTodo.handler(() => {
      oneTodo.shouldRemove = true
    })
  }
  todos = todos.filter((todo) => !todo.shouldRemove)
  if (typeof window === 'undefined') return
  requestAnimationFrame(loop)
}
loop()

export const addToLoop = (fn: TodoHandler) => {
  todos.push({
    shouldRemove: false,
    handler: fn,
  })
  return todos[todos.length - 1]
}
export const removeFromLoop = (target: Todo) => {
  todos = todos.filter((todo) => todo !== target)
}
