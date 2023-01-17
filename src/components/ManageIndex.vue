<template>
    <div style="width:100%;height:100%" class="flex Data">
        <div style="flex:7" class="mr_1 flex flex_column">
            <div style="flex:2" class="bg_fff">
                <div class="flex align_items mt_1">
                    <div class="sign mx_1"></div>
                    实时数据
                    <span class="font_14 color_hui ml_1">最新更新时间:{{ newDate }}</span>
                </div>
                <div class="flex" style="padding: 0.2rem 0;">
                    <!-- 今日收入 -->
                    <div class="flex flex_column p_1"
                        style="width: 40%;border: 1px solid #fff4e9;margin-left: 0.4rem;position: relative;">
                        <div class="flex">
                            <span>今日总收入</span>
                            <div v-if="(todayMoney.today - todayMoney.yesterday) >= 0"
                                style="background-color: #ebffea;padding: 0 0.05rem;border-radius: 0.1rem;color: #07d700;">
                                <img src="../assets/increase.png" alt="">
                                +<span style="font-weight: bold;">{{ todayMoney.today - todayMoney.yesterday }}</span> 元
                            </div>
                            <div v-else
                                style="background-color: #e6e6e6;padding: 0 0.05rem;border-radius: 0.1rem;color: #7e7e7e;">
                                <img src="../assets/decline.png" alt="">
                                <span style="font-weight: bold;">{{
                                    parseInt(todayMoney.today - todayMoney.yesterday)
                                }}</span> 元
                            </div>
                        </div>
                        <div style="color:#f5831d;align-items:baseline" class="flex mt_1">
                            <span style="font-size:0.3rem;">{{ todayMoney.today }}</span>元
                            <div style="margin-left: 0.4rem;">
                                <span style="color:#000;">昨日</span>
                                <span>{{ todayMoney.yesterday }}元</span>
                            </div>
                        </div>
                        <div style="position: absolute;bottom: 0;right: 0;width: 20%;height: 80%;">
                            <img style="width: 100%;height: 100%;" src="../assets/todayData.png">
                        </div>
                    </div>
                    <!-- 本月收入 -->
                    <div class="flex flex_column p_1"
                        style="width: 40%;border: 1px solid #fee7e7;margin-left: 0.4rem;position: relative;">
                        <div class="flex">
                            <span>本月总收入</span>
                            <div v-if="(todayMoney.this_month - todayMoney.pre_month) < 0"
                                style="background-color: #e6e6e6;padding: 0 0.05rem;border-radius: 0.1rem;color: #7e7e7e;">
                                <img src="../assets/decline.png" alt="">
                                <span style="font-weight: bold;">{{
                                    parseInt(todayMoney.this_month -
                                        todayMoney.pre_month)
                                }}</span> 元
                            </div>
                            <div v-else
                                style="background-color: #ebffea;padding: 0 0.05rem;border-radius: 0.1rem;color: #07d700;">
                                <img src="../assets/increase.png" alt="">
                                +<span style="font-weight: bold;">{{
                                    parseInt(todayMoney.this_month -
                                        todayMoney.pre_month)
                                }}</span> 元
                            </div>
                        </div>

                        <div style="color:#f43e3e;align-items: baseline;" class="flex mt_1">
                            <span style="font-size:0.3rem;">{{ todayMoney.this_month }}</span>元
                            <div style="margin-left: 0.4rem;">
                                <span style="color:#000;">上月</span>
                                <span>{{ todayMoney.pre_month }}元</span>
                            </div>
                        </div>
                        <div style="position: absolute;bottom: 0;right: 0;width: 20%;height: 80%;">
                            <img style="width: 100%;height: 100%;" src="../assets/MonthData.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div style="flex:8" class="mt_1 bg_fff">
                <div class="flex align_items mt_1 space_between">
                    <div class="flex">
                        <div class="sign mx_1"></div>
                        最近收入
                        <span class="font_14 color_hui ml_1">{{ newMonth }}只显示最近七天</span>
                    </div>
                    <div style="width:2rem;" class="mr_1">
                        <el-input @focus="show = true" placeholder="选择日期区间" v-model="date">
                            <i slot="prefix" class="el-icon-s-grid" @click="show = true"></i>
                            <i slot="suffix" class="el-icon-caret-bottom" @click="show = true"></i>
                        </el-input>
                        <van-calendar :min-date="minData" v-model="show" type="range" @confirm="onConfirm" />
                    </div>
                </div>
                <div id="echarts" style="width: 1200px;height:500px;"></div>
            </div>
        </div>
        <div style="flex:3" class="bg_fff orderPay">
            <div class="mt_1 px_1">
                <div class="flex space_between">
                    <div class="flex">
                        <div class="sign mx_1"></div>
                        本月消费者排名
                    </div>
                    <el-button @click="dialogVisible = true">导出数据</el-button>
                    <div style="color:#808080;font-size: 0.14rem;cursor:pointer" class="flex align_items"
                        @click="viewMore">查看更多 <div class="arrow_right"></div>
                    </div>
                </div>
                <div>
                    <el-table :data="tableData" stripe style="width: 100%;height: 6.6rem;overflow-y: scroll;"
                        class="table" :header-cell-style="{ 'text-align': 'center' }"
                        :cell-style="{ 'text-align': 'center' }">
                        <el-table-column type="index" label="排名">
                        </el-table-column>
                        <el-table-column prop="user_id" label="用户ID">
                        </el-table-column>
                        <el-table-column prop="nickname" label="姓名">
                        </el-table-column>
                        <el-table-column prop="total_price" label="总金额">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <el-dialog title="消费者排名" :visible.sync="dialogVisible" width="30%">
            <!-- <span>这是一段信息</span> -->
            <div class="flex">
                <div class="mr_1">
                    年份：
                    <el-date-picker style="width:1.5rem" v-model="yearData" type="year" align="center" placeholder="选择年"
                        @change="searchYear" format="yyyy年" clear-icon="false">
                    </el-date-picker>
                </div>
                <div>
                    月份：
                    <el-date-picker style="width:1.5rem" v-model="monthData" type="month" align="center"
                        @change="searchMonth" placeholder="选择月" format="M月份" clear-icon="false">
                    </el-date-picker>
                </div>
            </div>
            <div class="mt_1 flex align_items">导出数量：<el-input v-model="excelInput" class="class"
                    style="width:2rem"></el-input></div>
            <span slot="footer" class="dialog-footer flex" style="justify-content: space-between;">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button @click="excelButton">确 定</el-button>
                <!-- <download-excel class="export-excel-wrapper" :data="excelData" :fields="json_fields" type="xls"
                    v-if="excelShow" worksheet="My Worksheet" name="消费者排名"> -->
                <el-button @click="excelShowButton" v-if="excelShow">导出数据</el-button>
                <!-- </download-excel> -->
            </span>
        </el-dialog>

    </div>
