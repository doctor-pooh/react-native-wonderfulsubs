export default function(handlers) {
  return store => next => action => {
    next(action);
    if (handlers.hasOwnProperty(action.type)) {
      const actions = handlers[action.type](store.getState(), action);
      if (Array.isArray(actions)) {
        actions.map(act => store.dispatch(act));
      } else {
        actions && store.dispatch(actions);
      }
    }
  };
}
