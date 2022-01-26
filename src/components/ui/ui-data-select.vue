<template>
    <el-select
        :value="value"
        :size="_size"
        :disabled="disabled"
        :clearable="clearable"
        :filterable="filterable"
        :placeholder="placeholder"
        @change="onchange"
    >
        <el-option
            v-for="item in list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
    </el-select>
</template>

<script>
import {smartData} from '../../service/index'

export default {
    name: 'ui-data-select',
    props: {
        value: {
            type: [Number, String],
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: String,
        name: {
            type: String
        },
        include: Array,
        exclude: Array,
        all: Boolean,
        clearable: Boolean,
        filterable: Boolean,
        allValue: {
            default: ''
        },
        allLabel: {
            type: String,
            default: '全部'
        },
        placeholder: String
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    computed: {
        list() {
            let data = []
            if (this.name && smartData[this.name]) {
                data = smartData[this.name]
            }
            if(this.exclude) {
                data = data.filter(item => {
                    return this.exclude.indexOf(item.value) < 0
                })
            }
            if(this.include) {
                data = data.filter(item => {
                    return this.include.indexOf(item.value) > -1
                })
            }
            data = JSON.parse(JSON.stringify(data))
            if(this.all) {
                data.unshift({
                    value: this.allValue,
                    label: this.allLabel
                })
            }
            return data
        },
        _size() {
            return this.size || this.$parent.elFormItemSize || ''
        }
    },
    methods: {
        onchange(value) {
            this.$emit('change', value)
        }
    }
}
</script>
