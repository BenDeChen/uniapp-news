<template>
	<view>
		<list-card v-for="item in lists" :ket="item.id" :item="item"></list-card>
		<uni-load-more v-if="lists.length == 0" status="loading"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists: []
			}
		},
		onLoad() {
			this.getArticle()
		},
		methods: {
			getArticle() {
				this.$api.get_my_article().then(res=>{
					this.lists = res.data
				})
			}
		}
	}
</script>

<style>

</style>
