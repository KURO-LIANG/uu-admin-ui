<template>

    <div class="devices" v-for="device of room.devices" @click="lookLog(device)">
        <el-tooltip class="item" effect="light"
                    :content="device.type + ' ' + device.model"
                    placement="bottom-end">
            <div>
                <div class="top">
                    <div class="devices_left">
                        <div class="devices_pic">
                            <i class="el-icon-picture-outline" v-if="!device.image || device.image === ''"></i>
                            <img v-else :src="device.image"/>
                        </div>
                        <div class="text-left gap-mt-lg device_name">
                            <p class="device_title">{{ device.alias }}</p>
                        </div>
                    </div>
                    <div class="devices_right">
                        <div class="device_btn">
                            <i v-if="device.type === '空调'"
                               @click="controlDevice(device,family)"
                               :class="['el-icon-switch-button', device.value.split(',')[0] === '开' ? 'power-on' : 'power-off','pointer']"></i>
                            <i v-else-if="device.type === '人体感应'"
                               :class="['el-icon-user-solid', device.value === '2' ? 'power-on' : 'power-off']"></i>
                            <i v-else-if="device.type === '温湿度传感器'"
                               :class="['el-icon-sunny', device.value.length>0 ? 'power-on' : 'power-off']"></i>
                            <i v-else-if="device.type === '门磁'"
                               :class="[device.value === '2' ? 'power-on el-icon-unlock' : 'power-off el-icon-lock']"></i>
                            <el-dropdown v-else-if="device.type === '窗帘'" size="small">
                              <span class="el-dropdown-link">
                                <i class="el-icon-s-operation"></i>
                              </span>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="controlDevice(device,family,'1')">打开</el-dropdown-item>
                                        <el-dropdown-item @click="controlDevice(device,family,'0')">关闭</el-dropdown-item>
                                        <el-dropdown-item @click="controlDevice(device,family,'-1')">停止</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                            <i v-else-if="device.type !== '红外转发器' && device.type !== '网关'"
                               @click="controlDevice(device,family)"
                               :class="['el-icon-switch-button', device.value === '1' ? 'power-on' : 'power-off', 'pointer']"></i>

                        </div>


                        <div v-if="device.type === '空调'" :class="[device.value.split(',')[0] === '开' ? 'power-on' : 'power-off','device-status','pointer']">
                            <p v-for="item in showAirConditionState(device.value).split(',')">{{item}}<br></p>
                        </div>
                        <p v-else-if="device.type === '人体感应'" :class="[device.value === '2' ? 'power-on' : 'power-off','device-status']">
                            {{device.value === '2' ? '有人' : '无人'}}
                        </p>
                        <p v-else-if="device.type === '温湿度传感器'" :class="[device.value.length>0 ? 'power-on' : 'power-off','device-status']">
                            温度：{{device.value.length>0 ? (device.value.split(',')[0] + '℃') : '-'}}
                            <br>湿度：{{device.value.length>0 ? (device.value.split(',')[1] + '%') : '-'}}
                        </p>
                        <p v-else-if="device.type === '门磁'" :class="[device.value === '2' ? 'power-on' : 'power-off','device-status']">
                            {{device.value === '2' ? '门已开' : '门已关'}}
                        </p>
                        <p v-else-if="device.type === '窗帘'" :class="[device.value !== '-1' ? 'power-on' : 'power-off','device-status']">
                            {{device.value === '1' ? '开启' : (device.value === '0' ? '关闭' : '停止')}}
                        </p>
                        <p v-else-if="device.type !== '红外转发器' && device.type !== '网关'"
                           :class="[device.value === '1' ? 'power-on' : 'power-off','device-status']">
                            {{device.value === '1' ? '开启' : '关闭'}}
                        </p>
                    </div>
                </div>
                <div class="foot">
                    <div :class="[device.isOnline ? 'text-primary' : 'text-info','text-left','gap-mt-sm','onlineFlag','foot-left']">
                        ● {{device.isOnline ? '在线' : '离线'}}
                    </div>
                    <div class="foot-right">
                        <p class="house">{{room.position}}</p>
                    </div>
                </div>

                <div v-if="device.isOnline">
                    <div v-if="device.type === '空调' || device.type === '门磁' || device.type === '人体感应'"
                         :class="device.value === '2' ? 'breath-power-on' : 'breath'"></div>
                    <div v-else-if="device.type === '温湿度传感器'"
                         :class="device.value.length>0 ? 'breath-power-on' : 'breath'"></div>
                    <div v-else-if="device.type === '窗帘'"
                         :class="device.value !== '-1' ? 'breath-power-on' : 'breath'"></div>
                    <div v-else-if="device.type !== '红外转发器' && device.type !== '网关'"
                         :class="device.value === '1' ? 'breath-power-on' : 'breath'"></div>
                    <div v-else class="breath"></div>
                </div>
                <div v-else>
                    <div class="breath-offline"></div>
                </div>
            </div>
        </el-tooltip>
    </div>
</template>

<script setup>
import {reactive, defineProps, getCurrentInstance} from 'vue'
import request from "../../utils/request";
import smartData from "../../service/smartData";

const {proxy} = getCurrentInstance()
const ctx = proxy

const props = defineProps({
    room:{
        type:Object,
        default(){
            return {}
        }
    },
    family:{
        type:Object,
        default(){
            return {}
        }
    }
})

