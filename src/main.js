import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import 'lib-flexible'
import './plugins/museui'

import "./assets/css/common.less";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


router.beforeEach(function (to, from, next) {
  const msg = {
    to_name: to.name,
    from_name: from.name
  }
  store.commit('router_log',msg);

  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (localStorage.getItem('userinfo')!=null) {
      next();
    } else {
      next({
        path: '/Login'
      })
    }
  } else {
    next();
  }
})