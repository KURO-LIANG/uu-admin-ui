export default {
    getItem(key, defaultValue) {
        const _value = localStorage.getItem(key)
        if (undefined === _value || null === _value) {
            return defaultValue
        }
        return _value
    },
    setItem(key, value) {
        localStorage.setItem(key, value)
    },
    getNumber(key, defaultValue = 0) {
        const _value = localStorage.getItem(key)
        if (undefined === _value || null === _value) {
            return defaultValue
        }
        const temp = Number(_value)
        return isNaN(temp) ? defaultValue : temp
    },
    getObject(key, defaultValue = {}) {
        const _value = localStorage.getItem(key)

        if (undefined === _value || null === _value) {
            return defaultValue
        }
        try {
            return JSON.parse(_value)
        } catch (e) {
            return defaultValue
        }
    },
    getBoolean(key, defaultValue = false) {
        const _value = localStorage.getItem(key)

        if (undefined === _value || null === _value) {
            return defaultValue
        }
        try {
            return _value === 'true'
        } catch (e) {
            return defaultValue
        }
    },
    setObject(key, value) {
        try {
            const temp = JSON.stringify(value)
            localStorage.setItem(key, temp)
        } catch (e) {
            localStorage.removeItem(key)
        }
    },
    setBoolean(key, value) {
        try {
            const temp = value === true ? 'true' : 'false';
            localStorage.setItem(key, temp)
        } catch (e) {
            localStorage.removeItem(key)
        }
    },
    removeItem(key) {
        localStorage.removeItem(key)
    }
}