</template>
<script>
import * as echarts from 'echarts';
import {
    getThisMonthData,
    getAppointMonthUserConsumeRank,
    getEverydayTotal
} from "@/api/user";
export default {
    data() {
        return {
            // 今日/本月数据
            todayMoney: {},
            newDate: '',
            minData: new Date(1577808000),
            newMonth: '',
            dialogVisible: false,
            input2: '',
            date: '',
            show: false,
            yearData: new Date(),
            monthData: new Date(),
            // 用户消费排行榜
            excelInput: 0,
            tableData: [],
            echartsData: [],
            echartsX: [],
            echartsSeries: [],
            startTime: '',
            endTime: '',
            excelShow: false,
            excelData: [],

        }
    },
    mounted() {
        setTimeout(() => {
            this.echarts()
        }, 1000);
    },
    created() {
        this.newDate = this.getNewDate()
        this.newMonth = this.getNewMonth()
        this.getThisMonthData()
        this.getEverydayTotal()
        this.getAppointMonthUserConsumeRank()
    },
    methods: {
        echarts() {
            var chartDom = document.getElementById('echarts');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                xAxis: {
                    type: 'category',
                    data: this.echartsX,
                    axisLabel: {
                        formatter: function (name, value) {
                            return name + '号'
                        },
                        color: function (name) {
                            const date = new Date().getDate()
                            if (name == date.toString().padStart(2, 0)) {
                                return '#f44444'
                            } else {
                                return '#000'
                            }
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: "单位(元)",
                    axisLine: {
                        show: true
                    },
                    max: function (value) {
                        return value.max + 200
                    }
                },
                series: [
                    {
                        data: this.echartsSeries,
                        type: 'bar',
                        backgroundColor: '#ff7c7c',
                        color: ['#ff7c7c'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                },
                                color: function (name) {
                                    const date = new Date().getDate()
                                    if (name.name == date.toString().padStart(2, 0)) {
                                        return '#f44444'
                                    } else {
                                        return '#ff7c7c'
                                    }
                                }
                            }
                        },
                    }
                ]
            };
            myChart.setOption(option);
        },
        excelShowButton() {
            var that = this
            const json_fields = [
                {
                    title: "排名",
                    key: "index",
                    type: "text"
                },
                {
                    title: "用户ID",
                    key: "user_id",
                    type: "text"
                },
                {
                    title: "姓名",
                    key: "nickname",
                    type: "text"
                },
                {
                    title: "总金额",
                    key: "total_price",
                    type: "text"
                },
            ]
            this.$JsonExcel(json_fields, this.excelData, '消费者排名')
            setTimeout(() => {
                that.excelShow = false
            }, 2000);
        },
        searchYear() {
            console.log(this.yearData.getFullYear())
        },
        searchMonth() {
            console.log((this.monthData.getMonth() + 1).toString().padStart(2, 0))
        },
        excelButton() {
            if (this.excelInput > 999) {
                this.$Notify('导出数量不能超过1000')
                return
            }
            let myreg = /^([0-9]{1,}[.][0-9]*)$/;
            let myreg2 = /^([0-9]{1,})$/;
            if (!myreg.test(this.excelInput) && !myreg2.test(this.excelInput)) {
                this.excelInput = 0;
                this.$Notify('请输入正确的导出数量')
                return
            }
            const obj = {
                month: this.yearData.getFullYear() + (this.monthData.getMonth() + 1).toString().padStart(2, 0),
                page: 1,
                pageSize: this.excelInput
            }
            getAppointMonthUserConsumeRank(obj).then((item) => {
                this.excelData = item.data.list
                this.excelData.forEach((item, index) => {
                    item.index = index + 1
                })
                this.excelShow = true
            })
        },
        formatDate(date) {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        },
        onConfirm(date) {
            const [start, end] = date;
            this.show = false;
            this.date = `${this.formatDate(start)} - ${this.formatDate(end)}`;
            this.startTime = this.getNewMonthDay(start)
            this.endTime = this.getNewMonthDay(end)
            this.getEverydayTotal()
            setTimeout(() => {
                this.echarts()
            }, 1000);
        },
        viewMore() {
            this.$emit('viewMore')
        },
        // 获取 用户消费排行榜
        getAppointMonthUserConsumeRank() {
            getAppointMonthUserConsumeRank({ page: 1, pageSize: 10 }).then((item) => {
                this.tableData = item.data.list
                this.tableData.forEach((item, index) => {
                    item.index = index + 1
                })
            })
        },
        // 获取 今日/本月的数据
        getThisMonthData() {
            getThisMonthData().then((item) => {
                this.todayMoney = item.data
            })
        },
        // 获取 每日数据统计
        getEverydayTotal() {
            var that = this
            that.echartsX = []
            that.echartsSeries = []
            const obj = {
                start_time: that.startTime,
                end_time: that.endTime
            }
            getEverydayTotal(obj).then((item) => {
                that.echartsData = item.data
                item.data.forEach((toItem) => {
                    that.echartsX.push(toItem.date)
                    that.echartsSeries.push(toItem.value)
                })
            })
        },
        // 转换当前日期
        getNewDate() {
            var time = new Date();
            var year = time.getFullYear();
            var month = (time.getMonth() + 1 + "").padStart(2, 0);
            var date = (time.getDate() + "").padStart(2, 0);
            var hours = (time.getHours() + "").padStart(2, 0);
            var minutes = (time.getMinutes() + "").padStart(2, 0);
            var seconds = (time.getSeconds() + "").padStart(2, 0);
            return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes
        },
        // 当前年月
        getNewMonth() {
            var time = new Date();
            var year = time.getFullYear();
            var month = (time.getMonth() + 1 + "").padStart(2, 0);
            return year + '-' + month
        },
        // 当前年月日
        getNewMonthDay(time) {
            var year = time.getFullYear();
            var month = (time.getMonth() + 1 + "").padStart(2, 0);
            var date = (time.getDate() + "").padStart(2, 0);
            return year + '-' + month + '-' + date
        }
    },
}
</script>
<style lang="less" scoped>
@media (max-height: 800px) {
    #echarts {
        width: 900px !important;
        height: 300px !important;
    }

    .table {
        height: 4rem !important;
    }

    .orderPay {
        height: 105%;
    }
}



// /deep/ .el-input__prefix {
//     position: absolute;
//     top: 50%;
//     transform: translate(0, -50%) !important;
//     cursor: pointer;
// }

// /deep/ .el-input__suffix {
//     position: absolute;
//     top: 50%;
//     transform: translate(0, -50%) !important;
//     cursor: pointer;
// }

.sign {
    width: 0.04rem;
    height: 0.25rem;
    background-color: red;
}

/deep/ .el-button {
    background-color: #fbfdff;
    margin: 0;
}

// /deep/ .el-input__prefix {
//     position: absolute;
//     top: 50%;
//     transform: translate(0, -50%)!important;
//     cursor: pointer;
// }

// /deep/ .el-input__suffix {
//     position: absolute;
//     top: 50%;
//     transform: translate(0, -50%)!important;
//     cursor: pointer;
// }
/deep/ .el-icon-date:before {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -80%) !important;
    cursor: pointer;
}

/deep/ .class .el-input__suffix {
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%) !important;
    cursor: pointer;
}
</style>