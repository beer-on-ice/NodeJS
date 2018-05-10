import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'  // 价格处理js

Vue.config.productionTip = false

Vue.use(infiniteScroll);
Vue.use(VueLazyLoad,{
    loading: "/static/loading-svg/loading-bars.svg"
});
// 全局过滤器
Vue.filter("currency",currency);

new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
