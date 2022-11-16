<template>
  <div id="app">
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        :key="$route.fullPath"
      ></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
  name: "app",
  provide() {
    return {};
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
