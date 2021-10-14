<template>
    <div class="page-right" v-loading="loading">
        <page-header :title="pageTitle" back/>
        <div class="page-body">
            <el-form
                :model="dataForm"
                :rules="dataRule"
                ref="dataRuleRef"
                size="small"
                label-width="6em"
            >
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="dataForm.type">
                        <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
                    <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
                </el-form-item>
                <el-form-item label="上级菜单" prop="parentName">
                    <el-popover
                        popper-class="popover-select"
                        width="400px"
                        v-model:visible="data.showDept"
                        placement="bottom-start"
                        trigger="click">
                        <el-tree
                            :data="data.menuList"
                            :props="data.menuListTreeProps"
                            node-key="menuId"
                            ref="menuListTree"
                            @current-change="menuListTreeCurrentChangeHandle"
                            :default-expand-all="false"
                            :highlight-current="true"
                            :expand-on-click-node="false">
                        </el-tree>
                        <template #reference>
                            <el-button>{{ dataForm.parentName ? dataForm.parentName : '点击选择上级菜单' }}</el-button>
                        </template>
                    </el-popover>
                </el-form-item>
                <el-form-item v-if="dataForm.type !== 2" label="菜单路由" prop="url">
                    <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
                </el-form-item>
                <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
                    <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
                </el-form-item>
                <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
                    <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0"
                                     label="排序号"></el-input-number>
                </el-form-item>
                <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
                    <el-popover
                        placement="top-start"
                        trigger="click"
                        popper-class="mod-menu__icon-popover" width="458px">
                        <div class="mod-menu__icon-inner">
                            <div class="mod-menu__icon-list">
                                <div
                                    v-for="(item, index) in iconList"
                                    :key="index"
                                    @click="iconActiveHandle(item)"
                                    :class="{'mod-menu__icon-item':true, 'is-active': item === dataForm.icon }">
                                    <svg-icon :icon-class="item"></svg-icon>
                                </div>
                            </div>
                        </div>
                        <template #reference>
                            <el-button>
                                <svg-icon v-if="dataForm.icon" :icon-class="dataForm.icon"></svg-icon>
                                <span v-else>点击选择菜单图标</span>
                            </el-button>
                        </template>
                    </el-popover>
                    <el-tooltip class="item gap-ml" effect="light" :content="data.tips" placement="right">
                        <i class="el-icon-warning text-warning"></i>
                    </el-tooltip>
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
// import Icon from '../../../icons/index.js' // icon

const route = useRoute()
const router = useRouter()
const {proxy} = getCurrentInstance()
let dataRuleRef = ref(null)
let menuListTree = ref(null)
let saving = ref(false)
let loading = ref(false)
let pageTitle = ref('')
let iconList = ref([])

const modules = import.meta.glob('../../../assets/icons/svg/**.svg')
const keys = Object.keys(modules)
iconList.value = keys.map(item => (item.replace('../../../assets/icons/svg/icon-', '')).replace('.svg', ''))

const data = reactive({
    menuList: [],
    menuListTreeProps: {
        label: 'name',
        children: 'children'
    },
    showDept: false, // 部门弹出层是否显示
    tips: '全站推荐使用SVG Sprite'
})
let dataForm = reactive({
    menuId: 0,
    type: 1,
    typeList: ['目录', '菜单', '按钮'],
    name: '',
    parentId: 0,
    parentName: '一级菜单',
    url: '',
    perms: '',
    orderNum: 0,
    icon: ''
})

let validateUrl = (rule, value, callback) => {
    if (dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
    } else {
        callback()
    }
}
let dataRule = reactive({
    name: [
        {required: true, message: '菜单名称不能为空', trigger: 'blur'}
    ],
    parentName: [
        {required: true, message: '上级菜单不能为空', trigger: 'change'}
    ],
    url: [
        {validator: validateUrl, trigger: 'blur'}
    ]
})

const submitForm = () => {
    saving.value = true
    dataRuleRef.value.validate(valid => {
        if (valid) {
            request({
                method: `${!dataForm.menuId ? 'POST' : 'PUT'}`,
                url: `/admin-server/sys/menu/${!dataForm.menuId ? 'save' : 'update'}`,
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

// 菜单树选中
const menuListTreeCurrentChangeHandle = (item) => {
    dataForm.parentId = item.menuId
    dataForm.parentName = item.name
    data.showDept = false;
}
// 菜单树设置当前选中节点
const menuListTreeSetCurrentNode = (data) => {
    menuListTree.value.setCurrentKey(dataForm.parentId)
    dataForm.parentName = (menuListTree.value.getCurrentNode() || {})['name']
}
// 图标选中
const iconActiveHandle = (iconName) => {
    dataForm.icon = iconName
}
// 获取数据
const getData = async (id) => {
    loading.value = true

    const res = await request({
        method: 'GET',
        url: '/admin-server/sys/menu/select'
    })
    data.menuList = treeDataTranslate(res.data, 'menuId')

    if (id) {
        const resInfo = await request({
            method: 'GET',
            url: `/admin-server/sys/menu/info/${id}`
        })

        dataForm.menuId = resInfo.data.menuId
        dataForm.type = resInfo.data.type
        dataForm.name = resInfo.data.name
        dataForm.parentId = resInfo.data.parentId
        dataForm.url = resInfo.data.url
        dataForm.perms = resInfo.data.perms
        dataForm.orderNum = resInfo.data.orderNum
        dataForm.icon = resInfo.data.icon
    }

    loading.value = false
    menuListTreeSetCurrentNode()
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

<style lang="scss">

.mod-menu {
    &__icon-inner {
        max-height: 258px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    &__icon-list {
        display: flex;
        flex-wrap: wrap;
    }

    &__icon-item {
        flex: 0 0 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #eee;
        border-radius: 3px;
        margin-left: 10px;
        margin-bottom: 10px;
        cursor: pointer;

        &:hover {
            background-color: #f2f2f2;
        }
    }

    .icon-list__tips {
        font-size: 18px;
        text-align: center;
        color: #e6a23c;
        cursor: pointer;
    }
}

.icon-item {

}
</style>
