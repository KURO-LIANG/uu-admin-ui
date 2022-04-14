import {createRouter, createWebHashHistory} from 'vue-router'
import request from "../utils/request"
import storage from "../utils/storage"
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import Home from '../views/modules/common/Home.vue'
import NotFound from '../views/NotFound.vue'
import {ElMessage} from 'element-plus'

let isDynamicMenu = false

const router = createRouter({
    history: createWebHashHistory(),
    options: {
        isDynamicMenu: false
    },
    scrollBehavior: () => ({y: 0}),
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: Home
                }

            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/404',
            name: '404',
            component: NotFound
        }
    ],

})

router.beforeEach(async (to, form, next) => {
    const token = storage.getItem('token')
    if (!isDynamicMenu && token && to.path !== '/login') {
        try {
            const res = await request({
                method: 'GET',
                // url: '/uu-admin/sys/menu/nav'
                url: '/admin-server/sys/menu/nav'
            })

            const menu = res.data.menuList;
            const permissions = res.data.permissions;

            storage.setObject('permissions', permissions)
            storage.setObject('menu', menu)

            dynamicMenu(menu)
            isDynamicMenu = true
            next(to)
        } catch (e) {
            ElMessage.error({
                message: e.message
            })
        }
    } else {
        next()
    }

})

function dynamicMenu(menu) {
    const modules = import.meta.glob('../views/modules/**/**.vue')
    const loop = function (items) {
        items.forEach(item => {
            if (item.list && item.list.length) {
                loop(item.list)
            } else if (item.url) {
                let arr = item.url.split('/')
                let name = arr.pop()
                let path = arr.join('/')
                name = name.replace(/-(\w)/g, function (all, letter) {
                    return letter.toUpperCase()
                })
                name = name.charAt(0).toUpperCase() + name.slice(1)
                router.addRoute('main', {
                    path: `/${item.url}`,
                    name: `${name}Index`,
                    meta: {title: item.name, parentName: item.parentName},
                    component: modules[`../views/modules/${path}/${name}Index.vue`]
                })
                router.addRoute('main', {
                    path: `/${item.url}-update`,
                    name: `${name}Update`,
                    meta: {title: item.name},
                    component: modules[`../views/modules/${path}/${name}Update.vue`]
                })
            }
        })
    }

    loop(menu)
}

export default router
