import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import moment from 'moment'
import { DatePicker } from 'element-ui'
import * as filters from './util/filters'
import {
    TabButton
} from './components'
import axios from 'axios'

axios.defaults.withCredentials = true

// install the component as a custorm plugin 
const plugin = (component) => {
    return {
        install: (Vue) => {
            Vue.component(component.name, component)
        }
    }
}
Vue.use(plugin(TabButton))

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(DatePicker)
Vue.prototype.moment = moment

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp() {
    // sync the router with the vuex store.
    // this registers `store.state.route`
    sync(store, router)

    // create the app instance.
    // here we inject the router, store and ssr context to all child components,
    // making them available everywhere as `this.$router` and `this.$store`.
    const app = new Vue({
        router,
        store,
        ...App
    })

    // expose the app, the router and the store.
    // note we are not mounting the app here, since bootstrapping will be
    // different depending on whether we are in a browser or on the server.
    return { app, router, store }
}