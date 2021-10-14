<template>
    <div v-loading="loading">
        <div id="echartsMain" class="main"></div>
    </div>
</template>

<script setup>
import {ref, reactive, onMounted, getCurrentInstance} from 'vue'
import request from "../../../utils/request"
import * as echarts from 'echarts'
import ChinaGeo from '../../../utils/geo_json/geoJSON_china.json'

const {ctx, proxy} = getCurrentInstance()

const loading = ref(false)

const data = reactive({
    dataList: [],
    geoCoordMap: {},
    selectedItems: [],
    categoryData: [], //城市
    barData: [], //数量
    maxBar: 30,
    option: {},
    myChart: {}
})

//组合城市数据到地图数组中 {name: '上海', value: [121.4648, 31.2891, 21]}
const convertData = (dataParams) => {
    const res = [];
    for (let val of dataParams) {
        const geoCoord = data.geoCoordMap[val.city];
        if (geoCoord) {
            res.push({
                name: val.city,
                value: geoCoord.concat(val.value)
            });
        }
    }
    return res;
}

echarts.registerMap('china', ChinaGeo)

const drawLine = () => {
    let convertedData = [
        convertData(data.dataList),
        convertData(data.dataList.sort(function (a, b) {
            return b.value - a.value;
        }).slice(0, 6))
    ];
    data.dataList.sort(function (a, b) {
        return a.value - b.value;
    })

    let count = data.dataList.length
    let sum = 0
    for (let val of data.dataList) {
        data.categoryData.push(val.city);
        data.barData.push(val.value);
        sum += val.value;
    }

    data.option = {
        backgroundColor: '#404a59',
        animation: true,
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
        title: [
            {
                text: '全国业务分布',
                subtext: '数据来源于慢云智能科技',
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            }, {
                id: 'statistic',
                text: count ? '平均: ' + parseInt((sum / count).toFixed(4)) : '',
                right: 120,
                top: 40,
                width: 100,
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            }],
        toolbox: {
            iconStyle: {
                normal: {
                    borderColor: '#fff'
                },
                emphasis: {
                    borderColor: '#b1e4ff'
                }
            },
            feature: {
                dataZoom: {},
                brush: {
                    type: ['rect', 'polygon', 'clear']
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        brush: {
            outOfBrush: {
                color: '#abc'
            },
            brushStyle: {
                borderWidth: 2,
                color: 'rgba(0,0,0,0.2)',
                borderColor: 'rgba(0,0,0,0.5)',
            },
            seriesIndex: [0, 1],
            throttleType: 'debounce',
            throttleDelay: 300,
            geoIndex: 0
        },
        geo: {
            map: 'china',
            left: '10',
            right: '35%',
            center: [104.98561551896913, 37.105000490896193],
            zoom: 1.0,
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        tooltip: { //鼠标悬停
            trigger: 'item',
            formatter: function (params) {
                if (params.seriesIndex === 1) {//地图
                    return params.name + "：" + params.value[2];
                } else if (params.seriesIndex === 2) { // 右边柱状图
                    return params.name + "：" + params.value;
                }
            }
        },
        grid: {
            right: 40,
            top: 100,
            bottom: 40,
            width: '30%'
        },
        xAxis: {
            type: 'value',
            scale: true,
            position: 'top',
            boundaryGap: false,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: 2,
                textStyle: {
                    color: '#aaa'
                }
            },
        },
        yAxis: {
            type: 'category',
            //  name: 'TOP 20',
            nameGap: 16,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#ddd'
                }
            },
            data: data.categoryData
        },
        series: [
            {
                // name: 'pm2.5',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertedData[0], //经纬度数据
                symbolSize: function (val) {
                    return Math.max(val[2] / 8, 10);
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#FF8C00',
                        position: 'right',
                        show: true
                    }
                }
            }, {
                //  name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertedData[0],
                symbolSize: function (val) {
                    return Math.max(val[2] / 11, 10);
                },
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: { //直接显示的文本
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f4e925',
                        shadowBlur: 50,
                        shadowColor: '#EE0000'
                    }
                },
                zlevel: 1
            }, {
                id: 'bar',
                zlevel: 2,
                type: 'bar',
                symbol: 'none',
                itemStyle: {
                    normal: {
                        color: '#ddb926'
                    }
                },

                data: data.dataList
            }]
    }

    // 基于准备好的dom，初始化echarts实例
    data.myChart = echarts.init(document.getElementById('echartsMain'))
    // 绘制图表
    data.myChart.setOption(data.option);

}

const getData = () => {

    request({
        method: 'GET',
        url: `/admin-server/user/geoCount`,
    }).then(res => {
        loading.value = false
        data.dataList = res.data.dataList
        data.geoCoordMap = res.data.longAndLati

        drawLine()

    }).catch(err => {
        loading.value = false
        proxy.$message.error(err.message)
    })
}

onMounted(() => {
    getData()
    // drawEmpty()
})
</script>

<style scoped>
.main {
    height: 90%;
    position: absolute;
    text-align: center;
    width: 88%;
    padding: 10px;
}
</style>
