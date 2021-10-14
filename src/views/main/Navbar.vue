<template>
    <div class="layout-header" :class="{'is-collapse':isCollapse}">
        <div class="flex-row">
            <hamburger @click="toggleSideBar" :isActive="isCollapse"></hamburger>
            <breadcrumb></breadcrumb>
        </div>
        <div>
            <div class="updateLog gap-mr-lg">
                <i class="el-icon-question"></i>
            </div>
            <el-dropdown>
                <div class="top-dropdown-link">
                    <i class="el-icon-user gap-mr-sm"></i>
                    <span>{{userInfo.username}}</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>用户资料</el-dropdown-item>
                        <el-dropdown-item @click="updatePasswordHandle">修改密码</el-dropdown-item>
                        <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <update-password ref="updatePasswordRef"></update-password>

    <div class="layout-aside" :class="{'is-collapse':isCollapse}">
        <div class="layout-aside-head">
            <svg-icon icon-class="shouye"></svg-icon>
            <span class="head-text" v-if="!isCollapse">UU-ADMIN</span>
        </div>
        <div class="layout-aside-content">
            <el-menu
                    :uniqueOpened="true"
                    :default-active="activeIndex"
                    :collapse="isCollapse"
                    class="el-menu-vertical-demo"
                    @select="handleSelect"
                    background-color="rgb(48, 65, 86)"
                    text-color="rgb(191, 203, 217)"
                    active-text-color="#ffd04b">

                <aside-menu index="0" :menu="menus"></aside-menu>
            </el-menu>
        </div>
    </div>

</template>

<script>
import {defineComponent, reactive, ref, computed} from "vue"
import UpdatePassword from "./UpdatePassword.vue"
import storage from "../../utils/storage"
import Hamburger from '../../components/Hamburger/index.vue'
import Breadcrumb from '../../components/Breadcrumb/index.vue'
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import AsideMenu from "./AsideMenu.vue"

export default defineComponent({
    components: {
        UpdatePassword,
        Hamburger,
        AsideMenu,
        Breadcrumb
    },
    setup() {
        const store = useStore()
        const router = useRouter()

        let userInfo = store.state.userInfo

        const updatePasswordRef = ref(null)

        const updatePasswordHandle = () => {
            updatePasswordRef.value.show()
        }

        const logout = () => {
            store.commit('logout')
            router.push('/login')
        }

        const isCollapse = computed(() => {
            return store.state.menuIsCollapse
        })

        const toggleSideBar = () => {
            store.commit('updateMenuIsCollapse', !isCollapse.value)
        }

        let menus = reactive(storage.getObject('menu', []))
        menus.unshift({
            "menuId": 1,
            "parentId": 0,
            "name": "首页",
            "icon": "house",
            "url": "/",
        })

        let activeIndex = ref('')
        activeIndex.value = storage.getItem('menuIndex', '')

        if(!activeIndex.value){
            activeIndex.value = '0-0'
        }
        const handleSelect = index => {
            activeIndex = index
            storage.setItem('menuIndex', index)
        }

        return {
            updatePasswordRef,
            updatePasswordHandle,
            logout,
            userInfo,
            isCollapse,
            toggleSideBar,
            menus,
            activeIndex,
            handleSelect
        }
    }
})
</script>

<style scoped>
    .layout-header {
        height: 50px;
        position: fixed;
        z-index: 999;
        left: 200px;
        right: 0;
        top: 0;
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding-right: var(--gap-size);
        display: flex;
        justify-content: space-between;
        transition: left .3s;
    }
    .layout-header.is-collapse {
        left: 64px;
    }
    .top-dropdown-link {
        height: 50px;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .layout-aside {
        position: fixed;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        color: rgb(191, 203, 217);
        background-color: rgb(48, 65, 86);
        width: 200px;
        transition: width 0.3s;
        overflow: hidden;
    }
    .layout-aside.is-collapse {
        width: 64px;
    }
    .layout-aside-head {
        height: 50px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 1.6em;
    }
    .layout-aside-head span{
        line-height: 2em;
        margin-left: 7px;
    }
    .layout-aside-content {
        height: calc(100% - 50px);
        overflow: auto;
    }

    .layout-aside-content::-webkit-scrollbar {
        width: 0;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
    }

    .head-text {
        white-space: nowrap;
    }
    .updateLog{
        font-size: 26px;
        cursor: pointer;
        display: inline;
    }
</style>
