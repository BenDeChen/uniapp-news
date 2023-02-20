<template>
	<view>
		<view class="comments-content" v-for="(item,index) in commentsList" :key="item.comment_id">
			<comments-box :comments="item" @reply="reply"></comments-box>
		</view>
		<uni-load-more v-if="commentsList.length == 0 || commentsList.length > 10" :status="isLoding ? 'loading' : 'noMore'" iconType="snow"></uni-load-more>
		<popup-input :replyFormDate="replyFormDate" :articleId="article_id" ref="popup" @success="updateCommentsOk"></popup-input>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article_id: '',
				commentsList: [],
				page:1,
				pageSize:10,
				isLoding: true,
				replyFormDate: {}
			}
		},
		onLoad(query) {
			this.article_id = query.id;
			this.getComments()
		},
		onReachBottom() {
			this.page += 1;
			this.isLoding && this.getComments()
		},
		methods: {
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				}).then(res=>{
					if(!res.data.length) {
						this.isLoding = false;
						return
					}
					let oldCommentsList = JSON.parse(JSON.stringify(this.commentsList))
					this.commentsList = Object.assign(oldCommentsList, res.data)
				})
			},
			updateCommentsOk() {
				this.getComments()
			},
			open() {
				this.$refs.popup.open()
			},
			reply(e) {
				this.replyFormDate = {
					comment_id: e.comments.comment_id,
					is_reply: e.is_reply
				}
				if(e.comments.reply_id) {
					this.replyFormDate.reply_id = e.comments.reply_id
				} 
				this.open()
			},
		}
	}
</script>

<style lang="scss">
.comments-content{
	padding: 0 15px;
}
</style>
