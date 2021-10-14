<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <el-form inline :model="data.dataForm" size="small" @submit="onQuery">
                <el-form-item>
                    <el-input v-model="data.dataForm.roleName" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        v-if="isAuth('sys:role:save')"
                        type="primary"
                        @click="addOrUpdateHandle('')"
                    >新增
                    </el-button>
                    <el-button
                        v-if="isAuth('sys:role:delete')"
                        type="danger"
                        @click="deleteHandle()"
                        :disabled="data.dataListSelections.length <= 0">批量删除
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
                    prop="roleId"
                    header-align="center"
                    align="center"
                    width="80"
                    label="ID">
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    header-align="center"
                    align="center"
                    label="角色名称">
                </el-table-column>
                <el-table-column
                    prop="remark"
                    header-align="center"
                    align="center"
                    label="备注">
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
                            v-if="isAuth('sys:role:update')"
                            @click="addOrUpdateHandle(scope.row.roleId)"
                            type="text" size="small">修改
                        </el-button>
                        <el-button
                            v-if="isAuth('sys:role:delete')"
                            @click="deleteHandle(scope.row.roleId)"
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

const data = reactive({
    dataForm: {
        roleName: ''
    },
    dataListLoading: false,
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    dataList: [],
    dataListSelections: []
})

const onQuery = () => {
    data.pageIndex = 1
    getDataList()
}
const onRefresh = () => {
    getDataList()
}
// 获取数据列表
const getDataList = () => {
    data.dataListLoading = true
    ctx.$axios({
        url: '/admin-server/sys/role/list',
        params: {
            'page': data.pageIndex,
            'limit': data.pageSize,
            'roleName': data.dataForm.roleName
        }
    }).then(res => {
        if (res.code === 0) {
            data.dataListLoading = false
            data.dataList = reactive(res.data.list)
            data.totalCount = res.data.totalCount
        } else {
            ctx.$message.error(res.msg)
        }
    }).catch(err => {
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
        return item.roleId
    })
    ctx.$confirm('确定要进行删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ctx.$axios({
            method: 'DELETE',
            url: '/admin-server/sys/role/delete',
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
});


</script>

<style scoped>

</style>
