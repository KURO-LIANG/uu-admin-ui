<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <el-form inline :model="data.dataForm" size="small">
                <el-form-item>
                    <el-input v-model="data.dataForm.key" placeholder="关键词"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        @click="onQuery"
                    >查询
                    </el-button>
                    <el-button
                        v-if="isAuth('module:demo:save')"
                        type="primary"
                        @click="addOrUpdateHandle('')"
                    >新增
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="data.dataList"
                border
                size="small"
                header-row-class-name="thead-light"
                @selection-change="selectionChangeHandle"
            >
                <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50">
                </el-table-column>
                <el-table-column
                    prop="userId"
                    header-align="center"
                    align="center"
                    width="80"
                    label="ID">
                </el-table-column>
                <el-table-column
                    prop="username"
                    header-align="center"
                    align="center"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="email"
                    header-align="center"
                    align="center"
                    label="邮箱">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    header-align="center"
                    align="center"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="status"
                    header-align="center"
                    align="center"
                    label="状态">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
                        <el-tag v-else size="small">正常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    header-align="center"
                    align="center"
                    width="180"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    width="260"
                    label="操作">
                    <template #default="scope">
                        <el-button
                            v-if="isAuth('module:demo:update')"
                            @click="addOrUpdateHandle(scope.row.userId)"
                            type="text" size="small">修改
                        </el-button>
                        <el-button
                            v-if="isAuth('module:demo:delete')"
                            @click="deleteHandle(scope.row.userId)"
                            type="text" size="small">删除
                        </el-button>
                    </template>
                </el-table-column>
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
        url: '/admin-server/sys/user/page',
        params: {
            'page': data.pageIndex,
            'limit': data.pageSize,
            'key': data.dataForm.key
        }
    }).then(res => {
        if (res.code === 0) {
            data.dataListLoading = false
            data.dataList = reactive(res.data.list)
            data.totalCount = res.data.totalCount
        } else {
            throw Error(res.msg)
        }
    }).catch(err => {
        data.dataList = [{
            id: 1,
            chainName: '加'
        }]
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
const addOrUpdateHandle = id => {
    ctx.toUpdate({id})
}
// 多选
const selectionChangeHandle = val => {
    data.dataListSelections = val
}
// 删除
const deleteHandle = id => {
    const ids = id ? [id] : data.dataListSelections.map(item => {
        return item.id
    })
    ctx.$confirm('确定要进行删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ctx.$axios({
            method: 'DELETE',
            url: '/sys/hotel/hotelchain/delete',
            data: ids,
            json: false
        }).then(() => {
            ctx.$message.success('操作成功')
            onRefresh()
        }).catch(err => {
            ctx.$message.error(err.message)
        })
    })
}

onMounted(() => {
    onQuery()
})
</script>

<style scoped>

</style>
