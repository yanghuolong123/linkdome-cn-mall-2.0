/*=========================================================================================
1.meta除了原生参数外可配置的参数:
 meta: {
  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
  icon: (-) 该页面在左侧菜单图标，只支持featherIcon,
  notCache:(false) 设为true 页面不缓存
 }
2.路由 name 作为国际化的键值,与组件name 值保持一致,用来生成 keep-alive exclude 数组
==========================================================================================*/
import main from '@/layouts/main/Main.vue'

export default [
    { // 首页 dashboard
        path: '/',
        component: main,
        meta: {
            icon: 'HomeIcon'
        },
        name: 'Dashboard',
        redirect: '/dashboard/analytics',
        children: [{
            path: '/dashboard/analytics',
            name: 'dashboardAnalytics',
            component: () =>
                import ('@/views/DashboardAnalytics.vue')
        }],
    },

    { // 客流分析
        path: '/footfall',
        component: main,
        redirect: '/footfall/analytics',
        meta: {
            icon: 'UsersIcon',
            pageTitle: '客流分析'
        },
        name: 'Analytics',
        children: [{ // 实体客流分析
            path: 'analytics',
            name: 'Entity',
            component: () =>
                import ('@/views/footfall-analytics/Entity.vue'),
            meta: {
                breadcrumb: [
                    {title: 'DashBoard', url: '/'},
                    {title: '客流分析', url: '/footfall'},
                    {title: '实体客流分析', active: true},
                ],
                pageTitle: '实体客流分析'
            }
        },

            { // 年龄性别分析
                path: 'agegender',
                name: 'AgeGender',
                component: () =>
                    import ('@/views/footfall-analytics/AgeGender.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'DashBoard', url: '/dashboard'},
                        {title: '客流分析', url: '/footfall'},
                        {title: '年龄性别分析', active: true},
                    ],
                    pageTitle: '年龄性别分析'
                }
            },
            { // 排行占比分析
                path: 'ranking',
                name: 'Ranking',
                component: () =>
                    import ('@/views/footfall-analytics/Ranking.vue'),
                meta: {
                    breadcrumb: [
                        {title: '客流分析', url: '/'},
                        {title: '客流分析', url: '/footfall'},
                        {title: '排行占比分析', active: true},
                    ],
                    pageTitle: '排行占比分析'
                }
            },
            { // 进店率分析
                path: 'goShop',
                name: 'GoShop',
                component: () =>
                    import ('@/views/footfall-analytics/GoShop.vue'),
                meta: {
                    breadcrumb: [
                        {title: '客流分析', url: '/'},
                        {title: '客流分析', url: '/footfall'},
                        {title: '进店率分析', active: true},
                    ],
                    pageTitle: '进店率分析'
                }
            },
            { // 热力图分析
                path: 'heatMap',
                name: 'HeatMap',
                component: () =>
                    import ('@/views/footfall-analytics/heatMap.vue'),
                meta: {
                    breadcrumb: [
                        {title: '客流分析', url: '/'},
                        {title: '客流分析', url: '/footfall'},
                        {title: '热力图分析', active: true},
                    ],
                    pageTitle: '热力图分析'
                }
            },
            { // 有效客流分析
                path: 'effective',
                name: 'Effective',
                component: () =>
                    import ('@/views/footfall-analytics/Effective.vue'),
                meta: {
                    breadcrumb: [
                        {title: '客流分析', url: '/'},
                        {title: '客流分析', url: '/footfall'},
                        {title: '有效客流分析', active: true},
                    ],
                    pageTitle: '有效客流分析'
                }
            },
        ]
    },
    {
        path: '/generatrix',
        component: main,
        redirect: '/generatrix/analytics',
        meta: {
            icon: 'GitMergeIcon',
            pageTitle: '顾客行为分析'
        },
        name: 'Generatrix',
        children: [{ // 关联分析
            path: 'relevance',
            name: 'Relevance',
            component: () =>
                import ('@/views/footfall-analytics/Relevance.vue'),
            meta: {
                breadcrumb: [
                    {title: 'DashBoard', url: '/dashboard'},
                    {title: '顾客行为分析'},
                    {title: '关联分析', active: true},
                ],
                pageTitle: '关联分析'
            }
        },
            { // 交叉客流分析
                path: 'cross',
                name: 'Cross',
                component: () =>
                    import ('@/views/footfall-analytics/Cross.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'DashBoard', url: '/dashboard'},
                        {title: '顾客行为分析'},
                        {title: '交叉客流分析', active: true},
                    ],
                    pageTitle: '交叉客流分析'
                }
            },
            // { // 路径动向分析(新)
            //     path: 'pathTrend',
            //     name: 'PathTrend',
            //     component: () =>
            //         import ('@/views/footfall-analytics/pathTrend.vue'),
            //     meta: {
            //         breadcrumb: [
            //             { title: '客流分析', url: '/' },
            //             { title: '客流分析', url: '/footfall' },
            //             { title: '路径动向分析(新)', active: true },
            //         ],
            //         pageTitle: '路径动向分析(新)'
            //     }
            // },
            { // 路径动向分析
                path: 'oldPath',
                name: 'OldPath',
                component: () =>
                    import ('@/views/footfall-analytics/pathTrendBackup.vue'),
                meta: {
                    breadcrumb: [
                        {title: '客流分析', url: '/'},
                        {title: '顾客行为分析'},
                        {title: '路径动向分析', active: true},
                    ],
                    pageTitle: '路径动向分析'
                }
            },
            { // 实体引流分析
                path: 'drainage',
                name: 'Drainage',
                component: () =>
                    import ('@/views/footfall-analytics/Drainage.vue'),
                meta: {
                    breadcrumb: [
                        {title: '客流分析', url: '/'},
                        {title: '顾客行为分析'},
                        {title: '实体引流分析', active: true},
                    ],
                    pageTitle: '实体引流分析'
                }
            },
            { // 停留时间分析
                path: 'dwelltime',
                name: 'DwellTime',
                component: () =>
                    import ('@/views/footfall-analytics/DwellTime.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'DashBoard', url: '/dashboard'},
                        {title: '顾客行为分析'},
                        {title: '停留时间分析', active: true},
                    ],
                    pageTitle: '停留时间分析'
                }
            },
        ]
    },

    { //运营分析
        path: '/operation',
        component: main,
        name: 'Operation',
        redirect: '/operation/goal',
        meta: {
            icon: 'TargetIcon'
        },
        children: [{ // 目标达成分析
            path: 'goal',
            name: 'Goal',
            component: () =>
                import ('@/views/operation/Goal.vue'),
            meta: {
                breadcrumb: [
                    {title: 'Analytics', url: '/dashboard/analytics'},
                    {title: '运营分析'},
                    {title: '目标达成分析', active: true},
                ],
                notCache: true,
                pageTitle: '目标达成分析'
            }
        },
            { // 节假日活动分析
                path: 'holidayAnalysis',
                name: 'HolidayAnalysis',
                component: () =>
                    import ('@/views/operation/Holiday.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '运营分析'},
                        {title: '节假日活动分析', active: true},
                    ],
                    pageTitle: '节假日活动分析'
                }
            },

            { // 销售分析
                path: 'sales',
                name: 'SalesAnalytics',
                component: () =>
                    import ('@/views/operation/Sales.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '运营分析'},
                        {title: '销售分析', active: true},
                    ],
                    pageTitle: '销售分析'
                }
            },

            { // 店铺画像
                path: 'shopPortrait',
                name: 'shopPortrait',
                component: () =>
                    import ('@/views/operation/ShopPortrait.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '运营分析'},
                        {title: '店铺画像', active: true},
                    ],
                    pageTitle: '店铺画像'
                }
            },
            { // 销售分析
                path: 'salesNew',
                name: '销售分析(新)',
                component: () =>
                    import ('@/views/operation/SalesNew.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '运营分析'},
                        {title: '销售分析', active: true},
                    ],
                    pageTitle: '销售分析'
                }
            }, { // 调铺分析
                path: 'changeStore',
                name: 'changeStore',
                component: () =>
                    import ('@/views/operation/ChangeStore.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '运营分析'},
                        {title: '调铺效果分析', active: true},
                    ],
                    pageTitle: '调铺效果分析'
                }
            },{ // 商品分析
                path: 'commodityAnalytics',
                name: 'CommodityAnalytics',
                component: () =>
                  import ('@/views/operation/CommodityAnalytics.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '运营分析'},
                        {title: '商品分析', active: true},
                    ],
                    pageTitle: '商品分析'
                }
            },
        ],

    },


    { //报告
        path: '/report',
        component:
        main,
        redirect:
            '/report/daily',
        meta:
            {
                icon: 'PrinterIcon'
            }
        ,
        name: 'Report',
        children:
            [{ // 日报
                path: 'daily',
                name: 'DailyReport',
                component: () =>
                    import ('@/views/report/Daily.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '报告详情'},
                        {title: '日报', active: true},
                    ],
                    pageTitle: '日报',
                }
            },
                { // 周报
                    path: 'weekly',
                    name: 'WeekReport',
                    component: () =>
                        import ('@/views/report/Weekly.vue'),
                    meta: {
                        breadcrumb: [
                            {title: 'Analytics', url: '/dashboard/analytics'},
                            {title: '报告详情'},
                            {title: '周报', active: true},
                        ],
                        pageTitle: '周报',
                    }
                },
                { // 月报
                    path: 'month',
                    name: 'MonthReport',
                    component: () =>
                        import ('@/views/report/Monthly.vue'),
                    meta: {
                        breadcrumb: [
                            {title: 'Analytics', url: '/dashboard/analytics'},
                            {title: '报告详情'},
                            {title: '月报', active: true},
                        ],
                        pageTitle: '月报',
                    }
                }
            ]
    },
   //后台管理
    {
        path: '/admin',
        component:
        main,
        redirect:
            '/admin/entity',
        name:
            'Admin',
        meta:
            {
                icon: 'SettingsIcon'
            }
        ,
        children: [{ //实体管理
            path: 'entiy',
            name: 'EntityManage',
            component: () =>
                import ('@/views/admin/Entity.vue'),
            meta: {
                breadcrumb: [
                    {title: 'Analytics', url: '/dashboard/analytics'},
                    {title: '后台管理'},
                    {title: '实体管理', active: true},
                ],
                pageTitle: '实体管理',
                // notCache:true,
                access: ['admin', 'common_admin']
            }
        },

            { // 节假日活动管理
                path: 'holiday',
                name: 'HolidayManage',
                component: () =>
                    import ('@/views/admin/Holiday.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '后台管理'},
                        {title: '节假日活动管理', active: true},
                    ],
                    pageTitle: '节假日活动管理'
                }
            },
            // { // VIP客户管理
            // 	path: 'vip',
            // 	name: 'VipCustom',
            // 	component: () => import('@/views/admin/Vip.vue'),
            // 	meta: {
            // 		breadcrumb: [
            // 			{ title: 'Analytics', url: '/dashboard/analytics' },
            // 			{ title: '后台管理'},
            // 			{ title: 'VIP客户管理', active: true },
            // 		],
            // 		pageTitle: 'VIP客户管理',
            // 		access: ['admin','common_admin']
            // 	}
            // },
            { // 账户管理
                path: 'account',
                name: 'Account',
                component: () =>
                    import ('@/views/admin/Account.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '后台管理'},
                        {title: '账户管理', active: true},
                    ],
                    pageTitle: '账户管理',
                    access: ['admin', 'common_admin']
                }
                // meta: {
                // 	access: ['admin']
                // }
            },
            { // 权限管理
                path: 'role',
                name: 'Role',
                component: () =>
                    import ('@/views/admin/Role.vue'),
                meta: {
                    breadcrumb: [
                        {title: 'Analytics', url: '/dashboard/analytics'},
                        {title: '后台管理'},
                        {title: '权限管理', active: true},
                    ],
                    pageTitle: '权限管理',
                    access: []
                }
            }
        ]
    },
    { //登录
        path: '/login',
        name:
            'pageLogin',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/Login.vue')
    },
    {
        path: '/pages/register',
        name:
            'pageRegister',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/Register.vue')
    },
    { // 忘记密码
        path: '/pages/forgot-password',
        name:
            'pageForgotPassword',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/ForgotPassword.vue')
    },
    { //重置密码
        path: '/resetPassword',
        name:
            'pageResetPassword',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/ResetPassword.vue')
    },
    {
        path: '/downloadDayPdf',
        name:
            'downloadDayPdf',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/report/downloadDay.vue')
    },
    {
        path: '/downloadWeekPdf',
        name:
            'downloadWeekPdf',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/report/downloadWeek.vue')
    },
    {
        path: '/downloadMonthPdf',
        name:
            'downloadMonthPdf',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/report/downloadMonth.vue')
    },
    {
        path: '/pages/error-404',
        name:
            'pageError404',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/Error404.vue')
    },
    {
        path: '/pages/error-500',
        name:
            'pageError500',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/Error500.vue')
    },
    {
        path: '*',
        name:
            'error_404',
        meta:
            {
                hideInMenu: true
            }
        ,
        component: () =>
            import ('@/views/pages/Error404.vue')
    }
]
