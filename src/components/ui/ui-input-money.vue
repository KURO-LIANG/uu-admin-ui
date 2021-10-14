<template>
    <el-input
        :value="modelValue"
        :disabled="disabled"
        :clearable="clearable"
        :readonly="readonly"
        :size="_size"
        :maxlength="maxlength"
        @input="onInput"
        @change="onChange"
        :placeholder="placeholder"
    >
        <span slot="suffix"><slot name="suffix"></slot></span>
    </el-input>
</template>

<script setup>
import {computed, defineProps, getCurrentInstance} from 'vue'

const {proxy} = getCurrentInstance()
const ctx = proxy

const props = defineProps({
    modelValue: {
        type: [Number, String],
        default: 0
    },
    decimal: {
        type: Number,
        default: 2
    },
    maxlength: {
        type: Number,
        default: 16
    },
    size: String,
    disabled: Boolean,
    readonly: Boolean,
    clearable: Boolean,
    minus: Boolean,
    placeholder: String
})

const _size = computed(() => {
    return props.size || ctx.$parent.elFormItemSize || ''
})

const check = (value) => {
    let val = ''
    if (undefined !== value && null !== value && '' !== value.trim()) {
        let pattern = ""
        let str = props.minus ? '-?' : ''
        if (props.decimal === 0) {
            pattern = `^${str}\\d+$`
        } else {
            pattern = `^${str}\\d+\\.?(\\d{1,${props.decimal}})?$`
        }
        let reg = new RegExp(pattern)

        if ((props.minus && value === '-') || reg.test(value)) {
            val = value
        } else {
            val = ctx.parseMoney(value, 4, props.decimal)
        }
    }
    return val
}

const onInput = (value) => {
    let val = check(value)
    ctx.$emit('update:modelValue', val)
}

const onChange = (value) => {
    let val = check(value)
    ctx.$emit('update:modelValue', val)
}
</script>

<style scoped>

</style>
