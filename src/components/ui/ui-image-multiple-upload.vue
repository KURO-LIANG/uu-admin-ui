<template>
    <div class="flex-row">
        <el-upload
                class="upload-demo"
                :action="action"
                ref="uploadRef"
                name="files"
                :multiple="true"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-error="handleError"
                :on-change="handleChange"
                :file-list="fileList"
                :on-progress="handleProgress"
                :accept="accept"
                :limit="limit"
                :http-request="uploadFile"
                list-type="picture-card"
        >
            <template #trigger>
                <el-button type="primary">选择图片</el-button>
            </template>

            <el-button class="ml-3 gap-ml-lg" type="success" @click="submitUpload">开始上传</el-button>

            <template #tip>
                <div class="el-upload__tip">
                    {{tip}}
                </div>
            </template>
        </el-upload>
    </div>
</template>

<script setup>
import {ref, computed, defineProps, getCurrentInstance, onMounted} from "vue"
import storage from "../../utils/storage"
import { ElUpload } from 'element-plus'
import request from "../../utils/request";

const {proxy} = getCurrentInstance()
const ctx = proxy
const uploadRef = ref()

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
    },
    tip: {
        type: String,
        default: '建议图片尺寸：100px*100px，不超过：500kb'
    }
})

const action = ref('')
let dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 文件上传数据（多文件合一）
let fileData = new FormData()
// upload多文件数组
const uploadData = ref({
    fieldData:{}
})
// 上传的多文件数组
const uploadFileList = ref([])

// 已上传数组
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

const uploadFile = (file) => {
    console.log("uploadFile")
    fileData.append('files', file.file);  // append增加数据
}

const handleError = (err) => {
    ctx.$alert(err.message)
}
const handleProgress = (event, file, fileList) => {
    console.log("上传中...")
    console.log(file)
    console.log(fileList)
}
const handleChange = (file, fileList) => {
    console.log("文件改变")
    let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name);
    if (existFile) {
        ctx.$alert('当前文件已经存在!');
        fileList.pop();
    }
    uploadFileList.value = fileList;

}

const handleRemove = (file, fileList) => {
    let arr = []
    for (let item of fileList) {
        arr.push(item.url)
    }
    ctx.$emit('update:value', arr.join(','))
}

const handlePreview = (file) => {
    console.log(file)
}
// const submitUpload = () => {
//     console.log(uploadRef.value)
//     uploadRef.value?.submit()
// }

const submitUpload = (file) => {
    if (uploadFileList.value.length === 0) {
        ctx.$alert('请先选择文件')
    } else {
        // const isLt100M = uploadFileList.value.every(file => file.size < 500);
        const isLt100M = true;
        if (!isLt100M) {
            ctx.$alert('请检查，上传文件大小不能超过500Kb!');
        } else {
            // uploadRef.value?.submit()  // 提交调用uploadFile函数

            ctx.$axios({
                method: "POST",
                url: action.value,
                data: fileData
            }).then((res) => {
                if (res.code === 0) {
                    console.log()
                    uploadFileList.value = []
                    fileData = new FormData()

                    uploadRef.value.clearFiles();

                    console.log(props.modelValue ? (props.modelValue + ',' + res.data.join(",")) : res.data.join(","))
                    ctx.$emit('update:modelValue', props.modelValue ? (props.modelValue + ',' + res.data.join(",")) : res.data.join(","))
                } else {
                    ctx.$alert("上传失败");
                    uploadRef.value.clearFiles();
                }
            });

        }
    }
}

onMounted(() => {
    const token = storage.getItem('token', '')
    action.value = `${import.meta.env.VITE_API_URL}/admin-server/sys/oss/multipleUpload?token=${token}`
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
