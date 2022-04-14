<template>
    <div class="flex-row">
        <el-upload
            :action="action"
            list-type="picture-card"
            name="file"
            :show-file-list="limit > 1"
            :multiple="false"
            :limit="limit"
            :file-list="[]"
            :accept="accept"
            :before-upload="handleBeforeUpload"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :on-progress="uploadVideoProcess"
            :on-error="handleError"
            :on-remove="handleRemove"
            :on-exceed="handleExceed">

            <i v-if="!data.videoFlag" class="el-icon-plus avatar-uploader-icon"></i>
            <el-progress v-if="data.videoFlag"
                         type="circle"
                         :percentage="data.videoUploadPercent"
                         style="margin-top:7px;"></el-progress>
        </el-upload>

      <video v-if="dialogImageUrl && !data.videoFlag"
             :src="dialogImageUrl"
             class="video-preview gap-ml"
             controls="controls">
        您的浏览器不支持视频播放
      </video>
    </div>
</template>

<script setup>
import {ref, reactive, defineProps, getCurrentInstance, onMounted, computed} from "vue"
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
        default: 'video/mp4'
    }
})

const action = ref('')
let dialogVisible = ref(false)

const data = reactive({
  videoFlag: false,
  //是否显示进度条
  videoUploadPercent: "",
  //进度条的进度，
  isShowUploadVideo: false,
})

const dialogImageUrl = computed(() => {
  return props.modelValue
})

const handleBeforeUpload = (file) => {
    const typeArray = props.accept.split(',')
    if (typeArray.indexOf(file.type) < 0) {
        ctx.$alert('仅支持上传.mp4')
        return false
    }

    const fileSize = file.size / 1024 / 1024 < 300
    if (!fileSize) {
      ctx.$alert('视频大小不能超过300MB')
      return false;
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

const uploadVideoProcess = (event, file, fileList) => {
  data.videoFlag = true;
  data.videoUploadPercent = file.percentage.toFixed(0) * 1;
}

const handleSuccess = (response) => {
  console.log("上传成功")
    data.videoFlag = false;
    data.videoUploadPercent = 0;
    if (response.code === 0) {
        const _value = !props.modelValue || props.limit === 1 ? response.data : props.modelValue + ',' + response.data
        dialogImageUrl.value = _value
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
.video-preview {
  height: 400px !important;
}

</style>
