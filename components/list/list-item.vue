<template>
	<list-scroll class="list-scroll" @loadmore="loadmore">
		<view class="">
			<list-card v-for="(item,index) in list" :item="item"></list-card>
		</view>
		<uni-load-more iconType="snow" :status="load.loading || 'loading'"></uni-load-more>
	</list-scroll>
</template>

<script>
	export default {
		props:{
			list:{
				type:Array,
				defult() {
					return []
				}
			},
			load: {
				type: Object,
				default() {
					return {
						loading:"loading"
					}
				}
			}
		},
		methods:{
			loadmore() {
				this.$emit("loadmore")
			}
		}
	}
</script>

<style lang="scss">
	.list-scroll{
		height: 100%;
		overflow: hidden;
	}
</style>