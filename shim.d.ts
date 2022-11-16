declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default component;
}

declare module "vue-cookie";
declare module "js-md5";
declare module "qs";
declare module "@/config/router";