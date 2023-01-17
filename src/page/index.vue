<template>
	<div style="position: relative;">
		<div class="fdLogo"><img style="width: 0.4rem;height: 0.4rem;vertical-align: middle;"
				src="../assets/3.png">丰德收银台</div>
		<el-tabs v-model="activeName" @tab-click="handleClick" style="position: relative;">
			<el-tab-pane><span slot="label"><i class="el-icon-share"></i>数据管理</span>
				<DataManage v-if="cookieUserInfo"></DataManage>
			</el-tab-pane>
			<el-tab-pane name="stock"><span slot="label"><i class="el-icon-box"></i>库存管理</span>
				<div class="stock kucun saoma_stock"
					style="width: 11.4rem;height: 6.4rem;background-color: #fff;margin: 0 auto;border-radius: 0.1rem;margin-top: 0.7rem;padding: 0.3rem;position: relative;"
					v-show="stock_show">
					<el-form :inline="true" :model="formInline" class="demo-form-inline">
						<el-form-item label="商品名称" style="margin-right: 0.5rem;">
							<el-input v-model="formInline.user" placeholder="请输入商品名称"></el-input>
						</el-form-item>
						<el-form-item label="商品类别：">
							<el-select v-model="formInline.region" placeholder="全部" @change="stock_searchList">
								<el-option label="全部" value="-2"></el-option>
								<el-option v-for="(item) in stock_arr" :key="item.id" :label="item.name"
									:value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item style="position: absolute;right: 0.25rem;">
							<el-button type="primary" class="stock_search" @click="stock_search">搜索</el-button>
							<el-button type="primary" @click="stock_addShop()">扫码添加</el-button>
						</el-form-item>
					</el-form>
					<el-empty style="margin: 1rem;" :image-size="200" v-if="stock_shopList.length == 0"></el-empty>
					<div class="stock_shopAll saoma_stock_shopAll"
						style="padding: 0.1rem 0.1rem 0 0;justify-content: start;overflow:auto;">
						<div class="stock_shop" style="margin:0.1rem 0.2rem;padding: 0.2rem 0;box-sizing: content-box;"
							v-for="(item) in stock_shopList" :key="item.spec[0].goods_id">
							<div class="stock_shop_img">
								<img class="saoma_stock_img" :src="item.image" style="width: 90%;height:70%">
							</div>
							<div class="stock_shop_inner">
								<div class="saoma_stock_name"
									style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">
									{{ item.goods_name }}</div>
								<div style="font-size: 0.14rem;color: #8d8d8d;">
									商品编码:{{ item.spec[0].goods_no }}
								</div>
								<div class="saoma_stock_Egou" style="margin: 0.1rem 0;font-size: 0.14rem;"
									v-if="item.is_cashier_goods == '1'"><span
										style="color: #8d8d8d;font-size: 0.12rem">E购月卡</span>{{
											item.cashier_goods_price
										}}
								</div>
								<div class="saoma_stock_Egou" style="margin: 0.1rem 0;font-size: 0.14rem;" v-else><span
										style="color: #8d8d8d;font-size: 0.12rem"></span>￥{{
											item.spec[0].goods_price
										}}+{{ item.score }}积分
								</div>
								<div>
									<el-input-number v-model="item.stock_num" @change="stock_handleChange(item)"
										:min="0" :max="1000000000000000" label="描述文字"></el-input-number>
								</div>
							</div>
						</div>
					</div>
					<div class="stock_page">
						<el-pagination @current-change="stock_handleCurrentChange" :page-size="stock_pagesize"
							background layout="prev,pager, next, total, jumper" :total="stock_total">
						</el-pagination>
						<div class="stock_GO" @click="stock_handleCurrentChange(stock_pagesize)">GO</div>
					</div>
				</div>
				<div class="stock_scanning" style="width: 11.4rem;height: 5.4rem;background-color: #fff;margin: 0 auto;
				border-radius: 0.1rem;margin-top: 0.7rem;padding: 0.3rem;position: relative;display: flex;" v-show="!stock_show">
					<div style="flex: 1;">
						<div v-if="scanning_stock_arr.length == 0" style="height: 80%;">
							<div
								style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 100%;">
								<img src="../assets/shop_kong.png">
								<div style="color:#c0c0c0;margin-top: 0.4rem;">暂无扫描结果，扫码后将自动添加</div>
							</div>
						</div>
						<div v-else class="stock ">
							<div style="display:flex;justify-content: center;font-size: 0.16rem;color: #b0afaf;">
								以下是已扫入的商品</div>
							<div class="stock_shopAll elTable"
								style="height: 5rem;box-sizing: content-box;padding-right: 0.1rem;">
								<div class="stock_shop" v-for="(item, index) in scanning_stock_arr" :key="index"
									style="width: 45%;margin-top: 0.2rem;">
									<div class="stock_shop_delete" @click="scanning_stock_delete(item)">x</div>
									<div class="stock_shop_img">
										<img class="saoma_stock_img" src="item.images" style="width: 90%;height:70%">
									</div>
									<div class="stock_shop_inner">
										<div class="saoma_stock_name"
											style="overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;">
											{{ item.goods_name }}</div>
										<div class="saoma_stock_Egou" style="margin: 0.1rem 0;font-size: 0.14rem;"><span
												style="color: #8d8d8d;font-size: 0.12rem">E购月卡</span>{{
													item.spec[0].goods_price
												}}
										</div>
										<div>
											<el-input-number v-model="item.stock_num" @focus="stock_num_focus"
												@blur="stock_num_blur" @change="scanning_stock_handleChange()" :min="1"
												:max="1000000000" label="描述文字"></el-input-number>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div style="flex:1;display: flex;flex-direction: column;align-items: center;height: 100%;">
						<div
							style="height: 3rem;display: flex;justify-content: center;align-items: center;color: #8d8d8d;flex-direction: column;">
							<span>请将扫码枪对准条形码</span>
						</div>
						<el-button v-if="scanning_stock_arr.length !== 0"
							style="width: 60%;background-color: red;color: #fff;margin-bottom: 0.2rem;"
							@click="scanning_stock_addShop">
							全部添加到库存管理(<span>{{ scanning_stock_arr.length }}</span>)</el-button>
						<div style="position:relative;width: 60%">
							<el-button type="primary" @click="stock_show = true"
								style="width: 100%;background-color: #ffe3e3;color: red;border: 1px solid red;position: absolute;left: 0;top: 0;z-index: 2;">
								返回上一步
							</el-button>
							<el-input @keyup="keydownBarcode()" @blur="barCodeFoucus($event)" @change="stock_input()"
								id="stock_input" v-model="stock_value"
								style="background-color:#ffe3e3;border: none;position: absolute;left: 0;top: 0;">
							</el-input>
						</div>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="a"><span slot="label"><i class="el-icon-postcard"></i>绑定会员卡</span>
				<div class="huiyuan"
					style="width: 11.4rem;height: 6.4rem;background-color: #fff;margin: 0 auto;border-radius: 0.1rem;margin-top: 0.7rem;padding: 0.3rem;">
					<div style="margin-bottom: 0.6rem;height: 0.1rem;">绑定会员卡号</div>
					<el-form :inline="true" ref="card_form" :model="card_form" label-width="0.8rem"
						style="width: 70%;margin: 0 auto;height: calc(100% - 2rem);">
						<el-form-item label="ID号" style="font-weight: bold;">
							<el-input v-model="card_form.user_id" style=""></el-input>
						</el-form-item>
						<template v-if="formShow">
							<el-form-item label="姓名" style="font-weight: bold;">
								<el-input v-model="card_form.nickname"></el-input>
							</el-form-item>
							<el-form-item label="手机号" style="font-weight: bold;">
								<el-input v-model="card_form.mobile"></el-input>
							</el-form-item>
							<el-form-item label="E购月卡" style="font-weight: bold;">
								<el-input v-model="card_form.egou"></el-input>
							</el-form-item>
							<el-form-item label="积分" style="font-weight: bold;">
								<el-input v-model="card_form.score"></el-input>
							</el-form-item>
							<el-form-item label="IC卡号" style="font-weight: bold;">
								<el-input v-model="card_form.ic"></el-input>
							</el-form-item>
						</template>
						<!-- <el-form-item label="会员ic卡号" style="font-weight: bold;">
							<el-input v-model="card_form.ic"></el-input>
						</el-form-item> -->
					</el-form>
					<!-- <span slot="footer" class="dialog-footer"> -->
					<!-- <el-button class="ml_1" type="primary" @click="getUserInfoButton">确认</el-button> -->
					<div style="margin: 0 auto;width: 2rem;" v-if="!formShow">
						<el-button type="primary" @click="getUserInfoButton" style="width: 2rem;height: 0.5rem;">确定
						</el-button>
					</div>
					<div style="margin: 0 auto;width: 5rem;" v-if="formShow">
						<el-button type="primary" @click="card_submit" style="width: 2rem;height: 0.5rem;">提交
						</el-button>
						<el-button @click="card_reset" style="width: 2rem;height: 0.5rem;">重置
						</el-button>
					</div>
				</div>
				<!-- <download-excel class="export-excel-wrapper" :data="json_data" :fields="json_fields" type="xls"
					worksheet="My Worksheet" name="用户信息">
					<el-button>导出EXCEL</el-button>
				</download-excel> -->
			</el-tab-pane>
			<el-tab-pane name="code"><span slot="label"><i class="el-icon-full-screen"></i>扫码</span>
				<div class="saoma"
					style="width: 11.4rem;height: 6.4rem;background-color: #fff;margin: 0 auto;border-radius: 0.1rem;margin-top: 0.7rem;padding: 0.3rem;">
					<div class="saoma"
						style="width: 6rem;height: 6.4rem;text-align: center;overflow-y: scroll;display: inline-block;">
						<span style="color: #666666;font-size: 0.18rem;">以下是已扫入商品</span>
						<div style="margin-top: 0.1rem;text-align: left;">
							<div v-for="(item, index) in saomacartdata" :key="index">
								<div v-for="(tit, x) in item.goods" :key="x"
									style="width: 2.7rem;height: 1.3rem;background-color: #f7f9fa;display: inline-block;margin-left: 0.15rem;margin-top: 0.15rem;border: 0.01rem solid #cccccc;border-radius: 0.05rem;position: relative;">
									<i @click="Cashiercartdelete(tit.goods_id, tit.goods_sku_id)"
										style="font-size: 0.28rem;position: absolute;top: -0.1rem;right: -0.1rem;color:red;"
										class="el-icon-error"></i>
									<img style="width: 0.8rem;height: 0.8rem;display: inline-block;vertical-align:top;margin-top: 0.25rem;margin-left: 0.1rem;"
										:src="tit.image">
									<div
										style="width: 1.7rem;display: inline-block;overflow: hidden;margin-top: 0.2rem;font-size: 0.16rem;margin-left: 0.1rem;">
										{{ (tit.goods_name).slice(0, 29) }}
										{{ tit.is_egou }}
										<div style="font-size: 0.14rem;margin-top: 0.2rem;">
											<span v-if="tit.is_cashier_goods == 0">
												<span
													style="color: red;font-weight: 600;font-size: 0.18rem;margin-right: 0.10rem;">￥{{
														parseInt(tit.goods_price - tit.score)
													}}+{{ tit.score }}积分</span>
											</span>
											<span v-if="tit.is_cashier_goods == 1">
												月卡兑换<span
													style="color: red;font-weight: 600;font-size: 0.18rem;margin-right: 0.10rem;">￥{{
														parseInt(tit.cashier_goods_price)
													}}</span>
											</span>
											<span
												style="color: red;font-weight: 600;font-size: 0.18rem;margin-right: 0.05rem;">*{{
													tit.total_num
												}}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="saoma"
						style="width: 5.2rem;height: 6.4rem;display: inline-block;vertical-align: bottom;">
						<div class="saoma_add_tianjia"
							style="text-align: center;font-size: 0.22rem;border-bottom: 0.02rem solid red;width: 2rem;margin: 0 auto;padding: 0.1rem;margin-top: 0.5rem;">
							输入条码添加
						</div>
						<el-input id="inputs" class="saoma_input"
							style="width: 3.5rem;margin: 0 auto;display: block;margin-top: 1rem;margin-bottom: 1.5rem;"
							v-model="cartcode" placeholder="请输入商品编码" @blur="e => e.target.focus()"
							@keyup="keydownBarcode()" @change="clickBarCode()">
						</el-input>
						<el-button @click="Cashiercartadd()" id="Button"
							style="width: 3.5rem;display: block;margin: 0 auto;margin-top: 0.3rem;font-size: 0.16rem;"
							type="primary" round>确认添加</el-button>
						<el-button @click="deleteCashiercart()" id="Button"
							style="width: 3.5rem;display: block;margin: 0 auto;margin-top: 0.3rem;font-size: 0.16rem;"
							type="warning" round>清空购物车<span
								style="font-size:0.12rem">(---建议添加购物车出现bug调用)</span></el-button>
						<el-button @click="hhhh()"
							style="width: 3.5rem;display: block;margin: 0 auto;margin-top: 0.3rem;font-size: 0.16rem;background-color: #ffe3e3;color: #f44444;"
							type="primary" round>全部添加到购物车（商品种类数量）</el-button>

					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="order"><span slot="label"><i class="el-icon-document-copy"></i>订单</span>
				<div class="ordertab">
					<div style="overflow-y: auto;width: 100%;height: 90%;" v-if="detailedShow">
						<div v-for="(item, index) in tableData" :key="index" style="overflow-x: auto;">
							<el-table :data="item.goods.slice(0, 1)" :border="true" height="140" style="width: 100%;">
								<el-table-column prop="date" width="1100">
									<template slot="header" slot-scope="scope">
										{{ order[index].creattime_text }}<span class="taborder">订单号:{{
											order[index].order_no
										}}

											<span class="detailed" @click="detailed(item.goods, index)">详情</span>
										</span>
										{{ order[index].pay_status == 10 ? '待支付' : '已完成' }}
										<el-button v-if="(order[index].pay_status == 10)" @click="cancelOrder(item)"
											size="mini">取消订单</el-button>
									</template>

									<template slot-scope="scope">
										<div style="width: 5rem;display: inline-block;">
											<img style="width: 0.6rem;height: 0.6rem;vertical-align: middle;"
												:src="scope.row.image">{{ scope.row.goods_name }}
										</div>
										<!-- 单价：￥{{ scope.row.goods_price }}<span style="margin: 0 0.2rem;">数量：{{
												scope.row.total_num}}</span>小计：{{ scope.row.total_price }} -->
										<span v-if="order[index].pay_status == 10">
											小计：￥{{
												order[index].other_pay_info.offline - order[index].score_price
											}}+{{ order[index].other_pay_info.score }}积分+{{
	order[index].other_pay_info.egou
}}E购月卡</span>
										<span v-else-if="order[index].pay_status !== 10">
											小计：￥
											<span v-if="order[index].other_pay_info.use_score !== 0">{{
												order[index].other_pay_info.offline - order[index].score_price
											}}</span>
											<span v-else>{{
												order[index].other_pay_info.offline
											}}</span>
											+{{ order[index].other_pay_info.use_score }}积分+{{
												order[index].other_pay_info.egou
											}}E购月卡
										</span>


										<el-button @click="printReceipt(index)" v-if="!(order[index].pay_status == 10)"
											style="position: absolute;right: 0.1rem;top: 50%;transform: translate(0 ,-50%);"
											size="mini">打印小票</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
					<div v-if="!detailedShow">
						<el-table class="elTable" :data="detailedList" :border="true" height="535" style="width: 100%;">
							<el-table-column prop="date" width="1166">
								<template slot="header" slot-scope="scope">
									{{ order[detailedIndex].creattime_text }}<span class="taborder">订单号:{{
										order[detailedIndex].order_no
									}}
										<el-button size="mini" @click="printReceipt(detailedIndex)">打印小票</el-button>
									</span>
									{{
										order[detailedIndex].pay_status == 10
											? '待支付' : '已完成'
									}}
									<span>E购支付</span>
									<el-button type="primary" size="mini" @click="detailedShow = true">返回
									</el-button>
								</template>

								<template slot-scope="scope">
									<div style="width: 6rem;display: inline-block;">
										<img style="width: 0.6rem;height: 0.6rem;vertical-align: middle;"
											:src="scope.row.image">{{ scope.row.goods_name }}

									</div>
									<span v-if="scope.row.is_egou_goods == 0">单价：￥{{
										scope.row.goods_price
									}}+{{ order[detailedIndex].other_pay_info.score / scope.row.total_num }}积分<span
											style="margin: 0 0.2rem;">数量：{{
												scope.row.total_num
											}}</span>小计：{{ scope.row.total_price }}</span>
									<span v-else>单价：{{ scope.row.goods_price }}E购月卡<span style="margin: 0 0.2rem;">数量：{{
										scope.row.total_num
									}}</span>小计：{{ scope.row.total_price }}</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="tabend" v-if="!detailedShow">
						<span v-if="order[detailedIndex].pay_status == 10">
							<span>实付：<span class="redstrong">￥{{
								order[detailedIndex].other_pay_info.offline - order[detailedIndex].score_price
							}}
									+{{ order[detailedIndex].other_pay_info.score }}积分+ {{
										order[detailedIndex].other_pay_info.egou
									}}E购月卡</span></span>
						</span>
						<span v-else>
							<span v-if="order[detailedIndex].other_pay_info.use_score == 0">
								<span>实付：<span class="redstrong">￥{{
									order[detailedIndex].other_pay_info.offline
								}}
										+{{ order[detailedIndex].other_pay_info.use_score }}积分+ {{
											order[detailedIndex].other_pay_info.egou
										}}E购月卡</span></span></span>
							<span v-else>实付：<span class="redstrong">￥{{
								order[detailedIndex].other_pay_info.offline - order[detailedIndex].score_price
							}}
									+{{ order[detailedIndex].other_pay_info.use_score }}积分+ {{
										order[detailedIndex].other_pay_info.egou
									}}E购月卡</span></span>
						</span>
					</div>
					<div class="pagemode" v-show="detailedShow">
						<el-pagination :current-page.sync="page" background @current-change="getindexorder()"
							layout="prev, pager, next" :page-size="1" :total="count / 5"></el-pagination>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane name="cart"><span slot="label"><i class="el-icon-shopping-cart-full"></i>购物车</span>
				<div class="saoma"
					style="width: 11.4rem;height: 6.4rem;background-color: #fff;margin: 0 auto;border-radius: 0.1rem;margin-top: 0.7rem;padding: 0.3rem;">
					<el-table class="saoma_table" v-show="!show" ref="roleTable" :data="cartdata" :border="true"
						height="500" style="width: 100%" @selection-change="handleSelectionChange">>
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="date" width="1111">
							<template slot="header" slot-scope="scope">全选<span style="margin: 0 1rem;color: red;"
									@click="multiDelete()">删除</span>已选商品<span
									style="color: red;font-size: 0.20rem;font-weight: 600;">{{
										selectdata.length
									}}</span>件<span style="margin: 0 2rem;">合计：<span
										style="color: red;font-weight: 600;">
										￥{{ EgouList.offline_total - EgouList.order_total_score }}+{{
											EgouList.order_total_score
										}}积分+{{
	EgouList.egou_total
}}E购月卡
									</span></span>
								<el-button @click="settlement" type="primary">结算</el-button>
							</template>
							<template slot-scope="scope">
								<!-- <div v-if="scope.row.is_cashier_goods == 0">E购商品：<span>是</span>/<span
										style="color:red">否</span></div>
								<div v-else-if="scope.row.is_cashier_goods == 1">E购商品：<span
										style="color:red">是</span>/<span>否</span></div> -->
								<img style="width: 0.6rem;height: 0.6rem;vertical-align: middle;"
									:src="scope.row.image">{{ scope.row.goods_name }}<span
									style="margin-left: 0.5rem;"><span v-if="scope.row.is_cashier_goods == '0'">￥{{
										parseInt(scope.row.goods_price - scope.row.score)
									}}</span>
									<span v-if="scope.row.is_cashier_goods == '1'">{{
										parseInt(scope.row.cashier_goods_price)
									}}</span>
									<span style="color:red;" v-if="scope.row.is_cashier_goods == '0'">+{{
										scope.row.score
									}}积分</span>
									<span v-if="scope.row.is_cashier_goods == '1'" style="color:red;">E购月卡</span>
								</span>
								<el-input-number style="width: 1.5rem;margin-left: 0.5rem;margin-right: 0.5rem;"
									v-model="scope.row.total_num" @change="handleChange(scope.row)" :min="1"
									:max="1000">
								</el-input-number>
								合计：<span v-if="scope.row.is_cashier_goods == 0">{{
									parseInt(scope.row.total_price -
										scope.row.total_score)
								}}+{{ scope.row.total_score }}积分</span>
								<span v-if="scope.row.is_cashier_goods == 1">{{
									parseInt(scope.row.total_price)
								}}</span>
								<span style="margin-left: 1rem;color: red;"
									@click="Cashiercartdelete(scope.row.goods_id, scope.row.goods_sku_id)">删除</span>
							</template>
						</el-table-column>
					</el-table>
					<div style="text-align: center;display: flex;;margin-top: 1rem;" v-if="show" class="saoma_vip">
						<div style="flex: 1;">
							<span style="font-size: 0.2rem;font-weight: 600;">请输入会员卡编号完成付款</span>
							<el-input class="saoma_vipcode"
								style="width: 3.5rem;margin: 0 auto;display: block;margin-top: 1rem;margin-bottom: 1.5rem;"
								v-model="vipcode" placeholder="请输入会员卡编号完成付款" @change="passwordVisble">
							</el-input>
							<el-button
								style="width: 3.5rem;display: block;margin: 0 auto;margin-top: 0.3rem;font-size: 0.16rem;"
								type="primary" round @click="passworddialogVisible = true">确认</el-button>
							<el-button
								style="width: 3.5rem;display: block;margin: 0 auto;margin-top: 0.3rem;font-size: 0.16rem;background-color: #ffe3e3;color: #f44444;"
								type="primary" round @click="show = false">返回上一步</el-button>
						</div>
						<div
							style="flex: 1;display: flex;flex-direction: column;justify-content: center;align-items: center;">
							<div
								style="background-color: #f9f9f9;border: 1px solid #f5f5f5;width: 2.5rem;height: 2.5rem;display: flex;align-items: center;justify-content: center;">
								<img :src="qrcodeImage" style="width:2rem;height:2rem;" />
							</div>
							<span style="margin-top:0.1rem;">扫码完成付款</span>
						</div>
					</div>
					<el-dialog style="margin-top: 1rem;" title="请输入支付密码" :visible.sync="passworddialogVisible"
						width="40%" :before-close="handleClose">
						<div style="display:flex;align-items: center;margin-bottom: 0.1rem;">
							<span style="padding-left:0.2rem">实际收款金额：</span>
							<div class="flex">

								<div v-if="vipCodeScore > EgouList.order_total_score">
									<span style="color:red">￥{{
										EgouList.offline_total - EgouList.order_total_score
									}}</span>

									+<span style="color:red">{{
										EgouList.order_total_score
									}}</span>积分+
								</div>
								<div v-else>
									<span style="color:red">￥{{ EgouList.offline_total - vipCodeScore }}</span>

									+<span style="color:red">{{
										vipCodeScore
									}}</span>积分+
								</div>



								<span style="color:red">{{
									EgouList.egou_total
								}}</span>E购月卡
							</div>
						</div>
						<div style="display:flex;align-items: center;">
							<span style="padding:0 0.2rem">支付密码</span>
							<el-input v-model="passwordInput" style="width:2.5rem;">
							</el-input>
						</div>

						<span slot="footer" class="dialog-footer" style="display: flex;justify-content: center;">
							<el-button type="primary" @click="cashierOrderPay()">确 定</el-button>
						</span>
					</el-dialog>

				</div>
			</el-tab-pane>
			<el-tab-pane name="user"><span slot="label"><i class="el-icon-user"></i>{{
				login?
			$store.state.user.user_id
					+ '(退出登录)' : '未登录'
			}}</span>
				<div class="login">
					<img class="loginimg" src="../assets/2.png">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="ruleForm">
						<h3>你好，请先登录</h3>
						<el-form-item prop="account">
							<el-input type="text" suffix-icon="el-icon-user" v-model="ruleForm.account"
								placeholder="请输入用户名" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input type="password" v-model="ruleForm.password" placeholder="请输入密码" show-password
								autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item>
							<el-checkbox v-model="checked">记住用户名</el-checkbox>
							<el-button class="loginbut" type="primary" @click="submitForm('ruleForm')">立即登录
							</el-button>
						</el-form-item>
					</el-form>
				</div>

			</el-tab-pane>
		</el-tabs>
	</div>

