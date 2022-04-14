<template>
    <div class="login-container">
        <div class="login-center-layout"></div>
        <el-card class="login-form-layout">
            <el-form
                autoComplete="on"
                :model="dataForm"
                :rules="dataRule"
                ref="domDataForm"
                @submit="submitForm"
                label-position="left">
                <div class="text-center">
                    <svg-icon icon-class="shouye" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
                </div>
                <h2 class="login-title color-main">UU-ADMIN · 登录</h2>
                <el-form-item prop="username">
                    <el-input
                        name="username"
                        type="text"
                        v-model="dataForm.username"
                        autoComplete="on"
                        placeholder="请输入用户名">
                        <template #prefix>
                            <div class="icon-box">
                                <svg-icon icon-class="user" class="color-main"></svg-icon>
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        name="password"
                        :type="pwdType"
                        v-model="dataForm.password"
                        autoComplete="on"
                        placeholder="请输入密码">
                        <template #prefix>
                            <div class="icon-box">
                                <svg-icon icon-class="lock" class="color-main"></svg-icon>
                            </div>
                        </template>
                        <template #suffix>
                            <div class="icon-box">
                                <svg-icon @click="showPwd" :icon-class="pwdType==='text'?'eye':'eye-close'"
                                          class="color-main"></svg-icon>
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                    <div class="flex-row">
                        <div class="flex-item">
                            <el-input v-model="dataForm.captcha" placeholder="验证码" maxlength="6">
                                <template #prefix>
                                    <div class="icon-box">
                                        <svg-icon icon-class="security" class="color-main"></svg-icon>
                                    </div>
                                </template>
                            </el-input>
                        </div>
                        <div class="login-captcha">
                            <img :src="captchaPath" @click="getCaptcha()"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item style="margin-bottom: 40px;text-align: center">
                    <el-button
                        style="width: 45%"
                        type="primary"
                        :loading="loading"
                        native-type="submit"
                    >登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import storage from "../utils/storage"
import {getUUID} from "../utils";
import {defineComponent, onMounted, reactive, ref, getCurrentInstance} from 'vue'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'

export default defineComponent({
    setup() {
        const {proxy} = getCurrentInstance()
        const router = useRouter()
        const store = useStore()

        let domDataForm = ref(null)
        let loading = ref(false)
        let captchaPath = ref("")
        let pwdType = ref("password")

        let dataForm = reactive({
            username: '',
            password: '',
            uuid: "",
            captcha: ""
        })
        let dataRule = reactive({
            username: [{
                required: true,
                message: '请输入用户名',
                trigger: 'blur'
            }],
            password: [{
                required: true,
                message: '请输入密码',
                trigger: 'blur'
            }],
            captcha: [
                {required: true, message: "验证码不能为空", trigger: "blur"}
            ]
        })

        // 获取验证码
        const getCaptcha = () => {
            dataForm.uuid = getUUID();
            // captchaPath.value = import.meta.env.VITE_API_URL + `/uu-admin/captcha.jpg?uuid=${dataForm.uuid}`
            captchaPath.value = import.meta.env.VITE_API_URL + `/admin-server/captcha.jpg?uuid=${dataForm.uuid}`
        }

        const showPwd = () => {
            if (pwdType.value === 'password') {
                pwdType.value = 'text'
            } else {
                pwdType.value = 'password'
            }
        }

        const submitForm = (e) => {
            e.preventDefault()
            e.stopPropagation()
            loading.value = true
            domDataForm.value.validate(valid => {
                if (valid) {
                    proxy.$axios({
                        method: 'POST',
                        // url: '/uu-admin/sys/login',
                        url: '/admin-server/sys/login',
                        data: dataForm
                    }).then(res => {
                        storage.setItem('expireTime', res.data.expireTime * 1000 + (new Date()).getTime())
                        storage.setItem('token', res.data.token)
                        store.commit('login', res.data.userInfo)
                        router.push('/')
                    }).catch(err => {
                        loading.value = false
                        getCaptcha()
                        proxy.$message.error(err.message)
                    })
                } else {
                    loading.value = false
                    return false
                }
            })
        }

        onMounted(() => {
            getCaptcha()
        });

        return {
            loading,
            domDataForm,
            dataForm,
            dataRule,
            submitForm,
            captchaPath,
            getCaptcha,
            pwdType,
            showPwd
        }
    }

})
</script>

<style lang="scss" scoped>
.login-container {
    position: relative;
    height: 100vh;
    min-height: 550px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form-layout {
    position: relative;
    width: 360px;
    border-top: 10px solid #409EFF;
}

.login-title {
    text-align: center;
}

.login-center-layout {
    height: 350px;
    background: #409EFF url("img/login_center_bg.png") no-repeat center center;
    background-size: auto 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}

.login-captcha {
    padding-left: 20px;

    img {
        display: block;
        height: 40px;
    }
}

.login-captcha > img {
    width: 120px;
    height: 40px;
    cursor: pointer;
}

.color-main {
    color: #409eff;
}

.icon-box {
    height: 40px;
    display: flex;
    align-items: center;
}
</style>
