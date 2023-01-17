<template>
    <div style="background-color: #dbdddf;">
        <div class="DataMana">
            <!-- 数据管理 -->
            <div style="width: 100%;height: 0.5rem;padding: 0.1rem 0;margin:0 auto"
                class="bg_fff flex space_between align_items">
                <div class="flex space_between align_items" style="padding: 0 0.2rem;">
                    <img src="../assets/dataManage.png" alt="">
                    <span class="ml_1">数据管理</span>
                </div>
                <div>
                    <div class="mr_1">
                        <button class="button" v-for="(item, index) in buttons" :key="index" type="info" plain
                            :class="{ 'active': item.type == buttonType }" @click="reportForm(item.type)">{{ item.title
                            }}
                        </button>
                    </div>
                </div>
            </div>
            <div style="width: 100%;height: 80%;" class="mt_1 flex zishuju">
                <ManageIndex v-if="buttonType == 'homePage'" @viewMore="viewMore"></ManageIndex>
                <ConsumerData v-else-if="buttonType == 'MorehomePage'"></ConsumerData>
                <enterReport v-else-if="buttonType == 'enter'"></enterReport>
                <outReport v-else-if="buttonType == 'out'"></outReport>
                <achievementReport v-else-if="buttonType == 'achievement'"></achievementReport>
            </div>
        </div>
    </div>
</template>
<script>
import ManageIndex from './ManageIndex.vue'  //数据管理首页
import ConsumerData from './ConsumerData.vue' // 消费者排名
import enterReport from './enterReport.vue' // 入库报表
import outReport from './outReport.vue' // 入库报表
import achievementReport from './achievementReport.vue' // 业绩报表
import * as echarts from 'echarts';
export default {
    data() {
        return {
            newDate: '',
            newMonth: '',
            buttons: [
                {
                    title: '数量管理',
                    type: 'homePage'
                },
                {
                    title: '业绩报表',
                    type: 'achievement'
                },
                {
                    title: '入库报表',
                    type: 'enter'
                },
                {
                    title: '出库报表',
                    type: 'out'
                },
            ],
            buttonType: 'homePage',
            input2: '',
            date: '',
            show: false,
            tableData: []
        }
    },
    components: { ManageIndex, ConsumerData, enterReport, outReport, achievementReport },
    methods: {
        // 报表点击事件
        reportForm(type) {
            this.buttonType = type
        },
        viewMore() {
            this.buttonType = 'MorehomePage'
        }
    },
    mounted() {
    },
    created() {
    },
}
</script>
<style lang="less" scoped>
.DataMana {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #dbdddf;
    padding: 0.1rem 0.2rem;
    box-sizing: border-box;
}

@media (max-height: 800px) {
    .DataMana {
        width: 13.3rem;
        height: 6.4rem;
        margin: 0 auto;
    }
}

.active {
    color: red;
}

.sign {
    width: 0.04rem;
    height: 0.25rem;
    background-color: red;
}

.button {
    padding: 0.1rem 0.2rem;
    border: 0.01rem solid #cccdce;
    background-color: #fbfdff;
    cursor: pointer;
    font-weight: bold;
}

/deep/ .el-button {
    background-color: #fbfdff;
    margin: 0;
}

/deep/ .el-input__prefix {
    position: absolute;
    top: 50%;
    transform: translate(0, -25%);
    cursor: pointer;
}

/deep/ .el-input__suffix {
    position: absolute;
    top: 50%;
    transform: translate(0, -25%);
    cursor: pointer;
}
</style>