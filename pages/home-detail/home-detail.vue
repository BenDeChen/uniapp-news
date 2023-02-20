<template>
	<view class="detail">
		<view class="detail-title">{{formData.title}}</view>
		<view class="detail-header">
			<view class="detail-header_logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header_content">
				<view class="detail-header_content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header_content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button class="detail-header_button" @click="follow">{{formData.is_author_like ? "已关注" :"关注"}}</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<!-- <u-parse :content="formData.content" :noData="noData" /> -->
			</view>
			<view class="detail-commant">
				<view class="commant-title">最新评论</view>
				<view class="commant-content" v-for="item in commentsList" :key="item.comment_id">
					<comments-box :comments="item" @reply="reply"></comments-box> 
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom_input" @click="open">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom_icons">
				<view class="detail-bottom_icons-box">
					<uni-icons type="chat" size="22" color="#f07373" @click="openComments"></uni-icons>
				</view>
				<view class="detail-bottom_icons-box">
					<uni-icons :type="formData.is_like ? 'heart-filled' : 'heart'" size="22" color="#f07373" @click="likeTap"></uni-icons>
				</view>
				<view class="detail-bottom_icons-box">
					<uni-icons :type="formData.is_thumbs_up ? 'hand-up-filled': 'hand-up'" size="22" color="#f07373" @click="setUpdateThumbs"></uni-icons>
				</view>
			</view>
		</view> 
		<popup-input :replyFormDate="replyFormDate" :articleId="formData._id" ref="popup" @success="updateCommentsOk"></popup-input>
	</view>

</template>

<script>
	import uParse from "@/components/gaoyia-parse/parse.vue"
	export default {
		components: {
			uParse
		},
		data() {
			return {
				formData: {},
				noData: '<p style="text-align:center;color:#666">详情加载中...</p>',
				commentsList:[],
				replyFormDate:{}
			}
		},
		onLoad(query) {
			this.formData = JSON.parse(query.params)
			this.getDetail()
			this.getComments()
		},
		methods: {
			openComments(){
				uni.navigateTo({
					url: "/pages/detail_comments/detail_comments?id=" + this.formData._id
				})
			},
			getDetail() {
				this.$api.get_detail({
					article_id: this.formData._id
				}).then(res => {
					let {
						data
					} = res 
					this.formData = data 
				})
			},
			open() {
				this.$refs.popup.open()
			},
			getComments() {
				this.$api.get_comments({
					article_id: this.formData._id
				}).then(res=>{
					this.commentsList = res.data
				})
			},
			reply(e) {
				this.replyFormDate = {
					comment_id: e.comments.comment_id,
					is_reply: e.is_reply
				}
				if(e.comments.reply_id) {
					this.replyFormDate.reply_id = e.comments.reply_id
				}
				console.log(e);
				this.open()
			},
			follow() {
				uni.showLoading()
				let is_author_like = this.formData.is_author_like
				this.$api.update_author({
					author_id: this.formData.author.id
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title:  is_author_like ? '取消关注' : '关注成功'
					})
					this.formData.is_author_like = !is_author_like
				}).catch(err => {
					uni.hideLoading();
					uni.showToast({
						title:  "操作失败"
					})
				})
			},
			likeTap() {
				this.formData.is_like = !this.formData.is_like;
				this.setUpdateLikes()
			},
			setUpdateLikes() {
				uni.showLoading()
				this.$api.update_likes({
					article_id: this.formData._id
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title:this.formData.is_like ? "收藏成功" : "取消收藏",
						icon: 'none'
					})
					uni.$emit("update_author")
				}).catch(() => {
					uni.hideLoading()
				})
			},
			setUpdateThumbs() {
				let is_thumbs_up = this.formData.is_thumbs_up;
				if(is_thumbs_up) return;
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id: this.formData._id
				}).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title: "点赞成功",
						icon: 'none'
					})
					this.formData.is_thumbs_up = true;
					uni.$emit('update_article')
				}).catch(() => {
					uni.hideLoading()
				})
			},
			updateCommentsOk() {
				this.getComments()
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;
	}

	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;

		.detail-header_logo {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.detail-header_content {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;
			padding-left: 10px;

			.detail-header_content-title {
				font-size: 14px;
				color: #333;

			}

			.detail-header_content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header_button{
			padding: 0 15px;
			flex-shrink: 0;
			height: 30px;
			line-height: 30px;
			border-radius: 5px;
			font-size: 12px;
			background-color: $mk-base-color;
			color: #fff;
		}
	}

	.detail-content {
		min-height: 500px;
		margin-top: 20px;

		.detail-html {
			padding: 0 15px;

		}
		.detail-commant{
			margin-top: 30px;
			.commant-title{
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px solid #f5f5f5;
			}
			.commant-content{
				padding: 0 15px;
				border-top: 1px solid #f5f5f5;
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px solid #f5f5f5;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom_input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border-radius: 5px;
			border: 1px solid #ddd;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom_icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom_icons-box {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}

	
</style>
