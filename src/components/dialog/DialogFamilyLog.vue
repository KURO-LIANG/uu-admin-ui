<template>
    <el-dialog
        title="家庭日志"
        v-model="data.visible"
        width="950px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :show-close="!saving"
    >

        <div v-loading="loading">
            <div v-if="data.dataList.length === 0" class="empty-data">
                <span>暂无日志</span>
            </div>
            <div v-else>
                <div class="log-item" v-for="(item,index) in data.dataList" :key="index">
                    <div class="log-item__bd">
                        <div class="log-item__time">
                            <span>{{item.createTime.substr(5)}}</span>
                        </div>
                        <div class="log-item__content">
                            <div class="flex-row flex-between">

                                <span  :class="item.status === 1 ? 'text-success' : 'text-danger'">
                                    <i class="status-icon text-success gap-mr-sm" v-if="item.status === 1"></i>
                                    <i class="status-icon text-danger gap-mr-sm" v-else></i>
                                    {{item.bizTitle}}
                                    <span>
                                        （{{checkRes(item.responseContext)}}）
                                    </span>
                                </span>
                                <strong>操作人：{{item.updateBy}}</strong>
                            </div>
                            <div>{{item.logContent}}</div>
                        </div>
                    </div>
                </div>

                <div class="pager">
                    <el-pagination
                            @size-change="sizeChangeHandle"
                            @current-change="currentChangeHandle"
                            hide-on-single-page
                            layout="prev, pager, next"
                            :current-page="data.page"
                            :page-size="data.limit"
                            :total="data.totalPage">
                    </el-pagination>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import {ref, reactive, getCurrentInstance, defineComponent} from 'vue'
import request from "../../utils/request"
import smartData from "../../service/smartData";

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance()

        let saving = ref(false)
        let loading = ref(false)

        let data = reactive({
            visible: false,
            dataList:[],
            page: 1,
            limit: 8,
            totalPage: 0,
            familyId: 0
        })

        const show = (id) => {
            data.visible = true
            data.page = 1
            data.familyId = id
            getDataList()
        }

        const checkRes = (val) => {
            let content = val.split(",");

            let res = content[1].split("=")[1]
            if("success" === res){
                return "操作成功"
            }else{
                return "操作失败：" + res
            }
        }

        // 当前页
        const currentChangeHandle = (val) => {
            data.page = val
            getDataList()
        }
        // 每页数
        const sizeChangeHandle = (val) => {
            data.page = val
            data.limit = 1
            getDataList()
        }

        const getDataList = () => {
            loading.value = true
            proxy.$axios({
                method: 'GET',
                url: `/admin-server/familylog/page`,
                params: {
                    'page': data.page,
                    'limit': data.limit,
                    'familyId': data.familyId
                }
            }).then(res => {
                loading.value = false
                if(res.data.list){
                    data.dataList = res.data.list
                    data.totalPage = res.data.totalCount
                }
            }).catch(err => {
                loading.value = false
                data.dataList = []
                data.totalPage = 0
                proxy.$message.error(err.message)
            })
        }

        return {
            saving,
            loading,
            data,
            currentChangeHandle,
            show,
            sizeChangeHandle,
            checkRes
        }
    }
})
</script>
<style lang="scss" scoped>
    .pager {
        display: flex;
        justify-content: flex-end;
    }

    .log-item {
        position: relative;
        line-height: 1.5;
        padding-left: 30px;
        padding-bottom: 15px;

        &__bd {
            display: flex;

            &::before {
                content: "";
                position: absolute;
                left: 1px;
                top: 4px;
                width: 1em;
                height: 1em;
                border-radius: 50%;
                border: 2px solid #409EFF;
            }

            &::after {
                content: "";
                position: absolute;
                left: 6px;
                top: 16px;
                bottom: -5px;
                width: 2px;
                background-color: #ddd;
            }
        }

        &__time {
            flex: 0 0 56px;
            word-break: break-word;
        }

        &__content {
            flex: 1;
            padding-left: 15px;
        }
    }
</style>


