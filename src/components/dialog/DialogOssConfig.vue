<template>
    <el-dialog
        title="云存储配置"
        v-model="data.visible"
        width="520px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :show-close="!saving"
    >
        <el-form :model="data.dataForm" :rules="data.dataRule" ref="dataFormRef" label-width="6em">
            <el-form-item size="mini" label="存储类型">
                <el-radio-group v-model="data.dataForm.type">
                    <el-radio :label="1">七牛</el-radio>
                    <el-radio :label="2">阿里云</el-radio>
                    <el-radio :label="3">腾讯云</el-radio>
                    <el-radio :label="4">私有云</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="data.dataForm.type === 1">
                <el-form-item size="mini">
                    <a href="http://www.renren.io/open/qiniu.html" target="_blank">免费申请(七牛)10GB储存空间</a>
                </el-form-item>
                <el-form-item label="域名">
                    <el-input v-model="data.dataForm.qiniuDomain" placeholder="七牛绑定的域名"></el-input>
                </el-form-item>
                <el-form-item label="路径前缀">
                    <el-input v-model="data.dataForm.qiniuPrefix" placeholder="不设置默认为空"></el-input>
                </el-form-item>
                <el-form-item label="AccessKey">
                    <el-input v-model="data.dataForm.qiniuAccessKey" placeholder="七牛AccessKey"></el-input>
                </el-form-item>
                <el-form-item label="SecretKey">
                    <el-input v-model="data.dataForm.qiniuSecretKey" placeholder="七牛SecretKey"></el-input>
                </el-form-item>
                <el-form-item label="空间名">
                    <el-input v-model="data.dataForm.qiniuBucketName" placeholder="七牛存储空间名"></el-input>
                </el-form-item>
            </template>
            <template v-else-if="data.dataForm.type === 2">
                <el-form-item label="域名">
                    <el-input v-model="data.dataForm.aliyunDomain" placeholder="阿里云绑定的域名"></el-input>
                </el-form-item>
                <el-form-item label="路径前缀">
                    <el-input v-model="data.dataForm.aliyunPrefix" placeholder="不设置默认为空"></el-input>
                </el-form-item>
                <el-form-item label="EndPoint">
                    <el-input v-model="data.dataForm.aliyunEndPoint" placeholder="阿里云EndPoint"></el-input>
                </el-form-item>
                <el-form-item label="AccessKeyId">
                    <el-input v-model="data.dataForm.aliyunAccessKeyId" placeholder="阿里云AccessKeyId"></el-input>
                </el-form-item>
                <el-form-item label="AccessKeySecret">
                    <el-input v-model="data.dataForm.aliyunAccessKeySecret" placeholder="阿里云AccessKeySecret"></el-input>
                </el-form-item>
                <el-form-item label="BucketName">
                    <el-input v-model="data.dataForm.aliyunBucketName" placeholder="阿里云BucketName"></el-input>
                </el-form-item>
            </template>
            <template v-else-if="data.dataForm.type === 3">
                <el-form-item label="域名">
                    <el-input v-model="data.dataForm.qcloudDomain" placeholder="腾讯云绑定的域名"></el-input>
                </el-form-item>
                <el-form-item label="路径前缀">
                    <el-input v-model="data.dataForm.qcloudPrefix" placeholder="不设置默认为空"></el-input>
                </el-form-item>
                <el-form-item label="AppId">
                    <el-input v-model="data.dataForm.qcloudAppId" placeholder="腾讯云AppId"></el-input>
                </el-form-item>
                <el-form-item label="SecretId">
                    <el-input v-model="data.dataForm.qcloudSecretId" placeholder="腾讯云SecretId"></el-input>
                </el-form-item>
                <el-form-item label="SecretKey">
                    <el-input v-model="data.dataForm.qcloudSecretKey" placeholder="腾讯云SecretKey"></el-input>
                </el-form-item>
                <el-form-item label="BucketName">
                    <el-input v-model="data.dataForm.qcloudBucketName" placeholder="腾讯云BucketName"></el-input>
                </el-form-item>
                <el-form-item label="Bucket所属地区">
                    <el-input v-model="data.dataForm.qcloudRegion"
                              placeholder="如：sh（可选值 ，华南：gz 华北：tj 华东：sh）"></el-input>
                </el-form-item>
            </template>
            <template v-else-if="data.dataForm.type === 4">
                <el-form-item label="域名">
                    <el-input v-model="data.dataForm.privateDomain" placeholder="私有云绑定的域名"></el-input>
                </el-form-item>
                <el-form-item label="路径前缀">
                    <el-input v-model="data.dataForm.privatePrefix" placeholder="不设置默认为空"></el-input>
                </el-form-item>
                <el-form-item label="Windows 系统地址">
                    <el-input v-model="data.dataForm.privateWindowsUrl" placeholder="Windows 系统地址"></el-input>
                </el-form-item>
                <el-form-item label="linux 系统地址">
                    <el-input v-model="data.dataForm.privateLinuxUrl" placeholder="linux 系统地址"></el-input>
                </el-form-item>
            </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="data.visible = false">取消</el-button>
            <el-button type="primary" @click="submitForm()">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {ref, reactive, getCurrentInstance, defineComponent} from 'vue'
import request from "../../utils/request"

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance()

        let saving = ref(false)
        let loading = ref(false)
        let dataFormRef = ref(null)

        let data = reactive({
            visible: false,
            dataForm: {
                type: 1,
                qiniuDomain: "",
                qiniuPrefix: '',
                qiniuAccessKey: '',
                qiniuSecretKey: '',
                qiniuBucketName: '',
                aliyunDomain: '',
                aliyunPrefix: '',
                aliyunEndPoint: '',
                aliyunAccessKeyId: '',
                aliyunAccessKeySecret: '',
                aliyunBucketName: '',
                qcloudDomain: '',
                qcloudPrefix: '',
                qcloudAppId: '',
                qcloudSecretId: '',
                qcloudSecretKey: '',
                qcloudBucketName: '',
                qcloudRegion: '',
                privateDomain: '',
                privatePrefix: '',
                privateWindowsUrl: '',
                privateLinuxUrl: '',
            },
            dataRule: {
                title: [
                    {
                        required: true,
                        message: 'Title不能为空',
                        trigger: 'blur'
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: 'Phone不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        })

        const show = () => {
            data.visible = true
            getData()
        }

        const submitForm = () => {
            saving.value = true
            dataFormRef.value.validate(valid => {
                if (valid) {
                    request({
                        method: 'PUT',
                        url: `/admin-server/sys/oss/saveConfig`,
                        data: data.dataForm
                    }).then(res => {
                        saving.value = false
                        proxy.$message.success('操作成功')
                        data.visible = false;
                    }).catch(err => {
                        saving.value = false
                        proxy.$message.error(err.message)
                    })
                } else {
                    saving.value = false
                    return false
                }
            })
        }

        const getData = () => {
            loading.value = true
            request({
                method: 'GET',
                url: `/admin-server/sys/oss/config`
            }).then(res => {
                loading.value = false
                if (res.data) {
                    data.dataForm = res.data
                }
            }).catch(err => {
                loading.value = false
                proxy.$message.error(err.message)
            })
        }

        return {
            saving,
            loading,
            data,
            show,
            submitForm
        }
    }
})
</script>


