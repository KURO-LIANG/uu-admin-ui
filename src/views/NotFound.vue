<template>
    <div class="not-found">
        <h1 class="not-found-title">404</h1>
        <p class="not-found-desc">抱歉！您访问的页面<em>失联</em>啦 ...</p>
        <el-button @click="navigationBack">返回上一页</el-button>
        <el-button type="primary" @click="navigationTo">进入首页</el-button>
    </div>
</template>

<script>
import {defineComponent} from "vue"
import {useRouter} from 'vue-router'

export default defineComponent({

    setup() {
        const router = useRouter()

        const navigationBack = () => {
            router.back()
        }

        const navigationTo = () => {
            router.push('/')
        }

        return {
            router,
            navigationBack,
            navigationTo
        }
    }

})
</script>

<style scoped>
.not-found {
    width: 340px;
    margin: 160px auto 0;
    text-align: center;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    padding-bottom: 20px;
}
</style>
