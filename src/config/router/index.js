import Vue from "vue";
import Router from "vue-router";
import {
  Dialog
} from "vant"

import cookie from "vue-cookie";

Vue.use(Router);

import normalRoutes from "./modules/normal";
import store from "../store";


const routes = [{
  path: "*",
  redirect: "/index",
},];



routes.push(...normalRoutes)

// add route path
routes.forEach((route) => {
  route.path = route.path || "/" + (route.name || "");
});

const router = new Router({
  routes,
  mode: "hash",
  // mode: "hash",
//  mode:'hash|history|abstract',
  // base: "./"
});



router.beforeEach((to, from, next) => {
  document
    .querySelector("body")?.setAttribute("style", "background-color:#f2f2f2");
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }

  let userModel = cookie.get("userInfo");

  if (to.meta.requireAuth && !userModel) {
    next(false);
    Dialog.confirm({
      message: "即将前往进行登录，请点击确定"
    }).then(res => {
      store.dispatch('user/logout')
      location.reload()
    })
    return;
  }

  next();
});

export {
  router
};
