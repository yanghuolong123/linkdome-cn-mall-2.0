<template>
	<h-modal  ref="modal" title="热力图配置" :footerHide="true"  :width="1350">
		<div class="modal-ctn flex-start">
			<div class="left" ref="heatmap" @click="setPosition" :class="{cross:status}" :style="{backgroundImage:`url(${imgSrc?imgSrc:placeholder})`}">
				<img v-for="po in positionList"
						 :style="{left:po.left+'px',top:po.top+'px'}"
						 class="po"
						 @click="positionClick(po)"
						 :class="{pointer:!status}"
						 :src="pointsSrc(po.id)">
			</div>
			<div class="right m-l-20 flex-column">
				<div class="flex-start info" v-if="currentPosition">
					<div class="flex-column">
						<span>当前点位：</span>
						<span>x坐标:{{currentPosition.x}}</span>
						<span>y坐标:{{currentPosition.y}}</span>
					</div>
					<Button class="m-l-20" type="error" @click="delClick">删除</Button>
				</div>
				<Button @click="beginClick" v-if="!status">开始打点</Button>
				<Button @click="handleSave" v-else>保存</Button>
			</div>
			
		</div>
	</h-modal>
</template>
<script>
	import hModal from "_c/common/Modal.vue";
	import {configPoint,getConfigPoint} from '../../../api/manager'

  export default {
	  name:'heatmapModal',
		components:{
      hModal
		},
		data(){
	 		return{
        placeholder:require('@/assets/images/fixation_img/bg/placeholder.jpg'),
				status:false,
        positionList:[],
        currentPosition:null
			}
		},
		computed:{
	    pointsSrc(){
	    	return (id)=>{
	    	  if(this.currentPosition&&this.currentPosition.id === id ){
						return require('@/assets/images/fixation_img/rest/position_active.png')
          }else {
            return require('@/assets/images/fixation_img/rest/position.png')
					}
				}
			},
	    size(){
        const imgWidth = this.$refs.heatmap.offsetWidth;
        const imgHeight = this.$refs.heatmap.offsetHeight;
	      return {
          width:imgWidth,
					height:imgHeight
				}
			},

		},
		props:{
      visible:{
        type:Boolean,
				default:false
			},
      imgSrc:{
        type:String
			},
      floorId:{
        type:Number
			},
		},
		methods:{
      delClick(){
      	const index = this.positionList.findIndex(o=>{
      	  return o.id === this.currentPosition.id
				})
				this.positionList.splice(index,1)
				this.handleSave(this.positionList)
			},
      positionClick(po){
        if(this.status) return;
        this.currentPosition = po
      },
      handleSave(){
        const points = this.positionList.map(o=>{
          return {
            x:o.x,
						y:o.y
					}
				})
        const data = {
          floor_id:this.floorId,
          points:JSON.stringify(points)
				}
        configPoint(data).then(res=>{
          this.status = false
					this.$message.success('保存成功')
					this.currentPosition = null
        })
			},
      beginClick(){
        this.status = true;
        this.currentPosition = null
			},
	    showModal(){
	      this.$refs.modal.showModal()
				const params = {
          floor_id:this.floorId
				}
        getConfigPoint(params).then(res=>{
          console.log(res)
					res=	res.data.data
					if(res && res.points){
					  let points = JSON.parse(res.points)
						points.forEach((o,i)=>{
						  o.id = i
						  o.left = Math.floor(this.size.width*o.x)
						  o.top = Math.floor(this.size.height*o.y)
						})
					  this.positionList = points
					}
        })
			},
      setPosition(e){
        if(!this.status) return
				const obj = {
          id:Date.now().toString(36),
          x:(e.layerX/this.size.width).toFixed(4),
					y:(e.layerY/this.size.height).toFixed(4),
					top:e.layerY,
					left:e.layerX
				}
        this.positionList.push(obj)
      }
		}
	}
</script>
<style lang="less" scoped>
	.modal-ctn{
		height: 500px;
		width: 100%;
		.left{
			width: 70%;
			height: 100%;
			background-size: 100% 100%;
			position: relative;
			&.cross{
				cursor: crosshair;
			}
			.po{
				position: absolute;
				transform: translate(-50%,-70%);
				width: 27px;
				height: 27px;
				top: 0;
				left: 0;
			}
		}
		.right{
			.info{
				margin-bottom: 20px;
			}
		}
	}
</style>
