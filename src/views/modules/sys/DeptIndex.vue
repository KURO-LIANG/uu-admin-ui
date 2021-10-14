<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <el-form inline size="small">
                <el-form-item>
                    <el-button
                        v-if="isAuth('sys:dept:save')"
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
                row-key="deptId"
                :default-expand-all="false"
                header-row-class-name="thead-light"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                    prop="name"
                    label="部门名称">
                </el-table-column>
                <el-table-column
                    prop="parentName"
                    header-align="center"
                    align="center"
                    label="上级部门">
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    header-align="center"
                    align="center"
                    label="排序">
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    width="260"
                    label="操作">
                    <template #default="scope">
                        <el-button
                            v-if="isAuth('sys:dept:update')"
                            @click="addOrUpdateHandle(scope.row.deptId)"
                            type="text"
                            size="small">修改
                        </el-button>
                        <el-button
                            v-if="isAuth('sys:dept:delete')"
                            @click="deleteHandle(scope.row.deptId)"
                            type="text" size="small">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import {reactive, onMounted, getCurrentInstance} from 'vue'
import {useRouter} from "vue-router"
import {treeDataTranslate} from "../../../utils";

const router = useRouter()
const {proxy} = getCurrentInstance()
const ctx = proxy

const data = reactive({
    dataListLoading: false,
    dataList: []
})

const onRefresh = () => {
    getDataList()
}
// 获取数据列表
const getDataList = () => {
    data.dataListLoading = true
    ctx.$axios({
        method: 'GET',
        url: '/admin-server/sys/dept/list'
    }).then(res => {
        if (res.code === 0) {
            data.dataListLoading = false
            data.dataList = treeDataTranslate(res.data, 'deptId')
        } else {
            throw Error(res.msg)
        }
    }).catch(err => {
        data.dataListLoading = false
        ctx.$message.error(err.message)
    })
}
// 新增 / 修改
const addOrUpdateHandle = id => {
    ctx.toUpdate({id})
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
            url: '/admin-server/sys/dept/delete',
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
    getDataList()
});


</script>

<style scoped>

</style>