</template>

<script>
import DataManage from '../components/dataManage.vue'
import {
	login,
	getStoreCashierOrderList,
	Cashiercartadd,
	Cashiercartdelete,
	getlists,
	cart,
	multiDelete,
	cashierOrderPay,
	setGoodsNum,
	userInfo,
	getUserInfo,
	bindingUSERIC,
	getMyGoodsList,
	getShowlist,
	setMyGoodsStockNum,
	setBatchMyGoodsStockNum,
	order_cart,
	getImg,
	getCashierOrderPayStatus,
	cancelCashierOrder,
	clearAll,
	getUserScore
} from "@/api/user";
import cookie from "vue-cookies";
import getLodop from "@/api/lodop/LodopFuncs.js";

const Base64 = require('js-base64').Base64
export default {
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入用户名'));
			} else {
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				callback();
			}
		};
		return {
			cookieUserInfo: {},
			focusStatus: false,
			vipCodeScore: 0,
			formShow: false,
			detailedShow: true,
			detailedIndex: 0,
			stock_num: 1,
			stock_pagesize: 16,
			stock_total: 0,
			EgouData: {},
			qrcodeImage: '',
			EgouList: {
				egou_total: 0,
				order_total_score: 0,
				offline_total: 0
			},
			inputClickNumber: 0,
			urlBASE: '',
			stock_value: "",
			stock_currentPage: 1,
			stock_show: true,
			stock_arr: [],
			scanning_stock_arr: JSON.parse(localStorage.getItem("scanning_stock_arr")) || [],
			stock_shopList: [],
			stock_shopshow: false,
			formInline: {
				user: '',
				region: '-2'
			},
			detailedList: [],
			passworddialogVisible: false,
			tableData: [],
			order: [],
			cartcode: '',
			card_form: {
				user_id: "",
				nickname: '',
				score: "",
				egou: "",
				mobile: "",
				ic: "",
			},
			saomacartdata: [],
			vipcode: '',
			show: false,
			ruleForm: {
				account: '',
				password: ''
			},

			count: 0,
			money: 0,
			page: 1,
			activeName: 'user',
			cartdata: [],
			checked: false,
			login: false,
			selectdata: [],
			seleinde: [],
			rules: {
				account: [{
					validator: validatePass,
					trigger: 'blur'
				}],
				password: [{
					validator: validatePass2,
					trigger: 'blur'
				}],
			},
			passwordInput: '',
			orderNumber: '',
			inputs: "", //条码扫码保存的数据
			timearr: [0, 0],//扫条码记录间隔时长用来判断是不是扫码枪
			isScanningGun: false,//判断是否扫码枪
			timer: null,
			printArr: []
		}
	},
	components: { DataManage },
	methods: {
		deleteCashiercart() {
			clearAll().then((item) => {
				console.log(item)
				this.$toast('清除成功')
				this.getlists()
			})
		},
		card_reset() {
			this.formShow = false
			for (let key in this.card_form) {
				this.card_form[key] = ''
			}
		},
		getUserInfoButton() {
			getUserInfo({ user_id: this.card_form.user_id }).then((item) => {
				console.log(item.data)
				this.formShow = true
				this.card_form = {
					user_id: item.data.id,
					nickname: item.data.nickname,
					mobile: item.data.mobile,
					egou: (item.data.egou - item.data.egou_used).toFixed(2),
					score: item.data.score_new,
					ic: item.data.ic,
				}
				if (item.data.egou - item.data.egou_used < 0) {
					this.card_form.egou = 0
				}
				if (item.data.score < 0) {
					this.card_form.score = 0
				}
				// id
				// nickname
				// mobile
				// item.data.egou - item.data.egou_used
				// score
				// card_no
			})
		},
		cancelOrder(data) {
			this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				console.log(data)
				cancelCashierOrder({ id: data.id }).then((item) => {
					this.$toast("删除成功");
					this.getStoreCashierOrderList()
				})
			}).catch(() => {
			});
		},
		barCodeInput() {
			console.log(1)
		},
		stock_num_focus() {
			this.focusStatus = true
			console.log(1)
		},
		barCodeFoucus(e) {
			setTimeout(() => {
				if (this.focusStatus == false) e.target.focus()
			}, 1000);
		},
		handleClose() {
			this.passworddialogVisible = false
			this.timer = setInterval(() => {
				this.getCashierOrderPayStatus(this.orderNumber)
			}, 2000);
		},
		passwordVisble() {
			this.passworddialogVisible = true
			console.log(1)
			getUserScore({ ic: this.vipcode }).then((item) => {
				this.vipCodeScore = item.data.score
			})
			clearInterval(this.timer)
		},
		inputChange() {
			if (this.inputClickNumber > 0) return;
			this.inputClickNumber += 10;

			setTimeout(() => {
				console.log(this.inputClickNumber)
			}, 10);
		},
		stock_search() {
			if (this.formInline.user == "") {
				this.$toast("商品名称不能为空")
				return
			}
			this.GetMyGoodsList({ page: this.stock_currentPage, id: '-1', pageSize: this.stock_pagesize, name: this.formInline.user })
		},
		stock_handleCurrentChange(pagesize) {
			this.GetMyGoodsList({ page: pagesize, id: this.formInline.region, pageSize: this.stock_pagesize })
		},
		scanning_stock_addShop() {
			let json_data = []
			this.scanning_stock_arr.forEach((item) => {
				json_data.push({ id: item.goods_id, num: item.stock_num })
			})
			setBatchMyGoodsStockNum({ json_data }).then((item) => {
				this.$toast(item.msg)
				this.scanning_stock_arr = []
				localStorage.setItem("scanning_stock_arr", JSON.stringify(this.scanning_stock_arr))
				this.GetMyGoodsList({ page: this.stock_currentPage, id: this.formInline.region, pageSize: this.stock_pagesize })
			})
		},
		stock_num_blur() {
			this.focusStatus = false
			const input = document.getElementById('stock_input')
			// this.barCodeFoucus(input)
			input.focus()
			// console.log(input)
		},
		scanning_stock_handleChange() {

		},
		stock_handleChange(e) {
			const obj = {
				goods_id: e.spec[0].goods_id,
				stock_num: e.stock_num
			}
			setMyGoodsStockNum(obj).then((item) => {
				this.$toast(item.msg)
			})
			// let json_data=({ id: e.spec[0].goods_id, num: e.stock_num })
			// setBatchMyGoodsStockNum({ json_data }).then((item) => {
			// 	this.$toast(item.msg)
			// })
		},
		stock_addShop() {
			var that = this
			that.stock_show = false
			this.$nextTick(() => {
				const input = document.getElementById('stock_input')
				input.focus()
			})
		},
		stock_searchList() {
			this.formInline.user = ""
			this.GetMyGoodsList({ page: this.stock_currentPage, id: this.formInline.region, pageSize: this.stock_pagesize })
		},
		scanning_stock_delete(ite) {
			console.log(ite)
			const index = this.scanning_stock_arr.findIndex(item => {
				console.log(item)
				return item.goods_id === ite.goods_id
			})
			this.scanning_stock_arr.splice(index, 1)
			localStorage.setItem("scanning_stock_arr", JSON.stringify(this.scanning_stock_arr))
		},
		getShowlist() {
			if (this.stock_arr.length === 0) {
				getShowlist({ is_terminal: 0 }).then((res) => {
					res.data.categorydata.forEach((item) => {
						this.stock_arr.push({ name: item.name, id: item.id })
					})
					this.urlBASE = process.env.VUE_APP_BASE_API
				})
			}
			this.GetMyGoodsList({ page: this.stock_currentPage, id: this.formInline.region, pageSize: this.stock_pagesize })
		},
		GetMyGoodsList(obj) {
			console.log(obj)
			getMyGoodsList(obj).then((res) => {
				console.log(res.data.pagedata)
				const { total, data } = res.data.pagedata
				this.stock_total = total
				this.stock_shopList = data
			})
		},
		stock_input() {
			var that = this
			getMyGoodsList({ goods_no: that.stock_value }).then((res) => {
				that.stock_value = ""
				const { data } = res.data.pagedata
				const a = this.scanning_stock_arr.find((item) => {
					return item.goods_id === data[0].goods_id
				})
				if (a) {
					this.$toast("添加栏已有相同货物")
				} else {
					this.scanning_stock_arr.push(data[0])
					localStorage.setItem("scanning_stock_arr", JSON.stringify(this.scanning_stock_arr))
				}
				console.log(this.scanning_stock_arr)
			})
		},
		detailed(data, index) {
			this.detailedShow = !this.detailedShow
			this.detailedIndex = index
			this.detailedList = data
		},
		card_submit() {
			bindingUSERIC({ user_id: this.card_form.user_id, ic: this.card_form.ic }).then((res) => {
				this.$toast(res.msg);
				this.card_form = {}
				this.formShow = false
			})
		},
		clickBarCode() {
			if (this.inputClickNumber > 0) return;
			this.inputClickNumber++;
			setTimeout(() => {
				this.inputClickNumber = 0
			}, 500);
			Cashiercartadd({
				goods_no: this.cartcode,
				goods_num: 1
			}).then((res) => {
				this.cartcode = ""
				this.$toast("加入成功");
				this.getlists()
			})
		},
		keydownBarcode() {
			if (this.inputs.length % 2 != 0) {
				//求余数不为0是奇数
				this.timearr[0] = new Date().getTime();
			} else {
				this.timearr[1] = new Date().getTime();
			}
			//当输入第二位时判断两次输入的间隔，判断是否为手动输入，间隔过长就是手动
			if (this.inputs.length > 1 && Math.abs(this.timearr[1] - this.timearr[0]) < 40) {
				this.isScanningGun = true
			}
		},

		// 结算
		settlement() {
			const obj = {
				// token: JSON.parse(cookie.get('userInfo')).token,
				cart_type: 1,
				password: this.vipcode,
				type: 'egou'
			}
			if (this.seleinde.length == 0) {
				this.$toast("请选择结算商品")
			} else {
				order_cart({ cart_type: 1, goodslist: this.seleinde }).then((res) => {
					cart({
						cart_type: 1, goodslist: this.seleinde
					}).then((ret) => {
						this.show = true
						this.orderNumber = ret.data
						getImg({ pay_sn: ret.data }).then((item) => {
							console.log(2)
							this.qrcodeImage = process.env.VUE_APP_BASE_API + '/' + item.data.code_image
							this.show = true
							this.orderNumber = ret.data
							this.timer = setInterval(() => {
								this.getCashierOrderPayStatus(ret.data)
							}, 2000);
						})
					});
				})
			}
		},
		getCashierOrderPayStatus(pay) {
			if (this.timer == null) {
				return
			}
			getCashierOrderPayStatus({ pay_sn: pay }).then((item) => {
				if (item.data == 20) {
					clearInterval(this.timer)
					this.timer = null
					this.$toast("付款成功");
					this.show = false
					this.vipcode = ""
					this.$confirm('是否要打印购物小票？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'sucssess'
					}).then(() => {
						this.PrintMytable()
						this.AllDelete()
						return
					}).catch(() => {
						this.AllDelete()
					});
					this.getStoreCashierOrderList()
					this.activeName = 'order'
				}
			})
		},
		handleClick(tab, event) {
			if (tab._props.name == 'code') {
				this.getlists()
			} else if (tab._props.name == 'order') {
				this.getStoreCashierOrderList()
			} else if (tab._props.name == 'cart') {
				this.getliststwo()
			} else if (tab._props.name == 'user') {
				if (this.login) {
					this.$store.dispatch("user/logout").then((res) => {
						console.log(res);
					});
				}
			} else if (tab._props.name == 'stock') {
				if (this.stock_shopList !== '') {
					this.getShowlist()
				}
				this.ruleForm.account = ''
				this.ruleForm.password = ''
			}
		},
		hhhh() {
			this.getliststwo()
			this.activeName = 'cart'
			this.show = false
		},
		printReceipt(index) {
			this.$confirm('是否要打印购物小票？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'sucssess'
			}).then(() => {
				console.log(index)
				this.PrintMytable(this.tableData[index].goods, index)
			}).catch(() => {
				console.log('已取消')
			});
		},
		cashierOrderPay() {
			const obj = {
				// token: JSON.parse(cookie.get('userInfo')).token,
				type: 'egou',
				pay_sn: this.orderNumber,
				card_no: this.vipcode,
				password: this.passwordInput
			}
			//  结算先走生成订房接口    再拿订单号，和会员卡号走付款接口
			// { card_no: this.vipcode }
			cashierOrderPay(obj).then((res) => {
				this.passworddialogVisible = false
				clearInterval(this.timer)
				console.log(res);
				this.$toast("付款成功");
				this.show = false
				this.vipcode = ""
				this.passwordInput = ""
				this.$confirm('是否要打印购物小票？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'sucssess'
				}).then(() => {
					getStoreCashierOrderList({
						is_page: 1,
						dataType: 'all',
						page: 1,
						pageSize: 1,
					}).then((item) => {
						this.printArr = item.data.list[0]
						setTimeout(() => {
							this.PrintMytable()
							this.AllDelete()
						}, 500);
					})
					return
				}).catch(() => {
					this.AllDelete()
				});
				this.getStoreCashierOrderList()
				this.activeName = 'order'
			}).catch((err) => {
				this.vipcode = ""
				this.passwordInput = ""
				this.passworddialogVisible = false
			})
		},
		multiDelete() {
			multiDelete({
				index: this.seleinde
			}).then((res) => {
				this.$toast("删除成功");
				this.getliststwo()
			});
		},
		handleSelectionChange(e) {
			console.log(e)
			this.selectdata = e
			this.money = 0
			this.seleinde = []
			this.EgouList = {
				egou_total: 0,
				order_total_score: 0,
				offline_total: 0
			}
			this.selectdata.forEach((item) => {
				console.log(item)
				if (item.is_cashier_goods == '1') {
					this.EgouList.egou_total += parseInt(item.total_price)
				}
				if (item.is_cashier_goods == '0') {
					this.EgouList.order_total_score += parseInt(item.total_score)
					this.EgouList.offline_total += parseInt(item.total_price)
				}
			})
			console.log(this.EgouList)
			for (var i = 0; i < this.selectdata.length; i++) {
				this.money += parseFloat(this.selectdata[i].total_price)
				this.seleinde.push(this.selectdata[i].goods_id + '_')
			}
		},
		getindexorder(e) {
			this.getStoreCashierOrderList()
		},
		handleChange(e) {
			//直接改数量的接口
			const obj = {
				num: e.total_num,
				goods_id: e.goods_id,
				goods_sku_id: e.goods_sku_id
			}
			setGoodsNum(obj).then((res) => {
				e.total_price = (e.total_num * e.goods_price).toFixed(2)
				this.$toast('修改成功')
				this.getliststwo()
				this.EgouList = {
					egou_total: 0,
					order_total_score: 0,
					offline_total: 0
				}
				this.selectdata.forEach((item) => {
					if (item.is_cashier_goods == '1') {
						this.EgouList.egou_total += parseInt(item.total_price)
					}
					if (item.is_cashier_goods == '0') {
						this.EgouList.order_total_score += parseInt(item.total_score)
						this.EgouList.offline_total += parseInt(item.total_price)
					}
				})
			})
		},
		getlists() {
			getlists({}).then((res) => {
				this.EgouData = res.data
				this.saomacartdata = res.data.goods_list
				const inputs = document.getElementById('inputs')
			});

		},
		getliststwo() {
			getlists({}).then((res) => {
				this.cartdata = []
				for (var i = 0; i < res.data.goods_list.length; i++) {
					for (var j = 0; j < res.data.goods_list[i].goods.length; j++) {
						this.cartdata.push(res.data.goods_list[i].goods[j])
					}
				}
				console.log(this.cartdata);

				this.$nextTick(() => {
					this.cartdata.forEach((item) => {
						this.$refs.roleTable.toggleRowSelection(item, true)
					})
				})
				// this.handleSelectionChange(this.cartdata)
			});
		},
		Cashiercartadd() {
			if (this.inputClickNumber > 0) return;
			this.inputClickNumber++;
			setTimeout(() => {
				this.inputClickNumber = 0
			}, 10);
			Cashiercartadd({
				goods_no: this.cartcode,
				goods_num: 1
			}).then((res) => {
				this.cartcode = ""
				this.$toast("加入成功");
				this.getlists()
			})
		},
		AllDelete() {
			var that = this
			that.handleSelectionChange(that.cartdata)
			that.multiDelete()
			that.selectdata.length = 0
			that.money = 0
		},
		Cashiercartdelete(a, b) {
			a = a + '_'
			multiDelete({
				index: a
			}).then(async (res) => {
				this.$toast("删除成功")
				setTimeout(() => {
					this.getliststwo()
				}, 1000);
				this.getlists()
			});
		},
		getStoreCashierOrderList() {
			getStoreCashierOrderList({
				is_page: 1,
				dataType: 'all',
				page: this.page,
				pageSize: 8,
			}).then((res) => {
				console.log(res);
				this.count = res.data.count
				this.tableData = []
				this.order = []
				console.log(res.data.list)
				res.data.list.forEach((item) => {
					this.tableData.push(item)
					this.order.push(item)
				})
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					login(
						this.ruleForm,
					).then((res) => {
						if (this.checked) {
							console.log(this.checked)
							localStorage.setItem("account", this.ruleForm.account)
							localStorage.setItem("password", this.ruleForm.password)
						}
						this.$store.dispatch("user/setUserInfo", res.data.userinfo).then((res) => {
							this.getlists()
							this.activeName = 'code'
							this.login = true
						});
						userInfo({ token: res.data.userinfo.token }).then((res) => {
							console.log(res);
							localStorage.setItem('card_no', res.data.card_no)
							this.cookieUserInfo = cookie.get('userInfo')
						})
					});
				} else {
					return false;
				}
			});
		},
		// 调整当前日期格式
		getDate(date) {
			var year = date.getFullYear();    //  返回的是年份
			var month = (date.getMonth() + 1).toString().padStart(2, 0);  //  返回的月份上个月的月份，记得+1才是当月
			var dates = date.getDate().toString().padStart(2, 0);       //  返回的是几号
			var h = date.getHours().toString().padStart(2, 0);
			var m = date.getMinutes().toString().padStart(2, 0);
			var s = date.getSeconds().toString().padStart(2, 0);
			return `购买时间:${year}-${month}-${dates} ${h}:${m}:${s}`
		},
		PrintMytable(goods, index) {
			// 订单页面进入
			if (goods) {
				console.log(goods)
				let LODOP;
				LODOP = getLodop();
				LODOP.PRINT_INIT("");
				LODOP.ADD_PRINT_TEXT(10, 40, 300, 40, "丰德E购");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
				const a = `订单编号:${this.order[index].order_no}`
				LODOP.ADD_PRINT_TEXT(50, 10, 300, 25, a);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
				const time = this.getDate(new Date())
				LODOP.ADD_PRINT_TEXT(70, 10, 300, 25, time);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
				LODOP.ADD_PRINT_HTM(90, 10, 170, 25, `
        		<div style="display:flex;justify-content:space-between;font-size:13px">
          			<div>商品名</div><div style="margin-left:50px;">数量</div><div>月卡</div>
       			</div>
      		`)
				let OrderArr = []
				OrderArr = goods.filter((item) => {
					return {
						goods_name: item.goods_name,
						// 单个商品价钱
						goods_price: item.goods_price,
						total_num: item.total_num,
						// 单个商品总价钱
						total_price: item.total_price
					}
				})
				let sumPrice = 0
				OrderArr.forEach((item) => {
					sumPrice += Number(item.total_price)
				})
				let temp
				let arr = ""
				OrderArr.forEach((element, index) => {
					temp = 110 + 20 * index
					arr = `<div style="display:flex;justify-content: space-between;font-size:8px;">
          					<div style="width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${element.goods_name}</div>
              				<div style="margin-right:10px">${element.total_num}</div>
              				<div>${element.total_price}</div>
          				</div>`
					LODOP.ADD_PRINT_HTM(temp, 10, 170, 25, arr);
					LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
				});
				LODOP.ADD_PRINT_HTM(temp + 40, 10, 170, 25, `<div style="float:right;font-size:10px">总计:${parseInt(sumPrice)}</div>`);
				LODOP.ADD_PRINT_HTM(temp + 60, 10, 170, 25, `<div style="font-size:10px">ID号:${this.order[index].user_id}</div>`);
				LODOP.ADD_PRINT_HTM(temp + 80, 10, 170, 25, `<div style="font-size:10px">手机号:${this.order[index].user_mobile}</div>`);
				LODOP.ADD_PRINT_HTM(temp + 100, 10, 170, 25, `<div style="font-size:10px">实际收款金额:￥${this.order[index].other_pay_info.offline - this.order[index].other_pay_info.use_score}+${this.order[index].other_pay_info.use_score}积分+${this.order[index].other_pay_info.egou}E购月卡</div>`);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
				LODOP.SET_PRINTER_INDEX("按序号或名称指定打印机");//按序号或名称指定打印机，选定后禁止手工重选；
				LODOP.PREVIEW()//打印预览
				LODOP.PRINT()//直接打印
				// LODOP.PRINT_SETUP()//打印维护
				// LODOP.PRINT_DESIGN()//打印设计
				// LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1)
			} else {
				let LODOP;
				console.log(this.printArr)
				LODOP = getLodop();
				LODOP.PRINT_INIT("");
				LODOP.ADD_PRINT_TEXT(10, 40, 300, 40, "丰德E购");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
				const a = `订单编号:${this.orderNumber}`
				LODOP.ADD_PRINT_TEXT(50, 10, 300, 25, a);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
				const time = this.getDate(new Date())
				LODOP.ADD_PRINT_TEXT(70, 10, 300, 25, time);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
				LODOP.ADD_PRINT_HTM(90, 10, 170, 25, `
        		<div style="display:flex;justify-content:space-between;font-size:13px">
          			<div>商品名</div><div style="margin-left:50px;">数量</div><div>月卡</div>
       			</div>
      		`)
				let OrderArr = []
				OrderArr = this.cartdata.filter((item) => {
					return {
						goods_name: item.goods_name,
						// 单个商品价钱
						goods_price: item.goods_price,
						total_num: item.total_num,
						// 单个商品总价钱
						total_price: item.total_price
					}
				})
				let sumPrice = 0
				OrderArr.forEach((item) => {
					sumPrice += Number(item.total_price)
				})
				let temp
				let arr = ""
				OrderArr.forEach((element, index) => {
					temp = 110 + 20 * index
					arr = `<div style="display:flex;justify-content: space-between;font-size:8px;">
          					<div style="width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${element.goods_name}</div>
              				<div style="margin-right:10px">${element.total_num}</div>
              				<div>${element.total_price}</div>
          				</div>`
					LODOP.ADD_PRINT_HTM(temp, 10, 170, 25, arr);
					LODOP.SET_PRINT_STYLEA(0, "FontSize", 8);
				});
				LODOP.ADD_PRINT_HTM(temp + 40, 10, 170, 25, `<div style="float:right;font-size:10px">总计:${parseInt(sumPrice)}</div>`);
				LODOP.ADD_PRINT_HTM(temp + 60, 10, 170, 25, `<div style="font-size:10px">ID号:${this.printArr.user_id}</div>`);
				LODOP.ADD_PRINT_HTM(temp + 80, 10, 170, 25, `<div style="font-size:10px">手机号:${this.printArr.user_mobile}</div>`);
				LODOP.ADD_PRINT_HTM(temp + 100, 10, 170, 25, `<div style="font-size:10px">实际收款金额:￥${this.printArr.other_pay_info.offline - this.printArr.other_pay_info.use_score}+${this.printArr.other_pay_info.use_score}积分+${this.printArr.other_pay_info.egou}E购月卡</div>`);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 6);
				LODOP.SET_PRINTER_INDEX("按序号或名称指定打印机");//按序号或名称指定打印机，选定后禁止手工重选；
				LODOP.PREVIEW()//打印预览
				LODOP.PRINT()//直接打印
				// LODOP.PRINT_SETUP()//打印维护
				// LODOP.PRINT_DESIGN()//打印设计
				// LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1)
			}
		}
	},
	created() {
		let account = localStorage.getItem("account")
		let password = localStorage.getItem("password")
		if (account) {
			this.ruleForm.account = account
			this.ruleForm.password = password
		}
		if (this.$store.state.user.user_id) {
			this.activeName = 'code'
			this.login = true
			this.getlists()
		} else {
			this.login = false
			this.activeName = 'user'
		}
		this.cookieUserInfo = cookie.get('userInfo')
	},
	mounted() {
		const inputs = document.getElementById('inputs')
		inputs.focus()
	}
}
</script>
<style lang="less" scoped>
@media (max-width: 1600px) {
	.fdLogo {
		color: red;
		font-size: 0.22rem;
		position: absolute;
		z-index: 101;
		top: 0.15rem;
		left: 1rem !important;
	}
}

