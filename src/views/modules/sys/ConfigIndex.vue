<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <el-form inline :model="data.dataForm" size="small">
                <el-form-item>
                    <el-input v-model="data.dataForm.key" placeholder="关键词"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onQuery">查询</el-button>
                    <el-button
                            v-if="isAuth('sys:config:save')"
                            type="primary"
                            @click="addOrUpdateHandle('')"
                    >新增
                    </el-button>
                    <el-button
                            v-if="isAuth('sys:config:delete')"
                            type="danger"
                            @click="deleteHandle()"
                            :disabled="data.dataListSelections.length <= 0"
                    >批量删除
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
                        prop="id"
                        header-align="center"
                        align="center"
                        label="">
                </el-table-column>
                <el-table-column
                        prop="paramKey"
                        header-align="center"
                        align="center"
                        label="key">
                </el-table-column>
                <el-table-column
                        prop="paramValue"
                        header-align="center"
                        align="center"
                        label="value">
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
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        header-align="center"
                        align="center"
                        label="更新时间">
                </el-table-column>
                <el-table-column
                        prop="updateBy"
                        header-align="center"
                        align="center"
                        label="操作者">
                </el-table-column>

                <el-table-column
                        header-align="center"
                        align="center"
                        width="260"
                        label="操作">
                    <template #default="scope">
                        <el-button
                                v-if="isAuth('sys:config:update')"
                                @click="addOrUpdateHandle(scope.row.id)"
                                type="text"
                                size="small"
                        >修改
                        </el-button>
                        <el-button
                                v-if="isAuth('sys:config:delete')"
                                @click="deleteHandle(scope.row.id)"
                                type="text"
                                size="small"
                        >删除
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
            url: '/admin-server/sys/config/page',
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
                url: '/admin-server/sys/config/delete',
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
