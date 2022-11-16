import Vue from 'vue';
import './config/rem';
import App from './App.vue';

import components from './config/components.js';
import store from './config/store/index.js'
import './index.css'
import { MessageBox } from 'element-ui'
Vue.prototype.$confirm = MessageBox.confirm;
import {
  router
} from "./config/router/index";

import $ from 'jquery';
window.jQuery = $;
window.$ = $;
Vue.mixin({
  beforeRouteLeave: function (to, from, next) {
    if (from && from.meta.rank && to.meta.rank && from.meta.rank > to.meta.rank) {
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
          if (this.$vnode.componentOptions) {
            var key = this.$vnode.key == null ?
              this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '') :
              this.$vnode.key;
            var cache = this.$vnode.parent.componentInstance.cache;
            var keys = this.$vnode.parent.componentInstance.keys;
            if (cache[key]) {
              if (keys.length) {
                var index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
      this.$destroy();
    }
    next();
  },
});

Vue.use(components);

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