@media (max-width: 1200px) {
	.fdLogo {
		display: none;
	}
}

@media (max-height: 800px) {
	.ordertab {
		width: 11.4rem !important;
		margin: 0 auto;
		height: 4rem !important;
		margin-top: 0.4rem;
		border-radius: 0.1rem;
		background-color: #fff;
		padding: 0.3rem;
	}

	.saoma_vip {
		margin-top: 0.5rem !important;

		.saoma_vipcode {
			margin-top: 0.5rem !important;
			margin-bottom: 0.5rem !important;
		}
	}

	.elTable {
		height: 3.5rem !important;
	}

	.saoma_add_tianjia {
		margin-top: 0.1rem !important;
	}

	.saoma_input {
		// margin-top: 0.4rem!important;
		margin-bottom: 0.1rem !important;
	}

	.saoma_stock {
		padding: 0.1rem !important;
	}

	/deep/ .saoma_table {
		height: 4rem !important;
	}

	.saoma_stock_shopAll {
		height: 3rem !important;
	}

	.saoma_stock_img {
		height: 100% !important;
	}

	.saoma_stock_name {
		font-size: 0.12rem;
	}

	.saoma_stock_Egou {
		margin: 0 !important;
	}

	.stock_shop_inner {
		/deep/ .el-input {
			height: 0.3rem;
			line-height: 0.3rem;
		}

		/deep/ .el-input__inner {
			height: 0.3rem;
			line-height: 0.3rem;
		}

		/deep/ .el-input-number__increase {
			height: 0.3rem;
			line-height: 0.3rem;
		}


		// /deep/ .el-input-number__increase {
		// 	top: 4px !important;
		// }

		/deep/ .el-input-number__decrease {
			height: 0.3rem;
			line-height: 0.3rem;
		}
	}

	.huiyuan {
		width: 11.4rem !important;
		height: 4rem !important;
	}

	.saoma {
		margin-top: 0;
		height: 4rem !important;
	}

	.kucun {
		width: 11.4rem !important;
		height: 4.4rem !important;
	}

	.stock_scanning {
		height: 4rem !important;
	}
}

