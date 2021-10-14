<template>
    <div class="page-right" v-loading="loading">
        <page-header title="关于我们"/>
        <div class="page-body">

            <div style="max-width: 640px;">
                <el-form ref="dataFormRef" :model="dataForm" :rules="dataRule" size="small">
                    <el-form-item>
                        <el-button
                            :loading="saving"
                            type="primary"
                            @click="submitForm"
                        >保存
                        </el-button>
                    </el-form-item>
                    <div>
                        <ckeditor
                            v-model="dataForm.content"
                            :editor="data.editor"
                            :config="data.editorConfig"
                            @ready="onReady"
                        ></ckeditor>
                    </div>

                </el-form>
            </div>

        </div>
    </div>
</template>

<script>
import {ref, reactive, onMounted, getCurrentInstance, defineComponent} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import request from "../../../utils/request"
import PageHeader from "../../../components/PageHeader.vue"
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn.js'
import CKEditor from '@ckeditor/ckeditor5-vue';
import UploadAdapter from "../../../utils/UploadAdapter";

export default defineComponent({
    components: {
        ckeditor: CKEditor.component,
        PageHeader
    },
    setup() {
        const {proxy} = getCurrentInstance()

        let dataFormRef = ref(null)
        let saving = ref(false)
        let loading = ref(false)

        const data = reactive({
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                language: 'zh-cn',
                // toolbar: {
                //     items: [
                //         'undo', 'redo', 'bold', 'italic', 'underline', 'numberedList', 'bulletedList', 'Link','alignment',
                //         '|', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells','fontSize','fontColor'
                //     ]
                // }
            },
        })
        let dataForm = reactive({
            content: '',
        })

        let dataRule = reactive({
            content: [
                {required: true, message: '请填写内容', trigger: 'blur'}
            ]
        })

        const onReady = (editor) => {
            // Insert the toolbar before the editable area.
            editor.ui.getEditableElement().parentElement.insertBefore(
                editor.ui.view.toolbar.element,
                editor.ui.getEditableElement()
            );

            // 自定义上传图片插件
            editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
                return new UploadAdapter(loader);
            };
        }

        const submitForm = () => {
            saving.value = true
            dataFormRef.value.validate(valid => {
                if (valid) {
                    request({
                        method: 'POST',
                        url: `/admin-server/sys/config/aboutSetting`,
                        data: {"paramValue": dataForm.content}
                    }).then(res => {
                        saving.value = false
                        proxy.$message.success('操作成功')
                    }).catch(err => {
                        loading.value = false
                        proxy.$message.error(err.message)
                    })
                } else {
                    saving.value = false
                    return false
                }
            })
        }

        const getData = () => {
            loading.value = true
            request({
                method: 'GET',
                url: `/admin-server/sys/config/aboutInfo`
            }).then(res => {
                loading.value = false

                if (res.data && res.data.paramValue) {
                    dataForm.content = res.data.paramValue
                }

            }).catch(err => {
                loading.value = false
                proxy.$message.error(err.message)
            })
        }

        onMounted(() => {
            getData()
        })

        return {
            dataFormRef,
            saving,
            loading,
            data,
            dataForm,
            dataRule,
            submitForm,
            getData,
            onReady
        }
    }
})
</script>
