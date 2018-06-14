import Vue from 'vue'
import Router from 'vue-router'
import App from '../components/Login'
import Login from '../components/Login'
import Register from '../components/Register'
import Buttons from '../components/Buttons'
import UserInfo from '../components/UserInfo'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Buttons
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/userinfo',
            component: UserInfo
        }
    ]
})
