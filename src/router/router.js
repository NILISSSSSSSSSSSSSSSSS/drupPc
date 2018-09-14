import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const forgetRouter = {
    path: '/forgetPass',
    name: 'forgetPass',
    meta: {
        title: '忘记密码'
    },
    component: resolve => { require(['@/views/forgetPass.vue'], resolve); }
};
export const resetRouter = {
    path: '/resetPass',
    name: 'resetPass',
    meta: {
        title: '重置密码'
    },
    component: resolve => { require(['@/views/resetPass.vue'], resolve); }
};
export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/detail',
    component: Main,
    children: [
        { path: 'detail', name: 'detail_index', component: resolve => { require(['@/views/detail/detail.vue'], resolve); } }
    ]
};
export const importRouter = {
        path: '/',
        name: 'importRouter',
        redirect: '/typeIn',
        component: Main,
        children: [
            { path: 'typeIn', name: 'typeIn_index', component: resolve => { require(['@/views/typeIn/typeIn.vue'], resolve); } }
        ]
    }
    // 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        path: '/firstPage',
        icon: 'ios-home',
        title: '首页',
        name: 'home_index',
        component: Main,
        children: [
            { path: 'home', name: 'home', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
        ]
    },
    {
        path: '/platformManage',
        icon: 'gear-a',
        name: 'platformManage',
        title: '平台管理',
        access: 1,
        component: Main,
        children: [{
                path: 'personAssign',
                icon: 'shuffle',
                name: 'personAssign',
                title: '吸毒人员分发',
                component: resolve => { require(['@/views/platformManage/personAssign/personAssign.vue'], resolve); }
            },
            {
                path: 'accountManage',
                icon: 'ios-locked',
                name: 'accountManage',
                title: '工作人员管理',
                component: resolve => { require(['@/views/platformManage/accountManage/accountManage.vue'], resolve); }
            }, {
                path: 'drugerAccountManage',
                icon: 'ios-locked',
                name: 'drugerAccountManage',
                title: '吸毒人员帐号管理',
                component: resolve => { require(['@/views/platformManage/drugerAccountManage/drugerAccountManage.vue'], resolve); }
            }
        ]
    },
    /*   {
          path: '/personManage',
          icon: 'ios-copy',
          name: 'personManage',
          // title: '吸毒人员管理',
          title: '社区戒毒(康复)人员电子档案',
          component: Main,
          children: [
              {
                  path: 'drugTreat',
                  icon: 'person-stalker',
                  name: 'drugTreat',
                  title: '社区戒毒人员',
                  component: resolve => { require(['@/views/personManage/drugTreat/drugTreat.vue'], resolve); }
              },
              {
                  path: 'drugRecovery',
                  icon: 'ios-pulse-strong',
                  name: 'drugRecovery',
                  title: '社区康复人员',
                  component: resolve => { require(['@/views/personManage/drugRecovery/drugRecovery.vue'], resolve); }
              }
          ]
      }, */
    {
        path: '/personManage',
        icon: 'person-stalker',
        name: 'personManage',
        title: '吸毒人员管理',
        component: Main,
        children: [{
                path: 'drugTreat',
                icon: 'clipboard',
                name: 'drugTreat',
                title: '电子档案',
                component: resolve => { require(['@/views/personManage/drugTreat/drugTreat.vue'], resolve); }
            },
            /* {
                path: 'dailyWork',
                icon: 'compose',
                name: 'dailyWork',
                title: '日常工作',
                component: resolve => { require(['@/views/personManage/dailyWork/dailyWork.vue'], resolve); }
            }, */
            {
                path: 'assignWorkers',
                icon: 'forward',
                name: 'assignWorkers',
                title: '指派工作人员',
                component: resolve => { require(['@/views/personManage/assignWorkers/assignWorkers.vue'], resolve); }
            },
            {
                path: 'backlog',
                icon: 'ios-clock-outline',
                name: "backlog",
                title: '待办事项',
                component: resolve => { require(['@/views/personManage/backlog/backlog.vue'], resolve); }
            },
            {
                path: 'mapTrack',
                icon: 'location',
                name: "mapTrack",
                title: '轨迹',
                component: resolve => { require(['@/views/personManage/mapTrack/mapTrack.vue'], resolve); }
            }, {
                path: 'personClaim',
                icon: 'person',
                name: "personClaim",
                title: '人员认领',
                access: 0,
                component: resolve => { require(['@/views/personManage/personClaim/personClaim.vue'], resolve); }
            }
            /* {
                path: 'drugRecovery',
                icon: 'ios-pulse-strong',
                name: 'drugRecovery',
                title: '社区康复人员',
                component: resolve => { require(['@/views/personManage/drugRecovery/drugRecovery.vue'], resolve); }
            } */
        ]
    },
    /* {
        path: '/drugerAccountManage',
        icon: 'ios-unlocked',
        name: 'drugerAccountManage',
        // title: '吸毒帐号管理',
        title: '社区戒毒(康复)人员帐号管理',
        component: Main,
        children: [{
            path: 'drugerAccountManage',
            icon: 'person-add',
            name: 'drugerAccountManage',
            component: resolve => { require(['@/views/drugerAccountManage/drugerAccountManage.vue'], resolve); }
        }]
    }, */
    {
        path: '/fallbackApprove',
        icon: 'compose',
        name: 'fallbackApprove',
        title: '业务审批',
        access: 1,
        component: Main,
        children: [{
                path: 'toOtherPlace',
                icon: 'paper-airplane',
                name: 'toOtherPlace',
                title: '变更执行地到外地人员',
                component: resolve => { require(['@/views/fallbackApprove/toOtherPlace/toOtherPlace.vue'], resolve); }
            },
            {
                path: 'toLocalPlace',
                icon: 'android-create',
                name: 'toLocalPlace',
                title: '变更执行地审批',
                component: resolve => { require(['@/views/fallbackApprove/toLocalPlace/toLocalPlace.vue'], resolve); }
            },
            {
                path: 'fallbackPeople',
                icon: 'android-clipboard',
                name: 'fallbackPeople',
                title: '回退审批',
                component: resolve => { require(['@/views/fallbackApprove/fallbackPeople/fallbackPeople.vue'], resolve); }
            },
            {
                path: 'approveLeave',
                icon: 'ios-calendar-outline',
                name: 'approveLeave',
                title: '请假审批',
                component: resolve => { require(['@/views/fallbackApprove/approveLeave/approveLeave.vue'], resolve); }
            }
        ]
    },
    {
        path: '/statistics',
        icon: 'stats-bars',
        name: 'statistics',
        access: 1,
        title: '统计查询',
        component: Main,
        children: [
            /* {
                        path: 'search',
                        name: 'search',
                        component: resolve => { require(['@/views/statistics/statistics.vue'], resolve); }
                    } */
            {
                path: 'statistics',
                icon: 'stats-bars',
                name: 'statistics',
                title: '统计',
                component: resolve => { require(['@/views/statistics/statistics/statistics.vue'], resolve); }
            },
            {
                path: 'query',
                icon: 'android-search',
                name: 'query',
                title: '查询',
                component: resolve => { require(['@/views/statistics/query/query.vue'], resolve); }
            }
        ]
    },
    {
        path: '/education',
        icon: 'ios-bell',
        name: 'education',
        title: '预防教育',
        component: Main,
        children: [{
                path: 'law',
                icon: 'document',
                name: 'law',
                title: '法律法规',
                component: resolve => { require(['@/views/education/law/law.vue'], resolve); }
            },
            {
                path: 'warningEducation',
                icon: 'university',
                name: 'warningEducation',
                title: '警示教育',
                component: resolve => { require(['@/views/education/warningEducation/warningEducation.vue'], resolve); }
            },
            {
                path: 'microVideo',
                icon: 'videocamera',
                name: 'microVideo',
                title: '微视频',
                component: resolve => { require(['@/views/education/microVideo/microVideo.vue'], resolve); }
            },
            {
                path: 'drugControl',
                icon: 'volume-medium',
                name: 'drugControl',
                title: '禁毒宣传',
                component: resolve => { require(['@/views/education/drugControl/drugControl.vue'], resolve); }
            }
        ]
    },
    {
        path: '/help',
        icon: 'heart',
        name: 'help',
        title: '救助帮扶',
        component: Main,
        children: [{
            path: 'save',
            name: 'save',
            component: resolve => { require(['@/views/help/help.vue'], resolve); }
        }]
    },
    {
        path: '/suggestion',
        icon: 'compose',
        name: 'suggestion',
        title: '意见反馈',
        component: Main,
        children: [{
            path: 'suggestion',
            name: 'suggestion',
            component: resolve => { require(['@/views/suggestion/suggestion.vue'], resolve); }
        }]
    },
    {
        path: '/download',
        icon: 'archive',
        name: 'download',
        title: '资料下载',
        component: Main,
        children: [{
            path: 'resource',
            name: 'resource',
            component: resolve => { require(['@/views/download/download.vue'], resolve); }
        }]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    forgetRouter,
    resetRouter,
    otherRouter,
    importRouter,
    ...appRouter,
    page500,
    page403,
    page404
];