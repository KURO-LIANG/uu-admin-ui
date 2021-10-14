<template>
    <div class="flex-row">
        <el-upload
            :action="action"
            list-type="picture-card"
            name="file"
            :show-file-list="limit > 1"
            :multiple="false"
            :limit="limit"
            :file-list="limit===1?[]:fileList"
            :accept="accept"
            :before-upload="handleBeforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-remove="handleRemove"
            :on-exceed="handleExceed">
            <i v-if="limit > fileList.length" class="el-icon-plus"></i>
            <img v-if="limit === 1 && fileList.length" :src="fileList[0].url" style="max-width: 95%;max-height: 95%;vertical-align: middle;">
        </el-upload>
        <div class="img-preview" v-show="dialogVisible" @click="dialogVisible = false">
            <img :src="dialogImageUrl">
        </div>
    </div>
</template>

<script setup>
import {ref, computed, defineProps, getCurrentInstance, onMounted} from "vue"
import storage from "../../utils/storage"

const {proxy} = getCurrentInstance()
const ctx = proxy

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    limit: {
        type: Number,
        default: 1
    },
    accept: {
        type: String,
        default: 'image/png,image/jpeg'
    }
})

const action = ref('')
let dialogVisible = ref(false)
const dialogImageUrl = ref('')

const fileList = computed(() => {
    if (!props.modelValue) {
        return []
    } else {
        return props.modelValue.split(',').map(item => {
            return {
                name: item,
                url: item
            }
        })
    }
})

const handleBeforeUpload = (file) => {
    const typeArray = props.accept.split(',')
    if (typeArray.indexOf(file.type) < 0) {
        ctx.$alert('仅支持上传.jpg,.png,jpeg')
        return false
    }
}
const handlePictureCardPreview = (file) => {
    dialogVisible.value = true
    dialogImageUrl.value = file.url
}
const handleExceed = () => {
    ctx.$alert('超过最大上传数量')
}
const handleError = (err) => {
    ctx.$alert(err.message)
}
const handleSuccess = (response) => {
    if (response.code === 0) {
        const _value = !props.modelValue || props.limit === 1 ? response.data : props.modelValue + ',' + response.data
        ctx.$emit('update:modelValue', _value)
    } else {
        ctx.$alert(response.msg)
    }
}
const handleRemove = (file, fileList) => {
    let arr = []
    for (let item of fileList) {
        arr.push(item.url)
    }
    ctx.$emit('update:value', arr.join(','))
}

onMounted(() => {
    const token = storage.getItem('token', '')
    action.value = `${import.meta.env.VITE_API_URL}/admin-server/sys/oss/upload?token=${token}`
})
</script>
<style scoped>
.img-preview {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
}

.img-preview img {
    max-width: 100%;
    max-height: 100%;
}

.ui-upload-image {
    width: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ui-upload-image img {
    max-width: 100%;
    max-height: 100%;
}

.ui-upload-progress {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
}
.el-upload{
    height: auto !important;
}
</style>
