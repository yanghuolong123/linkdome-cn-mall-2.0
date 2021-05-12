// 编辑商场信息
<template>
<div class="modal is-active">
    <div class="modal-background" @click="ivuClose"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <a class="ivu-modal-close" @click="ivuClose"><i class="ivu-icon ivu-icon-ios-close"></i></a>
        </header>
        <section class="modal-card-body">
            <Form :model="formData" label-position="right" :label-width="85">
                <FormItem label="名称">
                    <Input type ="text" v-model="formData.name"></Input>
                </FormItem>
                <FormItem label="详细地址">
                    <Input type ="text" v-model="formData.address"></Input>
                </FormItem>
                <FormItem label="全年目标" class="sidefont" v-if="formData.flowType=='year'">
                    <Input type ="number" v-model="formData.goalFlow"></Input>
                    <span class="f-dib">人</span>
                </FormItem>
                <div class="allmonth" v-if="formData.flowType=='month'">
                    <FormItem label="一月" class="sidefont">
                        <Input type ="number" v-model="formData.Jan"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="二月" class="sidefont">
                        <Input type ="number" v-model="formData.Feb"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="三月" class="sidefont">
                        <Input type ="number" v-model="formData.Mar"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="四月" class="sidefont">
                        <Input type ="number" v-model="formData.Apr"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="五月" class="sidefont">
                        <Input type ="number" v-model="formData.May"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="六月" class="sidefont">
                        <Input type ="number" v-model="formData.Jun"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="七月" class="sidefont">
                        <Input type ="number" v-model="formData.Jul"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="八月" class="sidefont">
                        <Input type ="number" v-model="formData.Aug"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="九月" class="sidefont">
                        <Input type ="number" v-model="formData.Sep"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="十月" class="sidefont">
                        <Input type ="number" v-model="formData.Oct"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="十一月" class="sidefont">
                        <Input type ="number" v-model="formData.Nov"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                    <FormItem label="十二月" class="sidefont">
                        <Input type ="number" v-model="formData.Dec"></Input>
                        <span class="f-dib">人</span>
                    </FormItem>
                </div>
                <FormItem label="描述" :label-width="85">
                    <Input  type="textarea" :rows="4" v-model="formData.description"></Input>
                </FormItem>
            </Form>
        </section>
        <footer class="modal-card-foot">
            <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="ivuClose"><span>取消</span></button>
            <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="updateMall"><span>确定</span></button>
        </footer>
    </div>
</div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import {updateMallrData,} from '@/api/manager.js'

export default {
    props: {
        temData: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            formData: {},
        }

    },
    methods: {
        ivuClose() {
            this.$emit('ivu-close')
        },
        updateMall() {
            var that = this;
            updateMallrData('mall', that.formData).then(function (res) {
                if (res.data.code = true) {
                    that.$emit('ivu-close');
                    that.$emit('editData',that.formData)
                }
            })
        }
    },
    mounted(){
        this.formData = _.cloneDeep(this.temData);
    },

}
</script>

<style lang="less" scoped>
@rex : 1rem/16;

.f-dib {
    display: inline-block;
    padding-left: 5px;
}

.sidefont {
    .ivu-input-wrapper {
        width: 95%
    }
}

.allmonth,
.omonth {
    margin-bottom: 24px;
}

.modal {
    align-items: center;
    display: none;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    position: fixed;
    z-index: 999;
}

.modal.is-active {
    display: flex;
}

.modal-background {
    background-color:#000;
    opacity: 0.3;

}

.modal-background,
.modal {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
}

.modal-content,
.modal-card {
    margin: 0 20px;
    max-height: calc(100vh - 160px);
    overflow: auto;
    position: relative;
    width: 100%;
}

// @media screen and (min-width: 769px),
// print {

//     .modal-content,
//     .modal-card {
//         margin: 0 auto;
//         max-height: calc(100vh - 40px);
//         width: 520px;
//     }
// }

.modal-close {
    background: none;
    height: 40px;
    position: fixed;
    right: 20px;
    top: 20px;
    width: 40px;
}

.modal-card {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 40px);
    overflow: hidden;
    -ms-overflow-y: visible;
}

.modal-card-head,
.modal-card-foot {
    align-items: center;
    background-color: whitesmoke;
    display: flex;
    flex-shrink: 0;
    justify-content: flex-start;
    padding: 20px;
    position: relative;
}

.modal-card-foot {
    justify-content: flex-end;

    button+button {
        margin-left: 8*@rex;
    }
}

.modal-card-head {
    background: #fff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.modal-card-title {
    color: #363636;
    flex-grow: 1;
    flex-shrink: 0;
    font-size: 1.5rem;
    line-height: 1;
}

.modal-card-foot {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    background: #fff;
}

.modal-card-foot .button:not(:last-child) {
    margin-right: 10px;
}

.modal-card-body {
    -webkit-overflow-scrolling: touch;
    background-color: white;
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
    padding: 20px;
}
</style>
