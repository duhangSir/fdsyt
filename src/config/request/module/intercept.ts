import axios, { AxiosRequestConfig, Method } from "axios";
import { Dialog } from "vant";
import { router } from "@/config/router";
import cookie from "vue-cookie";
interface PendingType {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  cancel: Function;
}
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;
const instance = axios.create({
  timeout: 10000,
  responseType: "json",
});
const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      list.cancel("操作太频繁，请稍后再试");
      pending.splice(item, 1);
    }
  }
};

instance.interceptors.request.use(
  (request) => {
    removePending(request);
    request.cancelToken = new CancelToken((c) => {
      pending.push({
        url: request.url,
        method: request.method,
        params: request.params,
        data: request.data,
        cancel: c,
      });
    });
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    removePending(response.config);
    const errorCode = response?.data?.code;
    switch (errorCode) {
      case "401":
        break;
      default:
        break;
    }

    return response;
  },
  (error) => {
    const response = error.response;
    switch (response?.status) {
      case 401:
        Dialog.alert({
          message: "即将前往进行登录，请点击确定",
        }).then((res) => {
          cookie.delete("userInfo");
          location.reload()
        });
        break;
      case 403:
        break;
      case 500:
        break;
      case 503:
        break;
      default:
        break;
    }

    const config = error.config;
    const [RETRY_COUNT, RETRY_DELAY] = [3, 1000];

    if (config && RETRY_COUNT) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= RETRY_COUNT) {
        return Promise.reject(response || { message: error.message });
      }
      config.__retryCount++;
      const backoff = new Promise((resolve) => {
        setTimeout(() => {
          resolve(false);
        }, RETRY_DELAY || 1);
      });
      return backoff.then(() => {
        return instance(config);
      });
    }
    return Promise.reject(response || { message: error.message });
  }
);

export default instance;
