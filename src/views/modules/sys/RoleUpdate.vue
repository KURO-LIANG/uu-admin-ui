<template>
    <div class="page-right" v-loading="loading">
        <page-header :title="pageTitle" back/>
        <div class="page-body">
            <el-form
                ref="domDataForm"
                :model="dataForm"
                :rules="dataRule"
                size="small"
                label-width="6em">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptName">
                    <el-popover
                        popper-class="popover-select"
                        ref="deptSelectListPopover"
                        width="400px"
                        placement="bottom-start"
                        v-model:visible="data.showDept"
                        trigger="click">
                        <el-tree
                            :data="data.deptSelectList"
                            :props="data.deptSelectListTreeProps"
                            node-key="deptId"
                            ref="deptSelectListTree"
                            @current-change="deptSelectListTreeCurrentChangeHandle"
                            :default-expand-all="true"
                            :highlight-current="true"
                            :expand-on-click-node="false">
                        </el-tree>
                        <template #reference>
                            <el-button>{{dataForm.deptName ? dataForm.deptName : '点击选择上级部门'}}</el-button>
                        </template>
                    </el-popover>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="10">
                        <el-form-item size="mini" label="功能授权">
                            <el-tree
                                :data="data.menuList"
                                :props="data.menuListTreeProps"
                                node-key="menuId"
                                ref="menuListTree"
                                :default-expand-all="false"
                                show-checkbox>
                            </el-tree>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item size="mini" label="数据授权">
                            <el-tree
                                :data="data.deptList"
                                :props="data.deptListTreeProps"
                                node-key="deptId"
                                ref="deptListTree"
                                :default-expand-all="false"
                                show-checkbox>
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
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

<script setup>
import {ref, reactive, onMounted, getCurrentInstance} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import request from "../../../utils/request";
import PageHeader from "../../../components/PageHeader.vue"
import {treeDataTranslate} from "../../../utils";

const route = useRoute()
const router = useRouter()
const {proxy} = getCurrentInstance()

let domDataForm = ref(null)
let menuListTree = ref(null)
let deptListTree = ref(null)
let deptSelectListPopover = ref(null)
let deptSelectListTree = ref(null)
let saving = ref(false)
let loading = ref(false)
let pageTitle = ref('')

let data = reactive({
    deptList: [],
    deptListTreeProps: {
        label: 'name',
        children: 'children'
    },
    deptSelectList: [],
    deptSelectListTreeProps: {
        label: 'name',
        children: 'children'
    },
    menuList: [],
    menuListTreeProps: {
        label: 'name',
        children: 'children'
    },
    tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    showDept: false // 部门弹出层是否显示
})

let dataForm = reactive({
    roleId: 0,
    roleName: '',
    deptId: 0,
    deptName: '',
    remark: '',
    menuIdList:[],
    deptIdList:[]
})

let dataRule = reactive({
    roleName: [
        {required: true, message: '角色名称不能为空', trigger: 'blur'}
    ]
})

// 菜单树选中
const deptSelectListTreeCurrentChangeHandle = (item, node) => {
    dataForm.deptId = item.deptId
    dataForm.deptName = item.name
    data.showDept = false;
}
// 菜单树设置当前选中节点
const deptSelectListTreeSetCurrentNode = () => {
    deptSelectListTree.value.setCurrentKey(dataForm.deptId)
    dataForm.deptName = (deptSelectListTree.value.getCurrentNode() || {})['name']
}

const submitForm = () => {
    saving.value = true
    domDataForm.value.validate(valid => {
        if (valid) {
            dataForm.deptIdList = [].concat(deptListTree.value.getCheckedKeys(), [data.tempKey], deptListTree.value.getHalfCheckedKeys())
            dataForm.menuIdList = [].concat(menuListTree.value.getCheckedKeys(), [data.tempKey], menuListTree.value.getHalfCheckedKeys())

            request({
                method: `${!dataForm.roleId ? 'POST' : 'PUT'}`,
                url: `/admin-server/sys/role/${!dataForm.roleId ? 'save' : 'update'}`,
                data: dataForm
            }).then(() => {
                proxy.$message.success('操作成功')
                proxy.$router.back()
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

const getData = async (id) => {
    loading.value = true

    const res = await request({
        method: 'GET',
        url: '/admin-server/sys/dept/select'
    })
    data.deptSelectList = treeDataTranslate(res.data, 'deptId')

    const resDept = await request({
        method: 'GET',
        url: '/admin-server/sys/dept/list'
    })
    data.deptList = treeDataTranslate(resDept.data, 'deptId')

    const resMenu = await request({
        method: 'GET',
        url: '/admin-server/sys/menu/list'
    })
    data.menuList = treeDataTranslate(resMenu.data, 'menuId')

    deptListTree.value.setCheckedKeys([])
    menuListTree.value.setCheckedKeys([])

    if (id) {
        const resInfo = await request({
            method: 'GET',
            url: `/admin-server/sys/role/info/${id}`
        })

        dataForm.roleId = resInfo.data.roleId
        dataForm.roleName = resInfo.data.roleName
        dataForm.remark = resInfo.data.remark
        dataForm.deptId = resInfo.data.deptId
        let menuIdx = resInfo.data.menuIdList.indexOf(data.tempKey)
        if (menuIdx !== -1) {
            resInfo.data.menuIdList.splice(menuIdx, resInfo.data.menuIdList.length - menuIdx)
        }
        menuListTree.value.setCheckedKeys(resInfo.data.menuIdList)
        let deptIdx = resInfo.data.deptIdList.indexOf(data.tempKey)
        if (deptIdx !== -1) {
            resInfo.data.deptIdList.splice(deptIdx, resInfo.data.deptIdList.length - deptIdx)
        }
        deptListTree.value.setCheckedKeys(resInfo.data.deptIdList)
    }

    loading.value = false
    deptSelectListTreeSetCurrentNode()
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
