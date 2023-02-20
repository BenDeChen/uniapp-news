<template>
	<view class="label">
		<view class="label-box">
			<view class="label-header">
				<view class="label-titile">我的标签</view>
				<view class="label-edit" @click="editLabel">{{is_edit ? '完成' : '编辑'}}</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view class="label-content" v-if="!loading">
				<view class="label-content_item" v-for="(item, index) in labelList" :key="item.name">
					{{item.name}}
					<uni-icons v-if="is_edit" @click="del(index)" type="clear" size="20" color="red" class="icons-close"></uni-icons>
				</view>
				<view class="no-data" v-if="!labelList.length">没有数据</view>
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-titile">推荐标签</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view class="label-content" v-if="!loading">
				<view class="label-content_item" v-for="(item, index) in list" :key="item.name" @click="add(index)">{{item.name}}</view>
				<view class="no-data" v-if="!list.length">没有数据</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				labelList: [],
				list: [],
				loading: true
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			editLabel() {
				if(this.is_edit) {
					this.is_edit = false
					let label = this.labelList.map(item=>item._id)
					uni.showLoading()
					this.updateLabel(label)
				}else{
					this.is_edit = true
				}
			},
			getLabel() {
				this.loading = true
				this.$api.get_label({
					type: 'all'
				}).then(res => {
					let {
						data
					} = res;
					this.labelList = data.filter(item => item.current)
					this.list = data.filter(item => !item.current)
					this.loading = false
				})
			},
			del(index) {
				if(!this.is_edit) return;
				this.list.push(this.labelList[index])
				let item = this.labelList.splice(index,1)
				console.log(item);
			},
			add(index) {
				if(!this.is_edit) return;
				this.labelList.push(this.list[index])
				this.list.splice(index,1)
			},
			updateLabel(label) {
				this.$api.update_label({
					label
				}).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title:"更新成功",
						icon:'none'
					})
					uni.$emit('labelChange')
				})
			}, 
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.label {
		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px solid #f5f5f5;

				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}

			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content_item {
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px solid #666;
					font-size: 14px;
					color: #666;
					position: relative;

					.icons-close {
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}
	.no-data{
		text-align: center;
		width: 100%;
		padding: 50px 0;
		color: #999;
		font-size: 14px
	}
</style>
