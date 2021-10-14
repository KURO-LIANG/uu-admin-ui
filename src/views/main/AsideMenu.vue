<template>
    <template v-for="(item, idx) of menu">
        <el-sub-menu v-if="item.list && item.list.length" :index="index+'-'+idx">
            <template #title>
                <svg-icon :icon-class="item.icon" class="gap-mr-sm"></svg-icon>
                <span>{{ item.name }}</span>
            </template>
            <aside-menu :index="index+'-'+idx" :menu="item.list"></aside-menu>
        </el-sub-menu>
        <el-menu-item v-else :index="index+'-'+idx" @click="handleRoute(item)">
            <svg-icon v-if="!item.icon" icon-class="sub-menu" class="gap-mr-sm"></svg-icon>
            <svg-icon v-else :icon-class="item.icon" class="gap-mr-sm"></svg-icon>
            <span>{{item.name }}</span>
        </el-menu-item>
    </template>
</template>

<script>
import {defineComponent} from 'vue'
import {useRouter} from 'vue-router'

export default defineComponent({
    props: {
        menu: {
            type: Array,
            default() {
                return []
            }
        },
        index: {
            type: String,
            default: ''
        }
    },
    setup() {
        const router = useRouter()

        const handleRoute = data => {
            if (data.url) {
                router.push(`/${data.url}`)
            }
        }

        return {
            handleRoute
        }
    }
})
</script>

<style scoped>

</style>
