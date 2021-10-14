import {createStore} from 'vuex'
import storage from "../utils/storage"

function getUserInfo() {
    return storage.getObject('userInfo', null)
}

function getMenuIsCollapse() {
    return storage.getBoolean('MENU_IS_COLLAPSE', false)
}

export default createStore({
    state() {
        return {
            userInfo: getUserInfo(),
            menuIsCollapse: getMenuIsCollapse()
        }
    },
    mutations: {
        login(state, data) {
            state.userInfo = data
            storage.setObject('userInfo', data)
        },
        logout(state) {
            state.userInfo = null
            storage.removeItem('userInfo')
            storage.removeItem('token')
            storage.removeItem('expireTime')
            storage.removeItem('menuIndex')
        },
        updateMenuIsCollapse(state, data) {
            state.menuIsCollapse = data
            storage.setObject('MENU_IS_COLLAPSE', data)
        }
    }
})
