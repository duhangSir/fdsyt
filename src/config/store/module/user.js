import cookie from "vue-cookies";
let uInfo = cookie.get("userInfo") || "{}";
let userInfo = uInfo
const state = {
  user_id: userInfo.user_id || '', //用户key
  userInfo: userInfo || {}, //用户信息
  token: userInfo.token || '',
};

const mutations = {
  SET_USER_ID: (state, user_id) => {
    state.user_id = user_id;
  },
  SET_USER_INFO: (state, user) => {
    state.userInfo = user;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
};

const actions = {
  /**
   * @description: 设置用户信息
   * @param {*} { commit }
   * @param {Object} userInfo 用户信息
   */
  setUserInfo({
    commit
  }, userInfo) {
    return new Promise((resolve, reject) => {
      commit("SET_TOKEN", userInfo.token);
      commit("SET_USER_ID", userInfo.user_id);
      cookie.set("userInfo", userInfo, -1);
      commit("SET_USER_INFO", userInfo);
      resolve()
      // cookie.setMaxAge(10);
    });
  },
  NewToken({
    commit
  }, newTokenTime) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("newTokenTime", newTokenTime);
      resolve()
    });
  },
  /**
   * @description: 用户登录，跳转主页
   * @param {*} { commit }
   * @param {Object} userInfo 用户信息
   */
  // login({ commit, state }, userInfo) {

  // },

  /**
   * @description: 获取用户信息
   * @param {*} { commit, state }
   */
  getUserInfo({
    commit,
    state,
    dispatch
  }) {
    return new Promise((resolve, reject) => {
    });
  },

  /**
   * @description: 退出登录
   * @param {*} { commit, state }
   */
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      cookie.remove("userInfo");
      localStorage.removeItem("account");
      localStorage.removeItem("password")
      localStorage.removeItem("scanning_stock_arr")
      localStorage.removeItem("card_no")
      localStorage.removeItem("newTokenTime");
      location.reload()
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
