import { app, router, store } from './index'


// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  router.push(context.url)

  const matchedComponents = router.getMatchedComponents()
  // no matched routes
  if (!matchedComponents.length) {
    return Promise.reject({ code: '404', message: 'no matched router' })
  }

  return Promise.all(matchedComponents.map(component => {
    if (component.preFetch) {
      return component.preFetch(store,context.cookie)
    }
  })).then(() => {
    context.initialState = store.state
    return app
  })
}