.fdLogo {
	color: red;
	font-size: 0.22rem;
	position: absolute;
	z-index: 101;
	top: 0.15rem;
	left: 4rem;
}

.stock {
	:deep(.el-input__inner) {
		background-color: #eef0f2;
	}

	.stock_search {
		background-color: #ffe3e3;
		border: 1px solid #f44444;
		color: #f44444;
	}

	.stock_page {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 0.2rem;

		:deep(.el-pager li.active) {
			background-color: red;
		}

		.stock_GO {
			background-color: red;
			padding: 0.04rem;
			border-radius: 0.04rem;
			color: #fff;
		}

		.stock_GO:hover {
			cursor: pointer;
		}
	}

	// .stock_shopAll::-webkit-scrollbar {
	// 	display: none
	// }

	.stock_shopAll {
		display: flex;
		// justify-content:start;
		justify-content: space-between;
		overflow: scroll;
		// align-items: flex-start;
		flex-wrap: wrap;
		height: 80%;

		.stock_shop {
			width: 21%;
			background-color: #f7f9fa;
			border: 1px solid #e1e2e2;
			border-radius: 0.1rem;
			height: 30%;
			position: relative;
			padding: 0.1rem;
			box-sizing: border-box;
			display: flex;

			.stock_shop_img {
				width: 30%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.stock_shop_inner {
				width: 60%;

				.el-input-number {
					width: 1.6rem;
					background-color: #ffe3e3;
				}
			}
		}

		.stock_shop_delete {
			position: absolute;
			width: 0.15rem;
			height: 0.15rem;
			z-index: 9;
			position: absolute;
			right: -0.065rem;
			top: -0.065rem;
			border-radius: 50%;
			color: #fff;
			font-size: 0.14rem;
			font-weight: bold;
			display: flex;
			justify-content: center;
			line-height: 0.14rem;
			background-color: #f44444;
			cursor: pointer;
		}

		.stock_shop::after {
			content: "x";
			position: absolute;
			width: 0.15rem;
			height: 0.15rem;
			position: absolute;
			right: -0.065rem;
			top: -0.065rem;
			border-radius: 50%;
			color: #fff;
			font-size: 0.14rem;
			font-weight: bold;
			display: flex;
			justify-content: center;
			line-height: 0.14rem;
			background-color: #f44444;
		}
	}
}

.pagemode {
	:deep(.el-pager li:not(.disabled).active) {
		background-color: #f44444;
	}

	:deep(.el-pager li:not(.disabled):hover) {
		color: #f44444;
	}
}

.pagemode {
	margin-top: 0.4rem;
	text-align: center;
}

.taborder {
	margin-left: 0.2rem;
	margin-right: 4rem;
}

.tabend {
	margin-top: 0.2rem;
	margin-left: 0.1rem;
}

.redstrong {
	color: #f44444;
	font-weight: 600;
	margin-right: 0.2rem;
}

.ordertab {
	width: 11.4rem;
	margin: 0 auto;
	height: 6.4rem;
	margin-top: 0.7rem;
	border-radius: 0.1rem;
	background-color: #fff;
	padding: 0.3rem;
}

.loginbut {
	padding: 0.1rem 0.4rem;
	float: right;
}

h3 {
	font-weight: 500;
	text-align: center;
	font-size: 0.3rem;
}

.ruleForm {
	vertical-align: top;
	margin-top: 1rem;
	margin-left: 2rem;
	width: 4rem;
	display: inline-block;
}

.loginimg {
	width: 3.8rem;
	margin-top: 0.6rem;
	margin-left: 1rem;
}

.login {
	width: 12.2rem;
	height: 5.2rem;
	margin: 0 auto;
	background-color: #fff;
	margin-top: 1.2rem;
	border-radius: 0.08rem;
	box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.2), 0 0.06rem 0.2rem 0 rgba(0, 0, 0, 0.19);
}

