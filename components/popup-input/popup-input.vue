<template>
	<view>
		<uni-popup type="bottom" ref="popup" :maskClick="false">
			<view class="popup-warp">
				<view class="popup-header">
					<text class="popup-header_item" @click="close">取消</text>
					<text class="popup-header_item" @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<textarea v-model="commentsValue" calss="popup-textarea" maxlength="200" fixed
						placeholder="请输入评论内容"></textarea>
					<view class="popup-count">
						{{commentsValue.length}}/200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "popup-input",
		props:{
			replyFormDate: {
				type: Object,
				defult: ()=>({})
			},
			articleId: {
				type: String || Number,
				defult: ''
			}
		},
		data() {
			return {
				commentsValue: ""
			};
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
				this.commentsValue = ""
			},
			submit() {
				if (!this.commentsValue.trim()) {
					uni.showToast({
						title: "评论不能为空",
						icon: "none"
					})
					return
				} 
				this.setUpdateComment({
					content: this.commentsValue,
					...this.replyFormDate
				})
			},
			setUpdateComment(content) {
				const formData = {
					article_id: this.articleId,
					...content 
				}
				uni.showLoading( )
				this.$api.update_comment({
					...formData 
				}).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title: "评论发布成功"
					})
					// this.getComments()
					this.$emit("success")
					this.close()
					this.replyFormDate = {}
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: "评论发布失败",
						icon:"error"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.popup-warp {
		background-color: #fff;

		.popup-header {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			border-bottom: 1px solid #f5f5f5;

			.popup-header_item {
				height: 50px;
				line-height: 50px;
				padding: 0 15px;

			}
		}

		.popup-content {
			width: 100%;
			padding: 15px;
			box-sizing: border-box;

			.popup-textarea {
				width: 100%;
				height: 200px;
			}

			.popup-count {
				display: flex;
				justify-content: flex-end;
				font-size: 12px;
				code: #999
			}
		}
	}
</style>
