<template>
    <el-dialog
        title="修改密码"
        v-model="visible"
        width="420px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :show-close="!saving"
    >

        <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule"
                 size="small"
                 label-width="6em">
            <el-form-item prop="oldPassword" label="原密码">
                <el-input v-model="dataForm.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码">
                <el-input v-model="dataForm.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item prop="againPassword" label="确认密码">
                <el-input v-model="dataForm.againPassword" type="password"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button size="small" :disabled="saving" @click="hide">取 消</el-button>
                <el-button size="small" :loading="saving" type="primary" @click="submitForm">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import {defineComponent, getCurrentInstance, reactive, ref} from 'vue'

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance()
        const ctx = proxy
        const dataFormRef = ref(null)
        const visible = ref(false)
        const saving = ref(false)
        const dataForm = reactive({
            oldPassword: '',
            newPassword: '',
            againPassword: '',
        })
        const dataRule = {
            oldPassword: [
                {
                    required: true,
                    message: '原密码不能为空',
                    trigger: 'blur'
                }
            ],
            newPassword: [
                {
                    required: true,
                    message: '新密码不能为空',
                    trigger: 'blur'
                }
            ],
            againPassword: [
                {
                    required: true,
                    message: '请再次输入新密码',
                    trigger: 'blur'
                },
                {
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入新密码'));
                        } else if (value !== dataForm.newPassword) {
                            callback(new Error('两次输入新密码不一致!'));
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                }
            ],
        }

        const show = () => {
            visible.value = true
            dataForm.oldPassword = ''
            dataForm.newPassword = ''
            dataForm.againPassword = ''
        }

        const hide = () => {
            visible.value = false
        }

        const submitForm = () => {
            if (saving.value) return false
            saving.value = true
            dataFormRef.value.validate(valid => {
                if (valid) {
                    ctx.$axios.put('/update', dataForm).then(res => {
                        saving.value = false
                        ctx.$message.success('操作成功')
                        hide()
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

        return {
            dataFormRef,
            visible,
            saving,
            dataForm,
            dataRule,
            show,
            hide,
            submitForm
        }
    }

})
</script>

<style scoped>

</style>
