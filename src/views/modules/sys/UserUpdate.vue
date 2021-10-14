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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="dataForm.username" placeholder="登录帐号"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.userId }">
                    <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword" :class="{ 'is-required': !dataForm.userId }">
                    <el-input v-model="dataForm.confirmPassword" type="password" placeholder="确认密码"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptName">
                    <el-popover
                        popper-class="popover-select"
                        placement="bottom-start"
                        width="400px"
                        trigger="focus">
                        <template #reference>
                            <el-input
                                v-model="dataForm.deptName"
                                readonly
                                placeholder="点击选择所属部门"
                            >
                            </el-input>
                        </template>
                        <el-tree
                            ref="deptSelectListTree"
                            :data="data.deptSelectList"
                            :props="data.deptSelectListTreeProps"
                            node-key="deptId"
                            @node-click="deptSelectListTreeCurrentChangeHandle"
                            :default-expand-all="true"
                            :highlight-current="true"
                            :expand-on-click-node="false">
                        </el-tree>
                    </el-popover>

                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="角色" size="mini" prop="roleIdList">
                    <el-checkbox-group v-model="dataForm.roleIdList">
                        <el-checkbox v-for="role in data.roleList" :key="role.roleId" :label="role.roleId">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="状态" size="mini" prop="status">
                    <el-radio-group v-model="dataForm.status">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
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

<script setup>
import {ref, reactive, onMounted, getCurrentInstance} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import request from "../../../utils/request";
import PageHeader from "../../../components/PageHeader.vue"
import {treeDataTranslate} from "../../../utils";
import {isEmail, isMobile} from '../../../utils/validate'

const route = useRoute()
const router = useRouter()
const {ctx, proxy} = getCurrentInstance()

let domDataForm = ref(null)
let deptSelectListTree = ref(null)
let saving = ref(false)
let loading = ref(false)
let pageTitle = ref('')

const data = reactive({
    deptSelectList: [],
    deptSelectListTreeProps: {
        label: 'name',
        children: 'children'
    },
    roleList: []
})

let dataForm = reactive({
    userId: 0,
    username: '',
    password: '',
    confirmPassword: '',
    salt: '',
    email: '',
    mobile: '',
    roleIdList: [],
    status: 1,
    deptId: 0,
    deptName: ''
})

let validatePassword = (rule, value, callback) => {
    if (!dataForm.userId && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
    } else {
        callback()
    }
}
let validateConfirmPassword = (rule, value, callback) => {
    if (!dataForm.userId && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
    } else if (dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
    } else {
        callback()
    }
}
let validateEmail = (rule, value, callback) => {
    if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
    } else {
        callback()
    }
}
let validateMobile = (rule, value, callback) => {
    if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
    } else {
        callback()
    }
}

// 表单验证
let dataRule = reactive({
    username: [
        {required: true, message: '用户名不能为空', trigger: 'blur'}
    ],
    password: [
        {validator: validatePassword, trigger: 'blur'}
    ],
    confirmPassword: [
        {validator: validateConfirmPassword, trigger: 'blur'}
    ],
    email: [
        {required: true, message: '邮箱不能为空', trigger: 'blur'},
        {validator: validateEmail, trigger: 'blur'}
    ],
    mobile: [
        {required: true, message: '手机号不能为空', trigger: 'blur'},
        {validator: validateMobile, trigger: 'blur'}
    ]
})

// 查询部门列表
const getDeptList = async () => {
    const res = await request({
        method: 'GET',
        url: '/admin-server/sys/dept/list'
    })
    data.deptSelectList = treeDataTranslate(res.data, 'deptId')
}

// 查询角色列表
const getRoleList = async () => {
    const res = await request({
        method: 'GET',
        url: '/admin-server/sys/role/select'
    })
    data.roleList = res.data
}

// 菜单树选中
const deptSelectListTreeCurrentChangeHandle = (data) => {
    dataForm.deptId = data.deptId
    dataForm.deptName = data.name
}
// 菜单树设置当前选中节点
const deptSelectListTreeSetCurrentNode = () => {
    deptSelectListTree.value.setCurrentKey(dataForm.deptId)
    dataForm.deptName = (deptSelectListTree.value.getCurrentNode() || {})['name']
}
// 提交表单
const submitForm = () => {
    saving.value = true

    domDataForm.value.validate(valid => {
        if (valid) {
            request({
                method: `${!dataForm.userId ? 'POST' : 'PUT'}`,
                url: `/admin-server/sys/user/${!dataForm.userId ? 'save' : 'update'}`,
                data: dataForm
            }).then(res => {
                saving.value = false
                if (res.code !== 0) {
                    proxy.$message.error(res.msg)
                } else {
                    proxy.$message.success('操作成功')
                    proxy.$router.back()
                }
            })
        } else {
            saving.value = false
            return false
        }
    })
}
// 获取数据
const getData = async (id) => {
    const res = await request({
        method: 'GET',
        url: `/admin-server/sys/user/info/${id}`
    })

    dataForm.userId = res.data.userId
    dataForm.username = res.data.username
    dataForm.salt = res.data.salt
    dataForm.email = res.data.email
    dataForm.mobile = res.data.mobile
    dataForm.roleIdList = res.data.roleIdList
    dataForm.status = res.data.status
    dataForm.deptId = res.data.deptId
    deptSelectListTreeSetCurrentNode()
}

onMounted(() => {
    if (route.query.id) {
        pageTitle.value = '修改'
    } else {
        pageTitle.value = '新增'
    }

    loading.value = true
    Promise
        .all([getDeptList(), getRoleList()])
        .then(() => {
            if (route.query.id) {
                return getData(route.query.id)
            }
            return true
        }).then(() => {
            loading.value = false
        }).catch(err => {
            loading.value = false
            proxy.$message.error(err.message)
        })
})
</script>

<style scoped>

</style>
