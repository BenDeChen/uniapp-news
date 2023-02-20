<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="follow-tab_box">
				<view class="follow-tab_item" :class="{active: activeIndex == 0}" @click="tab(0)">文章</view>
				<view class="follow-tab_item" :class="{active: activeIndex == 1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list_swiper" :current="activeIndex" @change="change">
				<swiper-item>
					<list-scroll>
						<list-card v-for="(item) in followList" types="follow" :key="item._id" :item="item"></list-card>
						<uni-load-more v-if="followList.length === 0 || followList.length > 10" :status="loading"></uni-load-more>
					</list-scroll>
				</swiper-item>
				<swiper-item>
					<list-scroll>
						<list-author v-for="(item) in authorList"  :key="item._id" :item="item"></list-author>
						<uni-load-more v-if="authorList.length === 0 || authorList.length > 10" :status="loading2"></uni-load-more>
					</list-scroll>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				followList:[],
				authorList:[],
				loading: 'loading',
				loading2: 'loading',
			}
		},
		onLoad() {
			uni.$on('update_article',()=>{
				this.getFollow()
			})
			uni.$on("update_author", ()=>{
				this.getAuthor()
			})
			this.getFollow()
		},
		watch:{
			activeIndex(newVal){
				if(newVal === 0) {
					this.getFollow()
				}else if(newVal === 1) {
					this.getAuthor()
				}
			}
		},
		methods: {
			tab(index){
				this.activeIndex = index
			},
			getFollow(){
				this.$api.get_follow().then(res=>{
					if(!res.data.length) {
						this.loading = 'nomore'
						return
					}
					this.followList = res.data
				})
			},
			getAuthor() {
				this.$api.get_author().then(res=>{
					if(!res.data.length) {
						this.loading = 'nomore'
						return
					}
					this.authorList = res.data
				})
			},
			change(e) {
				this.activeIndex = e.detail.current
			}
		}
	}
</script>

<style lang="scss">
page{
	width: 100%;
	height: 100%;
	display: flex;
}
.follow{
	height: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
	box-sizing: border-box;
	.follow-tab{
		height: 30px;
		padding: 10px 20px;
		border-bottom: 1px solid #f5f5f5;
		.follow-tab_box{
			width: 100%;
			height: 100%;
			display: flex;
			border-radius: 5px;
			border: 1px solid $mk-base-color;
			.follow-tab_item{
				display: flex;
				justify-content: center;
				align-items: center;
				color: #666;
				font-size: 14px;
				width: 100%;
				&:first-child{
					border-right: 1px solid $mk-base-color;
				}
				&.active{
					color: $mk-base-color;
				}
			}
		}
	}
	.follow-list{
		flex: 1;
		.follow-list_swiper{
			height: 100%;
			.swiper-item{
				height: 100%;
			}
		}
	}
}
</style>
