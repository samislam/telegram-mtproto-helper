export const registerBotListeners = (listeners: (() => unknown)[]) => {
  listeners.forEach((fn) => fn())
}