//展示空调状态 开,1,26,1,0,1  制冷模式,26摄氏度,风速为自动,手动控制风速,风向为1
const showAirConditionState = (value) => {
    let state = value.split(',')

    if(state[0] === '关') return "关闭"
    let model = smartData.airModel.find(item => {
        return item.value === state[1]
    })
    let res = model.label + ","
    res += state[2] + "℃,"
    let windSpeed = smartData.windSpeed.find(item => {
        return item.value === state[3]
    })
    res += windSpeed.label + ","

    let windDirection = smartData.windDirection.find(item => {
        return item.value === state[4]
    })

    if(windDirection.value === '0'){
        res += '风向：'
        //风向手动
        let manualWindDirection = smartData.manualWindDirection.find(item => {
            return item.value === state[5]
        })
        res += manualWindDirection.label
    }else{
        res += '风向：' + windDirection.label
    }


    return res
}
//控制设备
const controlDevice = (device,family,targetValue) => {
    let url;
    let value;

    if(device.type === '空调'){
        url = '/admin-server/devices/control/aircondition';
        value = device.value === '2' ? '1' : '2';
    }else if(device.type === '窗帘'){
        url = '/admin-server/devices/control/switch';
        value = targetValue;
    }else{
        url = '/admin-server/devices/control/switch';
        value = device.value === '1' ? '0' : '1';
    }

    let dataForm = {
        deviceId: device.id,
        gatewayId: device.gatewayId,
        value: value,
        groupId: family.groupId,
        deviceAlias: device.alias
    }

    let originValue = device.value
    device.value = value

    request({
        method: 'POST',
        url: url,
        data: dataForm
    }).then(res => {
        ctx.$message.success('操作成功')

    }).catch(err => {
        device.value = originValue
        ctx.$message.error(err.message)
    })
}
// 查看设备状态日志列表
const lookLog =(device) => {

}
</script>

<style scoped>
    .devices{
        width: 12.1rem;
        /*height: 8rem;*/
        border: 1px solid #eee;
        margin: 10px;
        padding: 25px 14px 5px;
        border-radius: 12px;
        float: left;
        background: url("/img/device_bg.jpg") no-repeat;
        background-size: cover;
    }
    .devices_mask{
        height:100%;
        width:100%;
        background: rgba(0,0,0,.4);
    }
    .devices_pic{
        width: 60px;
        height: 60px;
        font-size: 25px;
        background-color: white;
        border-radius: 50%;
        padding: 5px;
    }
    .devices_pic img{
        width: 100%;
    }
    .devices_pic i{
        line-height: 50px;
        font-size: 30px;
    }
    .devices_left{
        float: left;
    }
    .devices_right{
        font-weight: bold;
        position: absolute;
        right: 10px;
        text-align: right;
    }
    .devices_left p{
        margin: 0;
    }
    .color-gray{
        color: #8a8a8a;
    }
    .house{
        background: #eaeaea;
        border-radius: 1px;
        margin: 1em 0 0;
        padding: 1px 6px;
        font-size: 12px;
        color: #3c3c3c;
    }
    .admin{
        color: red;
    }
    .device_title{
        font-size: 14px;
    }
    .onlineFlag{
        font-size: 12px;
    }
    .devices_right i{
        display: block;
        font-size: 22px;
        margin-bottom: 15px;
        transition: color .15s linear;
    }
    .power-off{
        color: #525252;
    }
    .power-on{
        color: #409eff;
    }
    .top{
        display: flow-root;
        position: relative;
    }
    .foot-left{
        float: left;
        line-height: 32px;
    }
    .foot-right{
        float: right;
    }
    .device-status{
        font-size: 12px;
        text-align: left;
    }
    .device-status p{
        margin-top: 2px!important;
        margin-bottom: 2px!important;
    }
    .pointer{
        cursor: pointer;
    }


    .breath {
        position:relative;
        width:100%;
        height:6px;
        margin:5px auto;
        line-height:40px;
        border:1px solid #2b92d4;
        border-radius:5px;
        color:#fff;
        font-size:20px;
        text-align:center;
        box-shadow:0 1px 2px rgba(0,0,0,.3);
        overflow:hidden;
        background-image:-webkit-gradient(linear,left top,left bottom,from(#6cc3fe),to(#21a1d0));
        -webkit-animation-timing-function:ease-in-out;
        -webkit-animation-name:breathe;
        -webkit-animation-duration:2000ms;
        -webkit-animation-iteration-count:infinite;
        -webkit-animation-direction:alternate;
    }
    .breath-power-on {
        position:relative;
        width:100%;
        height:6px;
        margin:5px auto;
        line-height:40px;
        border-radius:5px;
        color:#fff;
        font-size:20px;
        text-align:center;
        border: 1px solid rgb(136 208 255);
        box-shadow: 0 1px 30px #86bffb;
        overflow: hidden;
        background-image: -webkit-gradient(linear,left top,left bottom,from(#409eff),to(#409eff));
    }
    .breath-offline {
        position:relative;
        width:100%;
        height:6px;
        margin:5px auto;
        line-height:40px;
        border-radius:5px;
        color:#fff;
        font-size:20px;
        text-align:center;
        border: 1px solid rgb(255 136 136);
        box-shadow: 0 1px 30px #fb8686;
        overflow: hidden;
        background-image: -webkit-gradient(linear,left top,left bottom,from(#ff4040),to(#ff4040));
    }
    @-webkit-keyframes breathe {
        0% {
            opacity: 0;
            box-shadow: 0 1px 2px rgba(255, 255, 255, 0.1);
        }
        100% {
            opacity: 1;
            border: 1px solid rgba(59, 235, 235, 1);
            box-shadow: 0 1px 30px rgba(59, 255, 255, 1);
        }
    }

    .item:focus {
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
        outline:none !important;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .el-dropdown-link i{
        margin-bottom: 0 !important;
    }
    .extra-opt{
        /*display: none;*/
        width: 100px;

    }
</style>
