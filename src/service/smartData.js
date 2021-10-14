export default {
    //状态
    status: [
        {label: '失败', value: 0},
        {label: '成功', value: 1}
    ],
    //日志类型
    logType:[
        {
            value: 10,
            label: '家庭日志',
            children:[
                {value: 10001, label: '添加家庭'},
                {value: 10002, label: '修改家庭'},
                {value: 10003, label: '删除家庭'},
            ]
        },{
            value: 11,
            label: '房间日志',
            children:[
                {value: 11001, label: '添加房间'},
                {value: 11002, label: '修改房间'},
                {value: 11003, label: '删除房间'},
            ]
        },{
            value: 12,
            label: '设备日志',
            children:[
                {value: 12001, label: '添加/修改设备'},
                {value: 12002, label: '控制设备'},
                {value: 12003, label: '解绑设备'},
            ]
        },{
            value: 13,
            label: '情景日志',
            children:[
                {value: 13001, label: '添加/修改情景模式'},
                {value: 13002, label: '控制情景模式'},
                {value: 13003, label: '删除情景模式'},
            ]
        },{
            value: 14,
            label: '成员日志',
            children:[
                {value: 14001, label: '添加成员'},
                {value: 14002, label: '修改成员'},
                {value: 14003, label: '删除成员'},
                {value: 14004, label: '退出家庭'},
            ]
        }
    ],

    //空调模式
    airModel:[
        {value:'1',label:'自动'},
        {value:'2',label:'制冷'},
        {value:'3',label:'除湿'},
        {value:'4',label:'送风'},
        {value:'5',label:'制热'},
    ],
    //空调风速
    windSpeed:[
        {value:'1',label:'自动'},
        {value:'2',label:'小档'},
        {value:'3',label:'中档'},
        {value:'4',label:'大档'},
    ],
    //空调风向
    windDirection:[
        {value:'0',label:'手动'},
        {value:'1',label:'自动'},
    ],
    //手动风向
    manualWindDirection:[
        {value:'1',label:'1档'},
        {value:'2',label:'2档'},
        {value:'3',label:'3档'},
    ]
}