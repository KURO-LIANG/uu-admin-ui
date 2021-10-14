<template>
    <div class="hamburger" :class="{'is-active':isActive}">
        <svg-icon icon-class="bars-arrow"></svg-icon>
    </div>
</template>

<script setup>
import {defineProps} from 'vue'

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.hamburger {
    cursor: pointer;
    width: 60px;
    height: 50px;
    transition: .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}

.hamburger.is-active {
    transform: rotateY(180deg);
}
</style>
