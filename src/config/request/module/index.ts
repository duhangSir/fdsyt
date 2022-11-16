import Abstract from "./abstract";

import { AxiosRequest } from "./types";

class Basic extends Abstract {

  post(url: string, data?: any, config?: AxiosRequest) {
    return this.postRequest({ url, data, ...config });
  }
  get(url: string, params?: any, config?: AxiosRequest) {
    return this.getRequest({ url, params, ...config });
  }
  upload(url: string, data?: any, config?: AxiosRequest) {
    let headers = {
      "Content-Type": "multipart/form-data",
    };

    let temp = new FormData();
    if (data) {
      Object.keys(data).forEach((item) => {
        temp.append(item, data[item]);
      });
    }
    return this.postRequest({
      headers,
      url,
      data: temp,
      ...config,
    });
  }
}

export default Basic;
