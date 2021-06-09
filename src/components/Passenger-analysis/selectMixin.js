import iDatePicker from '@/components/common/idatepicker.vue'
import Moment from 'moment'
import { getBussinessTree, getBussinessCommon } from '@/api/passenger.js'
import _ from 'lodash'
export default {
    props: {
        type: {
            type: Array, // 对比类型
            default: () => [{
                    value: 'not',
                    label: '无对比'
                },
                {
                    value: 'entity',
                    label: '实体对比'
                },
                {
                    value: 'time',
                    label: '时间对比'
                }
            ]
        },
        types: {
            type: Array, // 对比类型
            default: () => [{
                    value: 'not',
                    label: '无对比'
                },
                {
                    value: 'time',
                    label: '时间对比'
                }
            ]
        }
    },
    components: {
        iDatePicker
    },

    data() {
        return {
            queryParams: {
                date1Array: [Moment().add(-1, 'd').format('YYYY-MM-DD'), Moment().add(-1, 'd').format('YYYY-MM-DD')],
                date2Array: [Moment().add(-1, 'd').format('YYYY-MM-DD'), Moment().add(-1, 'd').format('YYYY-MM-DD')],
                entitys: [],
                enterType: '0'
            },
            compareType: 'not',
            selectList: [],
            treeData: [],
            noData: '暂无数据'
        }
    },
    watch: {
        compareType() {
            this.selectList = []
                // 在此处判断是否含有全部实体
            this.selectList.push(this.defalutEntityId)
        },
        '$store.state.home.headerAction' () {
            this.bussinessTreeReq()
        }

    },
    computed: {},
    created() {
        this.checkTreeData()
    },
    mounted() {

    },
    methods: {
        checkTreeData() {
            this.bussinessTreeReq()
            this.selectList.push(this.defalutEntityId)
            this.handleClick()
        },
        bussinessTreeReq() {
            let admin = this.$store.state.user.role_id
            if (admin < 3) {
                getBussinessTree({ entity: 52 }).then(res => {
                    this.treeData = res.data.data
                })
            } else {
                getBussinessCommon({ entity: 52 }).then(res => {
                    this.treeData = res.data.data
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        dateSelect(date, shortname, dType) {
            if (dType === 1) this.queryParams.date1Array = date
            if (dType === 2) this.queryParams.date2Array = date
        },
        handleClick() {
            if (!this.queryParams.date1Array.length || !this.queryParams.date1Array[0]) {
                let alertText = this.compareType === 'time' ? '请选择比较时间1' : '请选择比较时间'
                alert(alertText)
                return
            }
            if (this.compareType === 'time' && !this.queryParams.date2Array.some(e => e !== '')) { // 2019-03-19更换选择器
                alert('请选择比较时间2')
                return
            }
            let copySelect = _.cloneDeep(this.selectList)
            if (!Array.isArray(copySelect)) {
                copySelect = Array.of(copySelect) // 单选的时候会通不过验证
            }
            if (this.$store.state.home.headerAction && !copySelect) {
                alert('请选择实体')
                return
            }
            let entitys = []
            copySelect.forEach(e => {
                let tml = _.find(this.treeList, (o) => o.value === e)
                if (tml != 0) entitys.push(tml)
            })
            this.queryParams.entitys = entitys
            this.queryParams.compareType = this.compareType
            this.$emit('on-change', this.queryParams)
        }
    }
}