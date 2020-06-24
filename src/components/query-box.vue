<template>
	<div class="queryBox">
		<el-form :model="dataForm">
			<ul>
				<li>
					<span>查询时间:</span>
					<el-date-picker v-model="dataForm.queryDate"
					@change="selectDate"
					:clearable="false"
					 type="daterange"
					 unlink-panels
					 value-format="yyyyMMdd"
					 range-separator="-"
					 start-placeholder="开始日期"
					 end-placeholder="结束日期">
					</el-date-picker>
				</li>
				<li>
					<el-button type="primary"
					 @click="getAssess">获取评估区间</el-button>
				</li>
				<li>
					<el-select v-model="dataForm.assessVal"
					 @change="change">
						<el-option v-for="(item,index) in assessment"
						 :key="index.value"
						 :label="item.label"
						 :value="item.value">
						</el-option>
					</el-select>
				</li>
			</ul>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'queryName',
		data() {
			return {
				dataForm: {
					queryDate: '', // 查询时间
					assessVal: '',
				},
				assessment: [], // 评估区间
			}
		},
		mounted() {
			/*var now = new Date()
			var oneDay = 24*3600*1000
			var startTime = new Date(+now - 30*oneDay)
			this.dataForm.queryData = [startTime,new Date()]*/
			
			// 一进入页面给日期选择组件设置默认值
			this.dataForm.queryDate = ['20190201','20190228']
			// 一进入页面触发一次日期选择组件的chang事件
			this.selectDate(this.dataForm.queryDate)
			// 一进入页面触发一次获取评估区间单击事件
			this.getAssess()
		},
		methods: {
			// 获取评估区间
			getAssess() {
				this.assessment = [];
				this.$http({
					url: this.$http.adornUrl('/electric/assessresult/resultComputeNodes'),
					method: 'get',
					params: this.$http.adornParams({
						startTime: this.dataForm.queryDate[0],
						endTime: this.dataForm.queryDate[1]
					})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {

						if(data.list.length>0){
							data.list.forEach((item, index) => {
								var label = item
								var value = item
								// 动态添加数据
								this.assessment.push({
									value: value,
									label: label
								});
							})
							// 默认选中第一个
							this.dataForm.assessVal = this.assessment[0].value
							this.change(this.dataForm.assessVal)
						}else{
							// 清空操作
							this.assessment = []
							this.dataForm.assessVal = ''
							this.$emit('transmitPars', 0)
						}

					}
				})
			},
			selectDate(val){
				this.$emit('selectDate',val)
			},
			change(val) {
				this.$emit('transmitPars', val)
			}
		}
	}
</script>

<style lang="scss"
 scoped="scoped">
	ul {
		padding: 0;
	}
	
	.queryBox {
		ul {
			overflow: hidden;
			li {
				float: left;
				margin-right: 15px;
			}
		}
	}
</style>