.el-button--primary {
	background-color: #f44444;
	border-color: #f44444;
}

.el-tabs {
	font-size: 0.16rem;

	:deep(.el-tabs__header) {
		width: 100%;
		background-color: #fff;
		height: 0.7rem;
		font-size: 0.16rem;
		margin-bottom: 0;
	}

	:deep(.el-tabs__nav) {
		width: 80%;
		text-align: right;
	}

	:deep(.el-tabs__nav-wrap::after) {
		display: none;
	}

	:deep(.el-tabs__item:hover),
	:deep(.el-tabs__item.is-active) {
		color: #f44444;
	}

	:deep(.el-tabs__active-bar) {
		display: none;
	}

	:deep(.el-tabs__item) {
		line-height: 0.7rem;
		height: 0.7rem;
	}

	:deep(.el-tabs__content) {
		width: 100%;
		height: calc(100vh - 0.7rem);
		background: url(../assets/1.png) no-repeat;
		background-size: 100% 100%;
	}
}

.el-icon-full-screen,
.el-icon-document-copy,
.el-icon-shopping-cart-full,
.el-icon-box,
.el-icon-user,
.el-icon-postcard,
.el-icon-share {
	font-size: 0.26rem;
	vertical-align: middle;
	margin-right: 0.05rem;
}

// .border_none {
// 	border: 1px solid rgb(199, 195, 195);
// 	height: 40px;
// }

// .input {
// 	width: 60px;
// 	height: 36px;
// 	text-align: center;
// }
// .button{
// 	padding: 0 14px;
// }
// .Counter{
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// }
.detailed {
	margin-left: 1rem;
}

.detailed:hover {
	color: red;
	cursor: pointer;
}
</style>
