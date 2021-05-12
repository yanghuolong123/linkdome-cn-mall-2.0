<template>
<div class="modal is-active">
    <!-- 编辑楼层 -->
    <div class="modal-background" @click="ivuClose"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <a class="ivu-modal-close" @click="ivuClose"><i class="ivu-icon ivu-icon-ios-close"></i></a>
        </header>
        <section class="modal-card-body">

            <Form :model="formData" label-position="right" :label-width="85" ref="formData" :rules="ruleInline">
                <FormItem label="名称" prop="name">
                    <Input type ="text" v-model="formData.name"></Input>
                </FormItem>
                <FormItem label="描述" prop="description" :label-width="85">
                    <Input  type="textarea" :rows="4" v-model="formData.description"></Input>
                </FormItem>
            </Form>
        </section>
        <footer class="modal-card-foot">
            <button type="button" class="ivu-btn ivu-btn-text ivu-btn-large" @click="ivuClose"><span>取消</span></button>
            <button type="button" class="ivu-btn ivu-btn-primary ivu-btn-large" @click="addGroup('formData')"><span>确定</span></button>
        </footer>
    </div>
</div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import {updateFloorData} from '@/api/manager.js'
import { validRemark } from '@/libs/util'

export default {
    props: {
        temData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            formData: {
                name: this.temData.name,
                description: this.temData.description,
                bzid: this.temData.bzid,
            },
            ruleInline: {
                name: [{
                        required: true,
                        message: '集团名称不能为空',
                        trigger: 'blur'
                    },
                    {   type: 'string',
                        min: 4,
                        message: '集团名称不得少于4个字符',
                        trigger: 'blur'
                    },
                    {
                        type: 'string',
                        max: 10,
                        message: '集团名称不得大于10个字符',
                        trigger: 'blur'
                    }],
                description: [{
                        type: 'string',
                        max: 50,
                        message: '描述不得大于50个字符',
                        trigger: 'blur'
                    }],
            }
        }

    },
    methods: {
        ivuClose() {
            this.formData.name = '';
            this.formData.address = '';
            this.$emit('ivu-close')
        },
        addGroup(name) {
            var that = this;
            var floor = this.temData.type;
            var bzid = this.temData.bzid;
            var data = {};
            data.description = that.formData.description;
            data.name = that.formData.name;
            data.type = that.temData.type;
            that.$refs[name].validate((valid) => {
                if (valid) {
                    updateFloorData(floor,bzid, that.formData).then(function (res) {
                        that.$emit('editSuccessful',data);
                        that.$emit('ivu-close');
                        alert('编辑成功')
                    })
                }
            })
        }
    },
    mounted() {

    }
}
</script>

<style lang="less" scoped>
@rex : 1rem/16;

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
   background-color: #000;
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
