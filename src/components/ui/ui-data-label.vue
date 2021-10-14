<template>
  <el-tag v-if="theme==='tag'" :type="type">{{label}}</el-tag>
  <span v-else :class="[type!==''?'text-'+type : '']">{{label}}</span>
</template>

<script>
import {smartData} from '../../service/index'

export default {
  name: "ui-data-label",
  props: {
    modelValue: [String, Number],
    name: String,
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'text'
    }
  },
  computed: {
    label() {
      if (this.isEmpty(this.modelValue) || !this.name) {
        return this.placeholder
      }


      for (let item of smartData[this.name]) {
        if (item.value === this.modelValue) {
          return item.label
        }
      }
      return this.placeholder
    }
  },
  methods: {
    isEmpty(value) {
      if (null === value || undefined === value || '' === value) {
        return true
      }
      return false
    }
  }
}
</script>
