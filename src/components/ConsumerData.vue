<template>
    <div style="width:100%;height: 100%;box-sizing: border-box;" class="bg_fff p_2">
        <div class="flex space_between">
            <div class="flex">
                <div class="sign mx_1"></div>
                本月消费者排名
            </div>
            <div class="flex">
                <div class="mr_1">
                    年份：
                    <el-date-picker @change="yearFilter" style="width:1.5rem" v-model="yearData" type="year"
                        align="center" placeholder="选择年" format="yyyy年">
                    </el-date-picker>
                </div>
                <div>
                    月份：
                    <el-date-picker @change="monthFilter" style="width:1.5rem" v-model="monthData" type="month"
                        align="center" placeholder="选择月" format="M月份">
                    </el-date-picker>
                </div>
            </div>
        </div>
        <div class="mt_1 table" style="height: 90%;">
            <el-result title="404" subTitle="抱歉，暂无数据" v-if="tableData.length == 0">
                <template slot="icon">
                    <el-image
                        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                    </el-image>
                </template>
            </el-result>
            <el-table :data="tableData" stripe border style="width: 100%;" v-else
                :header-cell-style="{ 'text-align': 'center' }" :cell-style="{ 'text-align': 'center' }">
                <el-table-column type="index" label="排名" width="100">
                </el-table-column>
                <el-table-column prop="user_id" label="用户ID">
                </el-table-column>
                <el-table-column prop="nickname" label="姓名">
                </el-table-column>
                <el-table-column prop="total_price" label="消费总额">
                </el-table-column>
            </el-table>
        </div>
        <div class="flex juction_content align_items mt_1 aaa">
            <el-pagination @current-change="currentChange" :page-size="pageSize" background :current-page="currentPage"
                layout="prev,pager, next, total, jumper" :total="total">
            </el-pagination>
            <div class="GO">GO</div>
        </div>
    </div>
</template>

<script>
import {
    getAppointMonthUserConsumeRank
} from "@/api/user";
export default {
    data() {
        return {
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            yearData: new Date(),
            monthData: new Date(),
            yearFilterNumber: new Date().getFullYear(),
            monthFilterNumber: new Date().getMonth() + 1
        }
    },
    created() {
        this.getAppointMonthUserConsumeRank()
    },
    methods: {
        getAppointMonthUserConsumeRank() {
            var obj = {
                page: this.currentPage,
                pageSize: this.pageSize,
                month: this.yearFilterNumber + '' + this.monthFilterNumber
            }
            getAppointMonthUserConsumeRank(obj).then((item) => {
                console.log(item)
                if (this.currentPage == 1) {
                    this.total = item.data.count
                }
                this.tableData = item.data.list
            })
        },
        yearFilter(val) {
            this.yearFilterNumber = val.getFullYear()
        },
        monthFilter(val) {
            this.monthFilterNumber = val.getMonth() >= 9 ? val.getMonth() + 1 + '' : '0' + (val.getMonth() + 1)
            this.getAppointMonthUserConsumeRank()
        },
        currentChange(currentPage) {
            this.currentPage = currentPage
            this.getAppointMonthUserConsumeRank()

        },
    }
}
</script>
<style lang="less" scoped>
@media (max-height: 800px) {
    .table {
        height: 80% !important;
    }
}

.sign {
    width: 0.04rem;
    height: 0.25rem;
    background-color: red;
}

.GO {
    background-color: red;
    padding: 0.04rem;
    border-radius: 0.04rem;
    color: #fff;
}

.GO:hover {
    cursor: pointer;
}

/deep/ .el-pager {
    li.active {
        background-color: red !important;
    }
}

/deep/ .el-input__prefix {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%) !important;
    cursor: pointer;
}

/deep/ .el-input__suffix {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%) !important;
    cursor: pointer;
}
</style>