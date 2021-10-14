<template>
    <div class="page-header">
        <div v-if="back" class="page-back" @click="$router.back()">
            <i class="el-icon-arrow-left"></i>
        </div>
        <div class="page-left">
            <slot name="title">
                <h2 class="page-title">{{ title }}</h2>
            </slot>
        </div>
        <div class="page-right" slot="right"></div>
    </div>
</template>

<script setup>
import {defineProps} from "vue"

defineProps({
    back: Boolean,
    title: String
})

</script>
