import axios from "axios"
import router from '../router'
import store from '../store'
import storage from './storage'

const instance = axios.create({
    withCredentials: false,
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

instance.interceptors.request.use(config => {
    const token = storage.getItem('token', '')
    if (token) {
        config.headers.token = token
    }
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) {
        store.commit('logout')
        router.push({name: 'login'})
    }
    return response.data
}, error => {
    if (error.response.status === 401) {
        store.commit('logout')
        router.push({name: 'login'})
    }else if (error.response.status === 503) {
        error.message = "服务正在维护中，请稍等片刻..."
    }
    return Promise.reject(error)
})

export default async function (options) {
    const defaults = {
        method: 'GET',
        url: '',
        params: null,
        data: null,
        codes: [0],
        cache: true,
        json: true
    }
    options = Object.assign({}, defaults, options)
    if (!options.cache && (options.method.toUpperCase() === 'GET' || options.method.toUpperCase() === 'DELETE')) {
        options.params = Object.assign({
            't': new Date().getTime()
        }, options.params)
    }
    if (!options.json) {
        options.data = JSON.stringify(options.data)
    }

    let result = null
    try {
        result = await instance(options)
    } catch (e) {
        throw new Error('连接服务器失败')

    }

    const index = options.codes.indexOf(result.code)
    if (index < 0) {
        throw new Error(result.msg)
    }

    return result
}
