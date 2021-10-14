import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './index.css'
import router from './router'
import store from './store'
import request from "./utils/request"
import storage from "./utils/storage"
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import SvgIcon from './components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

const app = createApp(App)
app.config.globalProperties.$axios = request
app.config.globalProperties.isAuth = function (key) {
    return true
    // return storage.getObject('permissions', []).indexOf(key) > -1
}

app.component('svg-icon', SvgIcon)

// 进度条简单配置
NProgress.inc(0.2)
NProgress.configure({easing: 'ease', speed: 500, showSpinner: false})

router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done()
})

/**
 * 跳转到添加修改页面
 * @param query
 */
app.config.globalProperties.toUpdate = function (query) {
    router.push({
        path: router.currentRoute.value.path + '-update',
        query
    })
}

/**
 * 转为货币
 * @param value
 * @param type 0-保留两位小数；1-向上取整；2-向下取整；3-四舍五入取整；4-向下保留两位小数
 * @returns {number}
 */
app.config.globalProperties.parseMoney = function (value, type = 0, fixed = 2) {
    if (undefined === value || null === value) {
        return 0
    }
    let _value = Number(value)
    if (isNaN(_value)) {
        return 0
    }
    switch (type) {
        case 0:
            _value = Number(_value.toFixed(fixed))
            break;
        case 1:
            _value = Math.ceil(_value)
            break;
        case 2:
            _value = Math.floor(_value)
            break;
        case 3:
            _value = Math.round(_value)
            break;
        case 4:
            _value = Math.floor(_value * 100) / 100
            _value = Number(_value.toFixed(fixed))
            break;
    }
    return _value
}
/**
 * 货币格式化
 * @param value
 * @returns {string}
 */
app.config.globalProperties.formatMoney = function (value) {
    if (undefined === value || null === value) {
        return '0.00'
    }
    let _value = Number(value)
    if (isNaN(_value)) {
        return '0.00'
    }
    return _value.toFixed(2)
}
/**
 * 等待执行
 * @param time
 * @returns {Promise<unknown>}
 */
app.config.globalProperties.waiting = function (time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

router.beforeResolve((to, from, next) => {
    if ('login' !== to.name) {
        let token = storage.getItem('token', '')
        if (!token) {
            store.commit('logout')
            next({name: 'login'})
        }
    }
    next()
})

app.use(router)
app.use(store)
app.use(ElementPlus, {locale})

app.mount('#app')
