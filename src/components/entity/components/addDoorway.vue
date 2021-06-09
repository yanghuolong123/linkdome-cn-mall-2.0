<template>
<div class="addDoorWay">
  <div class="dialogs-edit">
      <div class="dialogs-edit-bg" ></div>
      <div class="dialogs-edit-text" :style="{height:heights,marginTop:marginTops}" id="addEntity">
          <div class="edit-title">
              {{editDoorWayTitle}}
          </div>
          <div class="edit-close" v-on:click="closeEdit">
                <Icon type="md-close" />
            </div>
          <div class="edit-text">
                <Form :model="formData" label-position="right" :label-width="85" ref="formData" :rules="ruleInline">
                    <FormItem label="出入口名称" prop="name">
                        <Input type ="text" v-model="formData.name" placeholder="请输入出入口名称"></Input>
                    </FormItem>
                    <FormItem label="出入口关联" prop="gate"  v-if="userLvl=='admin'">
                        <i-select v-model="formData.gate" @on-change="getItemValue">
                            <i-option v-for="item in gateList" :value="item.value" :key="item.value">{{item.label}}</i-option>
                        </i-select>
                    </FormItem>
                    <FormItem label="描述" prop="description" :label-width="85">
                        <Input  type="textarea" v-model="formData.description" :rows="4"></Input>
                    </FormItem>
                </Form>
                <div class="control">
                    <Button  @click="handleSubmit('formData')">提交</Button>
                    <Button class="buttonCel" @click.native="closeEdit">取消</Button>
                </div>
          </div>
      </div>
  </div>
</div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import {
   addGate,
   updateFloorGate
} from "@/api/manager.js";
export default {
    props: {
        editDoorWayTitle:{
            type: String,
            default:"添加出入口"
        },
        zonelist: {
            type: Array,
            required: true
        },
        floorInfo: {
            type: Array,
            required: true
        },
        parent_id: {
            type: Array,
            required: true
        },
        gateList:{
            type: Array,
            default:[]
        },
        userLvl: {
        type: String,
        default: "admin"
        },
    },
    data() {
        return {
            height:"360px",
            marginTop:"-180px",
            gate: 'gate',
            isModify:false,
            formData: {
                name: '',
                gate: 0,
                description: '',
            },
            gate_id : 0,
            ruleInline: {
                name: [{
                    required: true,
                    message: '出入口名称不能为空',
                    trigger: 'blur'
                }, ],
                gate: [{
                    required: true,
                    message: '至少选择一项'
                
                }],
            }
        }

    },
    computed:{
        marginTops(){
            if(this.userLvl=='common_admin'){
                return "-154px"
            }
            else{
                return"-180px"
            }
        },
        heights(){
            if(this.userLvl=='common_admin'){
                return "308px"
            }
            else{
                return"360px"
            }
        }
    },
    methods: {
        /* 校验表单
        *@method handleSubmit
        *@param {String} name 表单的ref值
        *@return null
        */
        handleSubmit (name) {
            var that = this;
            that.$refs[name].validate((valid) => {
                if (valid) {
                    that.addDoorWay();
                }
            })
        },
       closeEdit(){
           this.$emit("closeEdit");
       },
        getItemValue(val) {
            this.gate_id = val
        },
        addDoorWay() {
            var that = this;
            var property_id = that.floorInfo[0].property_id;
            var parent_id = _.last(that.floorInfo).id;
            var data = {};
            // _.forEach(that.gateList,function (value) {
            //     if(value.value == that.gate_id){
            //         data.name = value.name;
            //     }
            // });
            data.name = that.formData.name
            data.description = that.formData.description;
            data.gate_id = that.gate_id;
            data.type = 'gate';
            if(!that.isModify){
                addGate(property_id, that.formData.name,parent_id, that.gate_id, that.formData.description).then(function (res) {
                    if (res.data.code == 200) {
                        data.id = res.data.data.bzid;
                        that.closeEdit();
                        var alertText = {};
                        alertText.bg = '#00A0E9'
                        alertText.title = that.editTitle
                        alertText.text = '添加出入口成功'
                        alertText.confirm = false
                        that.$emit("alertMessage",true,alertText)
                        that.$emit('addTypeData',data)
                    }
                });
            }
            else{
                that.gate_id = that.formData.gate;
                data.gate_id = that.gate_id;
                var bzid = that.formData.id;
                updateFloorGate(property_id, that.formData.name,parent_id, that.gate_id, that.formData.description,bzid).then(function (res) {
                    if (res.data.code == 200) {
                        data.id = that.formData.id;
                        that.closeEdit();
                        var alertText = {};
                        alertText.bg = '#00A0E9'
                        alertText.title = that.editTitle
                        alertText.text = '编辑出入口成功'
                        alertText.confirm = false
                        that.$emit("alertMessage",true,alertText)
                        that.$emit('updateTypeData',data)
                    }
                });
            }
        },
    },
}
</script>

<style lang="less" scoped>
.addDoorWay{
    .dialogs-edit{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 66666;
        .dialogs-edit-bg{
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.3;
        }
        .dialogs-edit-text{
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -250px;
            width: 500px;
            background-color: #fff;
            background:rgba(255,255,255,1);
            border:1px solid rgba(215,223,227,1);
            box-shadow:1px 2px 10px 0px rgba(193,193,193,0.2);
            border-radius:8px;
            .edit-title{
                width: 100%;
                height: 53px;
                line-height: 53px;
                padding-left: 20px;
                background:rgba(242,242,242,1);
                font-size:18px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:rgba(91,89,89,1)
            }
            .edit-text{
                width: 80%;
                margin-left: 10%;
                padding-top: 20px;
                position: relative;
                .control{
                    position: relative;
                    width: 52%;
                    left: 33%;
                    .ivu-btn{
                        width: 90px;
                        color: #fff;
                        outline: none;
                        &:nth-child(1){
                            margin-right: 20px;
                            background-color: #00a0e9;
                            &:hover{
                                border:px solid #00a0e9;
                            }
                        }
                         &:nth-child(2){
                            background-color: #fff;
                            color:#515a6e;
                            &:hover{
                               color: #57a3f3;
                            }
                        }
                    }
                }
            }
        }
  }
  .edit-close{
    position: absolute;
    right: -5px;
    top: -5px;
    background: #fff;
    width: 33px;
    height: 33px;
    box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
    border-radius: 5px;
    text-align: center;
    line-height: 33px;
    cursor: pointer;
    transition: all .23s ease .1s;
    &:hover{
        transform: translate(5px,-5px);
        box-shadow: 0 0 0 0 rgba(0,0,0,.1)
    }
    i{
      font-size: 20px;
    }
  }
  .ivu-form-item {
     margin-bottom: 24px;
    }
}
</style>
