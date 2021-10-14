<template>
    <div class="layout-breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="(item,index) in dataList" :key="item.path">
                <span v-if="item.redirect === 'noredirect'|| index === dataList.length-1" class="no-redirect">
                {{ item.meta.title }}
                </span>
                <span v-else>{{ item.meta.title }}</span>
                <!--                    <router-link v-else :to="item.redirect||item.path">{{ item.meta.title }}</router-link>-->
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import {watch, onMounted, ref} from 'vue'
import {useRoute} from "vue-router"

const route = useRoute()
const dataList = ref([])

const getBreadcrumb = () => {
    let matched = route.matched.filter(item => item.name)
    const first = matched[0]
    let firstMatched = []
    if (first && first.name !== 'home') {
        firstMatched = [{path: '/home', meta: {title: '首页'}}]
    }

    matched.forEach(item => {
        if (item.meta.parentName && item.meta.parentName !== '') {
            //有父类
            firstMatched = firstMatched.concat([{path: item.path, meta: {title: item.meta.parentName}}])
        }
    })

    matched = firstMatched.concat(matched)
    matched = matched.filter(item => item.meta.title)
    dataList.value = matched
}

watch(route, () => {
    getBreadcrumb()
})

onMounted(() => {
    getBreadcrumb()
})
</script>

<style lang="scss" scoped>
.layout-breadcrumb {
    height: 50px;
    display: flex;
    align-items: center;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }
}
</style>
