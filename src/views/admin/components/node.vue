<template>
    <div ref="node"
         :style="nodeContainerStyle"
         @click="clickNode"
         @mouseover="hoverId = node.id"
         @mouseout="hoverId=-1"
         @contextmenu.prevent="clickNode"
         @mouseup="changeNodeSite"
         :class="nodeContainerClass">
        <div class="inner-node" :class="innerNodeClass"></div>
    </div>
</template>

<script>
    export default {
        props: {
            node: Object,
            activeElement: {
                type:Object,
                default:()=>{
                    return {}
                }
            }
        },
        data() {
            return {
                hoverId:-1
            }
        },
        computed: {
            nodeContainerClass() {
                return {
                    'ef-node-container': true,
                    'ef-node-active': this.activeElement.type === 'node' ? this.activeElement.nodeId === this.node.id : false
                }
            },
            // 节点容器样式
            nodeContainerStyle() {
                return {
                    top: this.node.top,
                    left: this.node.left,
                    backgroundColor:this.node.paintStyle||'#EBD039'
                }
            },
            //inner-node用于控制是否可以推拽连线
            innerNodeClass() {
                var innerNodeClass = {}
                innerNodeClass['flow-node-drag'] =this.node.viewOnly ? false : true
                return innerNodeClass
            }
        },
        methods: {
            // 点击节点
            clickNode(e) {
                this.$emit('clickNode', this.node.id,this.node.name,e)
            },
            // 鼠标移动后抬起
            changeNodeSite() {
                // 避免抖动
                if (this.node.left == this.$refs.node.style.left && this.node.top == this.$refs.node.style.top) {
                    return;
                }
                this.$emit('changeNodeSite', {
                    nodeId: this.node.id,
                    left: this.$refs.node.style.left,
                    top: this.$refs.node.style.top,
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    .ef-node-container {
        position: absolute;
        display: flex;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #EBD039;
    }

    .ef-node-container:hover {
        /* 设置移动样式*/
        /*box-shadow: #1879FF 0px 0px 12px 0px;*/
        background-color: #EBD039;

    }
    .inner-node{
        width: 0px;
        height: 0px;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: white;
        cursor: pointer;
    }
    /*节点激活样式*/
    .ef-node-active {
        background-color: #F18F26;
        box-shadow: 0px 0px 7px 2px rgba(222,133,37,.5);


    }
</style>
