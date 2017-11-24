import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from '../views/home.vue'
import index from '../views/index.vue'

export default new Router({
    mode: 'history',
    routes: [{
        path: '/home',
        component: home,
        children:[{
            path: '',
            redirect: ''
        }]
    },{
            path: 'list',
            component: preheat
        }, {
        path: '/index',
        component: index
    }, {
        path: '/',
        redirect: '/index'
    }]
})