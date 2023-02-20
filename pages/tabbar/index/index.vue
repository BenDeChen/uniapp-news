<template>
	<view class="home">
		<navbar></navbar>
		<tab :list="tabList" :tabIndex="tabIndex" @tab="tab"></tab>
		<view class="home-list">
			<list :tab="tabList" :activeIndex="activeIndex" @change="change" ></list>
		</view>
	</view>
</template>
<script>
	// import navbar from "@/components/navbar.vue"
	import { mapState } from "vuex"
	export default {
		data() {
			return {
				title: 'Hello',
				tabList:[],
				tabIndex:0,
				activeIndex: 0
			}
		},
		computed:{
			...mapState(['userinfo'])
		},
		watch:{
			userinfo(newVal){
				this.getLabel()
			}
		},
		onLoad() {
			uni.$on('labelChange', () => {
				this.tabIndex = 0
				this.activeIndex = 0
				this.getLabel()
			})
		},
		methods: {
			getLabel() {
				this.$api.get_label({
					name:'get_label'
				}).then(res=>{
					res.data.unshift({
						name: "全部"
					})
					this.tabList = res.data
				})
				
			},
			tab(e) { 
				this.activeIndex = e.index
			},
			change(current) {
				this.tabIndex = current
			}
		}
	}
</script>

<style lang="scss">
page{
	height: 100%;
	display: flex;
}
.home{
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
	.home-list{
		flex: 1;
		box-sizing: border-box;
	}
}
</style>
