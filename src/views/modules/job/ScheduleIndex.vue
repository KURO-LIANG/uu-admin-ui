<template>
    <div class="page-right" v-loading="data.dataListLoading">
        <div class="page-body">
            <el-form inline :model="data.dataForm" size="small">
                <el-form-item>
                    <el-input v-model="data.dataForm.beanName" placeholder="bean名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onQuery">查询</el-button>
                    <el-button v-if="isAuth('sys:schedule:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                    <el-button v-if="isAuth('sys:schedule:delete')" type="danger" @click="deleteHandle()"
                               :disabled="data.dataListSelections.length <= 0">批量删除
                    </el-button>
                    <el-button v-if="isAuth('sys:schedule:pause')" type="danger" @click="pauseHandle()"
                               :disabled="data.dataListSelections.length <= 0">批量暂停
                    </el-button>
                    <el-button v-if="isAuth('sys:schedule:resume')" type="danger" @click="resumeHandle()"
                               :disabled="data.dataListSelections.length <= 0">批量恢复
                    </el-button>
                    <el-button v-if="isAuth('sys:schedule:run')" type="danger" @click="runHandle()"
                               :disabled="data.dataListSelections.length <= 0">批量立即执行
                    </el-button>
                    <el-button v-if="isAuth('sys:schedule:log')" type="success" @click="logHandle()">日志列表</el-button>
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
                        prop="jobId"
                        header-align="center"
                        align="center"
                        width="80"
                        label="ID">
                </el-table-column>
                <el-table-column
                        prop="beanName"
                        header-align="center"
                        align="center"
                        label="bean名称">
                </el-table-column>
                <el-table-column
                        prop="params"
                        header-align="center"
                        align="center"
                        label="参数">
                </el-table-column>
                <el-table-column
                        prop="cronExpression"
                        header-align="center"
                        align="center"
                        label="cron表达式">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        header-align="center"
                        align="center"
                        label="备注">
                </el-table-column>
                <el-table-column
                        prop="status"
                        header-align="center"
                        align="center"
                        label="状态">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 0" size="small">正常</el-tag>
                        <el-tag v-else size="small" type="danger">暂停</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        header-align="center"
                        align="center"
                        width="150"
                        label="操作">
                    <template #default="scope">
                        <el-button v-if="isAuth('sys:schedule:update')" type="text" size="small"
                                   @click="addOrUpdateHandle(scope.row.jobId)">修改
                        </el-button>
                        <el-button v-if="isAuth('sys:schedule:delete')" type="text" size="small"
                                   @click="deleteHandle(scope.row.jobId)">删除
                        </el-button>
                        <el-button v-if="isAuth('sys:schedule:pause')" type="text" size="small"
                                   @click="pauseHandle(scope.row.jobId)">暂停
                        </el-button>
                        <el-button v-if="isAuth('sys:schedule:resume')" type="text" size="small"
                                   @click="resumeHandle(scope.row.jobId)">恢复
                        </el-button>
                        <el-button v-if="isAuth('sys:schedule:run')" type="text" size="small"
                                   @click="runHandle(scope.row.jobId)">立即执行
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

    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log"></log>
</template>

<script setup>
import {reactive, onMounted, getCurrentInstance} from 'vue'
import {useRouter} from "vue-router"
import request from "../../../utils/request";

const router = useRouter()
const {proxy} = getCurrentInstance()
const ctx = proxy
// 数据
const data = reactive({
    dataForm: {
        beanName: ''
    },
    dataListLoading: false,
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    dataList: [],
    dataListSelections: [],
    logVisible: false
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
        url: '/admin-server/sys/schedule/page',
        params: {
            'page': data.pageIndex,
            'limit': data.pageSize,
            'beanName': data.dataForm.beanName
        }
    }).then(res => {
        data.dataListLoading = false
        data.dataList = reactive(res.data.list)
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
            url: '/admin-server/sys/schedule/delete',
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

// 暂停
const pauseHandle = id => {
    var ids = id ? [id] : data.dataListSelections.map(item => {
        return item.jobId
    })
    ctx.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        request({
            method: 'POST',
            url: '/admin-server/sys/schedule/pause',
            data: ids
        }).then(() => {
            ctx.$message.success('操作成功')
            getDataList()
        }).catch(err => {
            saving.value = false
            ctx.$message.error(err.message)
        })
    }).catch(() => {
    })
}

// 恢复
const resumeHandle = id => {
    var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
    })
    ctx.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        request({
            method: 'POST',
            url: '/admin-server/sys/schedule/resume',
            data: ids
        }).then(() => {
            ctx.$message.success('操作成功')
            getDataList()
        }).catch(err => {
            saving.value = false
            ctx.$message.error(err.message)
        })
    }).catch(() => {
    })
}

// 立即执行
const runHandle = id => {
    var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.jobId
    })
    ctx.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        request({
            method: 'POST',
            url: '/admin-server/sys/schedule/run',
            data: ids
        }).then(() => {
            ctx.$message.success('操作成功')
            getDataList()
        }).catch(err => {
            saving.value = false
            ctx.$message.error(err.message)
        })
    }).catch(() => {
    })
}

// 日志列表
const logHandle = () => {
    data.logVisible = true
    ctx.$nextTick(() => {
        ctx.$refs.log.init()
    })
}


onMounted(() => {
    onQuery()
})
</script>

<style scoped>

</style>
