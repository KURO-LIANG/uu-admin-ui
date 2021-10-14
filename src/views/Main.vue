<template>
    <navbar></navbar>
    <div class="layout-main" :class="{'is-collapse':isCollapse}">
        <router-view/>
    </div>
</template>

<script setup>
import Navbar from "./main/Navbar.vue"
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore()

const isCollapse = computed(() => {
    return store.state.menuIsCollapse
})
</script>

<style scoped>
.layout-main {
    padding-top: 50px;
    margin-left: 200px;
    min-height: 100vh;
    transition: margin-left .3s;
}
.layout-main.is-collapse {
    margin-left: 64px;
}
</style>
