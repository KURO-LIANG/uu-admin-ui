<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <div class="flex-row flex-between gap-mb">
                <div>
                    <el-button
                        v-if="isAuth('sys:menu:save')"
                        size="small"
                        type="primary"
                        @click="addOrUpdateHandle()"
                    >新增
                    </el-button>
                </div>
                <div>
                    <el-button
                        size="small"
                        @click="refreshCache"
                        :loading="data.loadingCache"
                    >清除缓存
                    </el-button>
                </div>
            </div>
            <el-table
                :data="data.dataList"
                border
                size="small"
                row-key="menuId"
                :default-expand-all="false"
                header-row-class-name="thead-light"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                    prop="name"
                    header-align="center"
                    min-width="150"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="parentName"
                    header-align="center"
                    align="center"
                    width="120"
                    label="上级菜单">
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="图标">
                    <template #default="scope">
                        <i :class="scope.row.icon || ''"></i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    header-align="center"
                    align="center"
                    label="类型">
                    <template #default="scope">
                        <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                        <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
                        <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="orderNum"
                    header-align="center"
                    align="center"
                    label="排序号">
                </el-table-column>
                <el-table-column
                    prop="url"
                    header-align="center"
                    align="center"
                    width="150"
                    :show-overflow-tooltip="true"
                    label="菜单URL">
                </el-table-column>
                <el-table-column
                    prop="perms"
                    header-align="center"
                    align="center"
                    width="150"
                    :show-overflow-tooltip="true"
                    label="授权标识">
                </el-table-column>

                <el-table-column
                    header-align="center"
                    align="center"
                    width="260"
                    label="操作">
                    <template #default="scope">
                        <el-button
                            v-if="isAuth('sys:menu:update')"
                            @click="addOrUpdateHandle(scope.row.menuId)"
                            type="text"
                            size="small">修改
                        </el-button>
                        <el-button
                            v-if="isAuth('sys:menu:delete')"
                            @click="deleteHandle(scope.row.menuId)"
                            type="text"
                            size="small">删除
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
import request from "../../../utils/request";

const router = useRouter()
const {proxy} = getCurrentInstance()
const ctx = proxy

const data = reactive({
    dataListLoading: false,
    dataList: [],
    loadingCache: false
})

const onRefresh = () => {
    getDataList()
}
// 获取数据列表
const getDataList = () => {
    data.dataListLoading = true
    request({
        method: 'GET',
        url: '/admin-server/sys/menu/list'
    }).then(res => {
        data.dataListLoading = false
        data.dataList = treeDataTranslate(res.data, 'menuId')
    }).catch(err => {
        data.dataListLoading = false
        ctx.$message.error(err.message)
    })
}

// 新增 / 修改
const addOrUpdateHandle = id => {
    ctx.toUpdate({id})
}
// 清除缓存
const refreshCache = () => {
    data.loadingCache = true;
    data.dataListLoading = true
    request({
        method: 'GET',
        url: '/admin-server/sys/menu/clearCache'
    }).then((res) => {
        data.loadingCache = false;
        data.dataListLoading = false
        if (res.code !== 0) {
            ctx.$message.error(res.msg)
            return;
        }

        getDataList()
    })
}

// 删除
const deleteHandle = id => {

    ctx.$confirm('确定要进行删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ctx.$axios({
            method: 'DELETE',
            data: id,
            json: false,
            url: `/admin-server/sys/menu/delete`
        }).then(() => {
            ctx.$message.success('操作成功')
            onRefresh()
        }).catch(err => {
            console.log(err)
            ctx.$message.error(err.message)
        })
    })
}

onMounted(() => {
    getDataList()
})
</script>

<style scoped>

</style>
