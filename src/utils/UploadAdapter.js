import axios from "axios";
import storage from "./storage";

export default class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    async upload() {
        const data = new FormData();
        data.append("file", await this.loader.file);

        const token = storage.getItem('token', '')

        const res = await axios({
            url: `${import.meta.env.VITE_API_URL}/admin-server/sys/oss/upload?token=${token}`,
            method: "POST",
            data,
            withCredentials: false,
        });

        // 后台返回数据：
        // {"code":0,"msg":"success","data":"/upload/struts2.jpeg"}

        // 方法返回数据格式： {default: "url"}
        return {
            default: res.data.data,
        };
    }
}
