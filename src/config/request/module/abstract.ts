import instance from "./intercept";
import { AxiosRequest, CustomResponse } from "./types";
import { Notify, Toast } from "vant";
import { Message } from 'element-ui'
import cookie from "vue-cookie";
class Abstract {
  // 外部传入的baseUrl
  protected baseURL = process.env.VUE_APP_BASE_API;
  protected timeout = 20000;
  // 自定义header头
  protected headers: object = {};

  private apiAxios({
    baseURL = this.baseURL,
    headers = this.headers,
    timeout = this.timeout,
    method,
    url,
    data,
    params,
    responseType,
    unTip,
    cancelToken,
  }: AxiosRequest): Promise<CustomResponse> {
    // url解析
    // const _url = (url as string).split(".");
    // url = getUrl(_url[0], _url[1]);
    // let user = cookie.get("userInfo") || "{}";
    if(JSON.parse(cookie.get("userInfo") || "{}").token || "")
   
    headers.token = JSON.parse(cookie.get("userInfo") || "{}").token || "";
    return new Promise((resolve, reject) => {
      instance({
        baseURL,
        headers,
        timeout,
        method,
        url,
        params,
        data,
        responseType,
        cancelToken,
      })
        .then((res) => {
          // 200:服务端业务处理正常结束
          if (res.status === 200) {
            if (res.data.code == 1 || res.data.Success) {
              resolve(res.data);
            } else {
              if (!unTip) {
                Toast(res.data.msg || res.data.Msg || url + "请求失败");
              }
              reject({
                status: false,
                message: res.data?.msg || res.data?.Msg || url + "请求失败",
                data: res.data?.data || res.data?.ResultData,
                origin: res.data,
              });
            }
          } else {
            reject({
              status: false,
              message: res.data?.msg || res.data?.Msg || url + "请求失败",
              data: null,
            });
          }
        })
        .catch((err) => {
          let message =
            err?.data?.msg ||
            err?.data?.Msg ||
            err?.message ||
            url + "请求失败";
          // if (message == 'Network Error') {
          //   message = '网络错误'
          //   Notify({ type: "danger", message});
          // } else {
          Notify({ type: "danger", message });
          // }
          // eslint-disable-next-line
          reject({ status: false, message, data: null });
        });
    });
  }

  /**
   * GET类型的网络请求
   */
  protected getRequest({
    baseURL,
    headers,
    timeout,
    url,
    data,
    params,
    responseType,
    unTip,
    cancelToken,
  }: AxiosRequest) {
    return this.apiAxios({
      baseURL,
      headers,
      timeout,
      method: "GET",
      url,
      data,
      params,
      responseType,
      unTip,
      cancelToken,
    });
  }

  /**
   * POST类型的网络请求
   */
  protected postRequest({
    baseURL,
    headers,
    timeout,
    url,
    data,
    params,
    responseType,
    unTip,
    cancelToken,
  }: AxiosRequest) {
    return this.apiAxios({
      baseURL,
      headers,
      timeout,
      method: "POST",
      url,
      data,
      params,
      responseType,
      unTip,
      cancelToken,
    });
  }

  /**
   * PUT类型的网络请求
   */
  protected putRequest({
    baseURL,
    headers,
    timeout,
    url,
    data,
    params,
    responseType,
    unTip,
    cancelToken,
  }: AxiosRequest) {
    return this.apiAxios({
      baseURL,
      headers,
      timeout,
      method: "PUT",
      url,
      data,
      params,
      responseType,
      unTip,
      cancelToken,
    });
  }

  /**
   * DELETE类型的网络请求
   */
  protected deleteRequest({
    baseURL,
    headers,
    timeout,
    url,
    data,
    params,
    responseType,
    unTip,
    cancelToken,
  }: AxiosRequest) {
    return this.apiAxios({
      baseURL,
      headers,
      timeout,
      method: "DELETE",
      url,
      data,
      params,
      responseType,
      unTip,
      cancelToken,
    });
  }
}

export default Abstract;
