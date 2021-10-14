<template>
    <div class="page-right" v-loading="loading">
        <page-header :title="pageTitle" back/>
        <div class="page-body">
            <el-form
                ref="dataFormRef"
                :model="dataForm"
                :rules="dataRule"
                size="small"
                label-width="6em"
            >
                <el-form-item label="key" prop="paramKey">
                    <el-input v-model="dataForm.paramKey" placeholder="key"></el-input>
                </el-form-item>
                <el-form-item label="value" prop="paramValue">
                    <el-input v-model="dataForm.paramValue" placeholder="value"></el-input>
                </el-form-item>
                <el-form-item label="状态   0：隐藏   1：显示" prop="status">
                    <el-input v-model="dataForm.status" placeholder="状态 0：隐藏 1：显示"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" prop="updateTime">
                    <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
                </el-form-item>
                <el-form-item label="操作者" prop="updateBy">
                    <el-input v-model="dataForm.updateBy" placeholder="操作者"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button :loading="saving" type="primary" @click="submitForm">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, getCurrentInstance} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import request from "../../../utils/request";
import PageHeader from "../../../components/PageHeader.vue"

const route = useRoute()
const router = useRouter()
const {proxy} = getCurrentInstance()
const ctx = proxy

let saving = ref(false)
let loading = ref(false)
let pageTitle = ref('')

let dataForm = reactive({
    id: 0,
    paramKey: '',
    paramValue: '',
    status: '',
    remark: '',
    createTime: '',
    updateTime: '',
    updateBy: ''
})

let dataRule = reactive({
    paramKey: [
        {required: true, message: 'key不能为空', trigger: 'blur'}
    ],
    paramValue: [
        {required: true, message: 'value不能为空', trigger: 'blur'}
    ],
    status: [
        {required: true, message: '状态   0：隐藏   1：显示不能为空', trigger: 'blur'}
    ],
    remark: [
        {required: true, message: '备注不能为空', trigger: 'blur'}
    ],
    createTime: [
        {required: true, message: '创建时间不能为空', trigger: 'blur'}
    ],
    updateTime: [
        {required: true, message: '更新时间不能为空', trigger: 'blur'}
    ],
    updateBy: [
        {required: true, message: '操作者不能为空', trigger: 'blur'}
    ]
})

const submitForm = () => {
    saving.value = true
    ctx.$refs.dataFormRef.validate(valid => {
        if (valid) {
            request({
                method: `${!dataForm.id ? 'POST' : 'PUT'}`,
                url: `/admin-server/oss/sysconfig/${!dataForm.id ? 'save' : 'update'}`,
                data: dataForm
            }).then(res => {
                saving.value = false
                ctx.$message.success('操作成功')
                ctx.$router.back()
            }).catch(err => {
                saving.value = false
                ctx.$message.error(err.message)
            })
        } else {
            saving.value = false
            return false
        }
    })
}

const getData = id => {
    loading.value = true
    request({
        method: 'GET',
        url: `/admin-server/oss/sysconfig/info/${id}`
    }).then(res => {
        loading.value = false
        dataForm.paramKey = res.data.paramKey
        dataForm.paramValue = res.data.paramValue
        dataForm.status = res.data.status
        dataForm.remark = res.data.remark
        dataForm.createTime = res.data.createTime
        dataForm.updateTime = res.data.updateTime
        dataForm.updateBy = res.data.updateBy
    }).catch(err => {
        loading.value = false
        ctx.$message.error(err.message)
    })
}

onMounted(() => {
    if (route.query.id) {
        pageTitle.value = '修改'
        getData(route.query.id)
    } else {
        pageTitle.value = '新增'
    }
})
</script>

<style scoped>

</style>
