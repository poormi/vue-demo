require('es6-promise').polyfill()
import { app, store } from './index'
// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if(window.__INITIAL_STATE__){
	store.replaceState(window.__INITIAL_STATE__)
}
// actually mount to DOM
app.$mount('#app')
