<template>
    <div class="page-right" v-loading="loading">
        <page-header :title="pageTitle" back/>
        <div class="page-body">
            <el-form
                    ref="dataFormRef"
                    :model="dataForm"
                    :rules="dataRule"
                    size="small"
                    label-width="6em"
            >
                <el-form-item label="更新版本" prop="updateVersion">
                    <el-input v-model="dataForm.updateVersion"
                              placeholder="更新版本"></el-input>
                </el-form-item>
                <el-form-item label="更新内容">
                    <div style="line-height: 1.5">
                        <ckeditor :editor="data.editor" v-model="dataForm.content"
                                  :config="data.editorConfig" @ready="onReady"></ckeditor>
                    </div>

                </el-form-item>

                <el-form-item>
                    <el-button
                            :loading="saving"
                            type="primary"
                            @click="submitForm"
                    >保存
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import {ref, reactive, onMounted, getCurrentInstance,defineComponent} from 'vue'
    import {useRoute, useRouter} from 'vue-router'
    import request from "../../../utils/request";
    import PageHeader from "../../../components/PageHeader.vue"
    import CKEditor from "@ckeditor/ckeditor5-vue";
    import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
    import UploadAdapter from "../../../utils/UploadAdapter";

export default defineComponent({
    components: {
        ckeditor: CKEditor.component,
        PageHeader
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const {proxy} = getCurrentInstance()

        let saving = ref(false)
        let loading = ref(false)
        let pageTitle = ref('')
        let dataFormRef = ref(null)

        const data = reactive({
            editor: ClassicEditor,
            editorData: '',
            editorConfig: {
                // toolbar: {
                //     items: [
                //         'undo', 'redo', 'bold', 'italic', 'underline', 'numberedList', 'bulletedList', 'Link',
                //         '|', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells','fontSize','fontColor'
                //     ]
                // }
            },
        })
        let dataForm = reactive({
            id: 0,
            updateVersion: '',
            content: '',
            createTime: '',
            sysUserId: '',
            sysUserName: ''
        })

        let dataRule = reactive({
            updateVersion: [
                {required: true, message: '更新版本不能为空', trigger: 'blur'}
            ],
            content: [
                {required: true, message: '更新内容不能为空', trigger: 'blur'}
            ],
            createTime: [
                {required: true, message: '更新时间不能为空', trigger: 'blur'}
            ],
            sysUserId: [
                {required: true, message: '更新用户ID不能为空', trigger: 'blur'}
            ],
            sysUserName: [
                {required: true, message: '更新用户不能为空', trigger: 'blur'}
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
                        method: `${!dataForm.id ? 'POST' : 'PUT'}`,
                        url: `/admin-server/sys/updatelog/${!dataForm.id ? 'save' : 'update'}`,
                        data: dataForm
                    }).then(res => {
                        saving.value = false
                        proxy.$message.success('操作成功')
                        router.back()
                    }).catch(err => {
                        saving.value = false
                        proxy.$message.error(err.message)
                    })
                } else {
                    saving.value = false
                    return false
                }
            })
        }

        const getData = id => {
            loading.value = true
            request({
                method: 'GET',
                url: `/admin-server/sys/updatelog/info/${id}`
            }).then(res => {
                loading.value = false
                dataForm.id = res.data.id
                dataForm.updateVersion = res.data.updateVersion
                dataForm.content = res.data.content
                dataForm.createTime = res.data.createTime
                dataForm.sysUserId = res.data.sysUserId
                dataForm.sysUserName = res.data.sysUserName
            }).catch(err => {
                loading.value = false
                proxy.$message.error(err.message)
            })
        }

        onMounted(() => {
            if (route.query.id) {
                pageTitle.value = '修改'
                getData(route.query.id)
            } else {
                pageTitle.value = '新增'
            }
        })

        return {
            dataFormRef,
            saving,
            loading,
            data,
            dataForm,
            dataRule,
            pageTitle,
            submitForm,
            getData,
            onReady
        }
    }
})

</script>

<style scoped>

</style>
