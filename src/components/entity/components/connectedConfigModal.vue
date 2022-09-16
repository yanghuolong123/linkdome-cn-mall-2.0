<template>
	<co-modal  ref="modal" title="连通图配置"
						 @onOk="handleSave"
						 @onCancel="handleClose"
						 :width="width">
		<div class="flex-column wraper">
			<div class="title flex-center">
				<span class="ellipsis-1" :style="{width:gridStyle.width}" :title="store.name" v-for="store in storeList">{{store.name}}</span>
			</div>
			<div class="flex-center">
				<div class="left flex-column">
					<div class="store-name ellipsis-1" :title="store.name" v-for="store in storeList">{{store.name}}</div>
				</div>
				<div class="grid-ctn flex-center" >
					<div class="grid flex-column" :style="gridStyle"
							 :key="i"  v-for="(grid,i) in gridList"  v-if="gridList.length">
						<el-checkbox :key="grid.id" :disabled="grid.disabled" v-model="grid.checked" @change="(val)=>{gridClick(val,grid)}" :checked="grid.checked"></el-checkbox>
					</div>
				</div>
			</div>
		</div>
		
		
	</co-modal>
</template>
<script>
  import coModal from "_c/common/Modal.vue";
  import {setTrailPoint} from '../../../api/manager'

  export default {
	  components:{
      coModal
		},
		data(){
	    return{
        gridList:[],
			}
		},
    props:{
      visible:{
        type:Boolean,
        default:false
      },
      floorId:{
        type:Number
      },
      storeList:{
        type:Array,
				default:()=>[]
			},
      configInfo:{
        type:Object,
				default:()=>{}
			}
    },
		computed:{
      width(){
        if(this.storeList.length<10){
          return ((this.storeList.length*50)+150)
				}
        return 1350
			},
	    gridStyle(){
	      let width,height;
	      if(this.storeList.length<10){
	        width = 50+'px'
				}else {
	        width = height = Math.floor((this.width-150)/this.storeList.length)+'px'
				}
	      return {
          maxWidth:((this.width-150)/(this.storeList.length||10))+'px',
					maxHeight:((this.width-150)/(this.storeList.length||10))+'px',
					width,
					height:'30px'
				}
			},
	 
		},
		methods:{
      handleClose(){
        this.$refs.modal.closeModal()
			},
      handleSave(){
        const connected = this.gridList.filter(o=>{
          return o.checked === true
				})
        let conf = connected.map(o=>{
				  return o.value
				})
        const data = {
          floor_id:this.floorId,
					conf:JSON.stringify(conf)
				}
        setTrailPoint(data).then(()=>{
        	this.$message.success('配置成功')
          this.$refs.modal.resetOkButton()
          this.$refs.modal.closeModal()
				}).catch(err=>{
          this.$refs.modal.resetOkButton()
          console.log(err)
        })
       
      },
      gridClick(val,grid){
				grid.checked = val
      },
      showModal(){
        this.$refs.modal.showModal()
				this.$nextTick(()=>{
          this.initGrid()
        })
			},
      initGrid(){
        let matArr = []
        if(this.configInfo.mat_row){
          matArr = JSON.parse(this.configInfo.mat_row)
				}
       
        this.gridList = []
        if(this.storeList && this.storeList.length){
          const len = this.storeList.length
          for(var i = 0;i<len;i++){
            for(var j = 0;j<len;j++){
              const obj = {
                name:this.storeList[i].name,
                value:this.storeList[i].id+':'+this.storeList[j].id,
                id:`${i}${j}`,
                checked:matArr.includes(this.storeList[i].id+':'+this.storeList[j].id),
                disabled:this.storeList[i].id === this.storeList[j].id
              }
              this.gridList.push(obj)
            }
          }
        }
      },
     
		}
	}
</script>
<style lang="less" scoped>
	.wraper{
		.title{
			height: 30px;
			width: 100%;
			padding-left: 50px;
			line-height: 30px;
			text-align: center;
		}
		.left{
			width: 50px;
			flex: none;
			.store-name{
				width: 50px;
				text-align: center;
				height: 30px;
				line-height: 30px;
			}
		}
		.grid-ctn{
			flex-wrap: wrap;
			.grid{
				align-items: center;
				justify-content: center;
			}
		}
	}

</style>
