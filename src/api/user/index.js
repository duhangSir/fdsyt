import req from '@/config/request';

// export const login = (params) => {
// 	return req.get("/api/user/login", params);
// };
export const login = (data) => {
	return req.post("/api/user/login", data);
};
export const userInfo = (data) => {
	return req.post("Api/User/index", data)
}
export const getStoreCashierOrderList = (data) => {
	return req.post("addons/litestore/api.order/getStoreCashierOrderList", data);
};
export const getMyGoodsList = (data) => {
	return req.get('addons/litestore/api.Cashiercart/getMyGoodsList', data)
}
export const setBatchMyGoodsStockNum = (params) => {
	return req.post('addons/litestore/api.Cashiercart/setBatchMyGoodsStockNum', params)
}
export const setMyGoodsStockNum = (params) => {
	return req.post('addons/litestore/api.Cashiercart/setMyGoodsStockNum', params)
}
export const getShowlist = (data) => {
	return req.get('addons/litestore/api.category/Showlist', data)
}
export const bindingUSERIC = (data) => {
	return req.post(`addons/litestore/api.Cashiercart/bindUserIC?ic=${data.ic}&user_id=${data.user_id}`)
}
export const Cashiercartadd = (params) => {
	return req.get("addons/litestore/api.Cashiercart/add", params);
};
export const Cashiercartdelete = (params) => {
	return req.post("addons/litestore/api.Cashiercart/delete", params);
};
export const getlists = (params) => {
	return req.get("addons/litestore/api.Cashiercart/getlists", params);
};
export const multiDelete = (data) => {
	return req.post("addons/litestore/api.Cashiercart/multiDelete", data);
};
export const cashierOrderPay = (params) => {
	return req.get("addons/litestore/api.order/cashierOrderPay", params);
};
// export const cart = (params) => {
// 	return req.get("addons/litestore/api.order/cart", params);
// };
export const order_cart = (params) => {
	return req.post('addons/litestore/api.order/cart', params)
}
export const cart = (data) => {
	return req.get("addons/litestore/api.order/cart_pay", data);
}
export const setGoodsNum = (params) => {
	return req.get("addons/litestore/api.Cashiercart/setGoodsNum", params)
}
// ???????????????????????????
export const getImg = (data) => {
	return req.get("addons/litestore/api.order/createCashierOrderPayCode", data)
}
export const getCashierOrderPayStatus = (data) => {
	return req.get("addons/litestore/api.order/getCashierOrderPayStatus", data)
}
// ???????????? ??????/????????????
export const getThisMonthData = (data) => {
	return req.get('addons/litestore/api.Cashiertotal/getThisMonthData', data)
}
// ???????????? ????????????????????????
export const getAppointMonthUserConsumeRank = (data) => {
	return req.get('addons/litestore/api.Cashiertotal/getAppointMonthUserConsumeRank', data)
}
// ???????????? ??????????????????
export const getEverydayTotal = (data) => {
	return req.get('addons/litestore/api.Cashiertotal/getEverydayTotal', data)
}
//???????????? ?????????????????????
export const getGoodsInOutStatistics = (data) => {
	return req.get('addons/litestore/api.Cashiertotal/getGoodsInOutStatistics', data)
}
// ???????????? ??????????????????
export const getEverydayList = (data) => {
	return req.get('addons/litestore/api.Cashiertotal/getEverydayList', data)
}
export const getYearReportForm = (data) => {
	return req.get('addons/litestore/api.Cashiertotal/getYearReportForm', data)
}