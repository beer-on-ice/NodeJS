import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
Vue.use(VueLazyLoad,{
    loading: "/static/loading-svg/loading-bars.svg"
});

new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
