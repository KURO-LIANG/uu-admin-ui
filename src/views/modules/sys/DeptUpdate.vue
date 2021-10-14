<template>
    <div class="page-right" v-loading="loading">
        <page-header :title="pageTitle" back/>
        <div class="page-body">
            <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="dataFormRef"
                size="small"
                label-width="6em"
            >
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="部门名称"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" prop="parentName">
                    <el-popover
                        popper-class="popover-select"
                        ref="deptListPopover"
                        width="400px"
                        placement="bottom-start"
                        v-model:visible="data.showDept"
                        trigger="click">
                        <el-tree
                            :data="data.deptList"
                            :props="data.deptListTreeProps"
                            node-key="deptId"
                            ref="deptListTree"
                            @current-change="deptListTreeCurrentChangeHandle"
                            :default-expand-all="true"
                            :highlight-current="true"
                            :expand-on-click-node="false">
                        </el-tree>
                        <template #reference>
                            <el-button>{{dataForm.parentName ? dataForm.parentName : '点击选择上级部门'}}</el-button>
                        </template>
                    </el-popover>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input v-model="dataForm.orderNum" placeholder="排序"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="$router.back()">取消</el-button>
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

<script setup>
import {ref, reactive, onMounted, getCurrentInstance} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import request from "../../../utils/request";
import PageHeader from "../../../components/PageHeader.vue"
import {treeDataTranslate} from "../../../utils";

const route = useRoute()
const router = useRouter()
const {proxy} = getCurrentInstance()

let dataFormRef = ref(null)
let deptListTree  = ref(null)
let deptListPopover = ref(null)
let saving = ref(false)
let loading = ref(false)
let pageTitle = ref('')

let data = reactive({
    deptList: [],
    deptListTreeProps: {
        label: 'name',
        children: 'children'
    },
    showDept: false // 部门弹出层是否显示
})
let dataForm = reactive({
    deptId: 0,
    parentId: '',
    name: '',
    parentName: '',
    orderNum: ''
})

let dataRule = reactive({
    name: [
        {required: true, message: '部门名称不能为空', trigger: 'blur'}
    ],
    orderNum: [
        {required: true, message: '排序不能为空', trigger: 'blur'}
    ]
})

// 菜单树选中
const deptListTreeCurrentChangeHandle = (item) => {
    dataForm.parentId = item.deptId
    dataForm.parentName = item.name
    data.showDept = false;
}
// 菜单树设置当前选中节点
const deptListTreeSetCurrentNode = (data) => {
    deptListTree.value.setCurrentKey(dataForm.parentId)
    dataForm.parentName = (deptListTree.value.getCurrentNode() || {})['name']
}

const submitForm = () => {
    saving.value = true
    dataFormRef.value.validate(valid => {
        if (valid) {
            request({
                method: `${!dataForm.deptId ? 'POST' : 'PUT'}`,
                url: `/admin-server/sys/dept/${!dataForm.deptId ? 'save' : 'update'}`,
                data: dataForm
            }).then(() => {
                proxy.$message.success('操作成功')
                proxy.$router.back()
            }).catch(err => {
                saving.value = false
                this.$message.error(err.message)
            })
        } else {
            saving.value = false
            return false
        }
    })
}

const getData = async (id) => {
    loading.value = true

    const res = await request({
        method: 'GET',
        url: '/admin-server/sys/dept/select'
    })
    data.deptList = treeDataTranslate(res.data, 'deptId')

    if (id) {
        const resInfo = await request({
            method: 'GET',
            url: `/admin-server/sys/dept/info/${id}`
        })

        dataForm.parentId = resInfo.data.parentId
        dataForm.deptId = resInfo.data.deptId
        dataForm.name = resInfo.data.name
        dataForm.orderNum = resInfo.data.orderNum
    }
    loading.value = false
    deptListTreeSetCurrentNode()
}

onMounted(() => {
    if (route.query.id) {
        pageTitle.value = '修改'
    } else {
        pageTitle.value = '新增'
    }

    getData(route.query.id)
})
</script>

<style scoped>

</style>
