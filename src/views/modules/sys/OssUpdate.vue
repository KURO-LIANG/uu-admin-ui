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
                <el-form-item label="文件" prop="url">
                    <ui-image-upload v-model="dataForm.url"></ui-image-upload>
                </el-form-item>
                <el-form-item>
                    <el-button
                            :loading="saving"
                            type="primary"
                            @click="submitForm"
                    >保存
                    </el-button>
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
        url: '',
        createDate: '',
        updateBy: ''
    })

    let dataRule = reactive({
        url: [
            {required: true, message: 'URL地址不能为空', trigger: 'blur'}
        ],
        createDate: [
            {required: true, message: '创建时间不能为空', trigger: 'blur'}
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
                    url: `/admin-server/oss/sysoss/${!dataForm.id ? 'save' : 'update'}`,
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
            url: `/admin-server/oss/sysoss/info/${id}`
        }).then(res => {
            loading.value = false
            dataForm.url = res.data.url
            dataForm.createDate = res.data.createDate
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
