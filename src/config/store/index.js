import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const path = require("path");
const files = require.context("./module", false, /\.js$/);
const modules = {};
files.keys().forEach((key) => {
  const name = path.basename(key, ".js");
  modules[name] = files(key).default || files(key);
});

const store = new Vuex.Store({
  modules,
});

export default store;
