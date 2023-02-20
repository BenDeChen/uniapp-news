<template>
	<view>
		<view class="feedback-title">意见反馈：</view>
		<view class="feedback-content">
			<textarea v-model="content" class="feedback-textarea" value="" placeholder="请输入您要反馈的问题"></textarea>
		</view>
		<view class="feedback-title">反馈图片</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item, index) in imageLists" :key="index">
				<view class="close-icon" @click="del(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view> 
			<view v-if="imageLists.length < 5" class="feedback-image-item" @click="addImage"> 
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view> 
		</view>
		<button @click="submit" type="promary" class="feedback-buttom">提交反馈意见</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:"",
				imageLists: []
			}
		},
		methods: {
			addImage() {
				const count = 5 - this.imageLists.length
				uni.chooseImage({
					count: count,
					success:(res) => { 
						const tempFiles = res.tempFiles.slice(0,count)
						tempFiles.forEach((item,index) => {
							this.imageLists.push({
								url: item.path,
								name: item.name
							})
						})
					}
				})
			},
			del(i) {
				this.imageLists.splice(i, 1)
			},
			async submit() {
				let imagePaths = []
				uni.showLoading()
				for(let item of this.imageLists) {
					let filePath = await this.uploadFiles(item.url, item.name);
					imagePaths.push(filePath)
				}
				this.updateFeedback(this.content, imagePaths)
			},
			updateFeedback(content, feedbackImages) {
				this.$api.update_feedbase({
					content,
					feedbackImages
				}).then(res=>{
					uni.hideLoading();
					uni.showToast({
						title: "反馈成功",
						icon:'success'
					})
					// this.imageLists = []
					// this.content = ""
					setTimeout(()=>{
						uni.switchTab({
							url: "/pages/tabbar/my/my"
						})
					}, 1000)
				}).catch(err=>{
					uni.hideLoading();
					uni.showToast({
						title: "反馈失败",
						icon:'error'
					})
				})
			},
			async uploadFiles(filePath, cloudPath){
				const result = await uniCloud.uploadFile({
					filePath ,
					cloudPath 
				})
				return result.fileID
			}
		}
	}
</script>

<style lang="scss">
.feedback-title{
	font-size: 14px;
	margin: 15px;
	color: #666;
}
.feedback-content{
	margin: 15px;
	padding: 10px;
	box-sizing: border-box;
	border: 1px solid #eee;
	.feedback-textarea{
		font-size: 12px;
		width: 100%;
		height: 100px;
	}
}
.feedback-image-box{
	display: flex;
	flex-wrap: wrap;
	padding: 10px;
	.feedback-image-item{
		position: relative;
		width: 33.3%;
		height: 0;
		padding-top: 33.3%;
		box-sizing: border-box;
		.close-icon{
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 0;
			right: 0;
			width: 22px;
			height: 22px;
			border-radius: 50%;
			background-color: red;
			z-index: 2;
		}
		.image-box{
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			top: 5px;
			bottom: 5px;
			left: 5px;
			right: 5px;
			border: 1px solid #eee;
			border-radius: 5px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
}
.feedback-buttom{
	margin: 0 15px;
	background-color: $mk-base-color;
}
</style>
