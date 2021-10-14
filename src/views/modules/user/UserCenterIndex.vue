<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <el-form inline :model="data.dataForm" size="small">
                <el-form-item>
                    <el-input @keyup.native.enter="onQuery" v-model="data.dataForm.key" placeholder="用户昵称、手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onQuery">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="data.dataList"
                border
                size="small"
                header-row-class-name="thead-light"
            >
                <el-table-column
                        prop="avatar"
                        header-align="center"
                        align="center"
                        label="用户头像">
                    <template #default="scope">
                        <img style="width: 40px" :src="scope.row.avatar" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="nickName"
                    header-align="center"
                    align="center"
                    label="用户昵称">
                </el-table-column>
                <el-table-column
                        prop="lastLoginTime"
                        header-align="center"
                        align="center"
                        label="上次登录时间">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        header-align="center"
                        align="center"
                        label="创建时间">
                </el-table-column>
<!--                <el-table-column-->
<!--                    header-align="center"-->
<!--                    align="center"-->
<!--                    width="260"-->
<!--                    label="操作">-->
<!--                    <template #default="scope">-->
<!--                        <el-button-->
<!--                            v-if="isAuth('user:user:info')"-->
<!--                            @click="check(scope.row.id)"-->
<!--                            type="text"-->
<!--                            size="small"-->
<!--                        >查看-->
<!--                        </el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>
            <div class="page-pagination">
                <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="data.pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="data.pageSize"
                    :total="data.totalCount"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup>
import {reactive, onMounted, getCurrentInstance} from 'vue'
import {useRouter} from "vue-router"

const router = useRouter()
const {proxy} = getCurrentInstance()
const ctx = proxy
// 数据
const data = reactive({
    dataForm: {
        key: ''
    },
    dataListLoading: false,
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    dataList: [],
    dataListSelections: []
})
// 查询
const onQuery = () => {
    data.pageIndex = 1
    getDataList()
}
// 刷新
const onRefresh = () => {
    getDataList()
}
// 获取数据列表
const getDataList = () => {
    data.dataListLoading = true
    ctx.$axios({
        method: 'GET',
        url: '/admin-server/user/userPage',
        params: {
            'page': data.pageIndex,
            'limit': data.pageSize,
            'key': data.dataForm.key
        }
    }).then(res => {
        data.dataListLoading = false
        data.dataList = res.data.list
        data.totalCount = res.data.totalCount
    }).catch(err => {
        data.dataList = []
        data.totalCount = 0
        data.dataListLoading = false
        ctx.$message.error(err.message)
    })
}
// 每页数
const sizeChangeHandle = (val) => {
    data.pageSize = val
    data.pageIndex = 1
    getDataList()
}
// 当前页
const currentChangeHandle = (val) => {
    data.pageIndex = val
    getDataList()
}
// 新增 / 修改
const check = id => {
    ctx.toUpdate({id})
}

onMounted(() => {
    onQuery()
})
</script>

<style scoped>

</style>
