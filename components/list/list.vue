<template>
	<swiper class="home" :current="activeIndex" @change="change">
		<swiper-item class="swiper-item" v-for="(item,index) in tab" :key="index">
			<ListItem @loadmore="loadmore" :load="load[index]" :list="listCatchData[index]"></ListItem>
		</swiper-item>
	</swiper>
</template>

<script>
	import ListItem from "./list-item.vue"
	export default {
		name: "list",
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		components: {
			ListItem
		},
		data() {
			return {
				lists: [],
				listCatchData: [],
				load:{
					
				},
				pageSize: 10
			};
		},
		watch:{
			tab(newVal){
				if(newVal.length) {
					this.listCatchData = []
					this.load = {}
					this.getList(this.activeIndex)
				}
			}
		},
		created() {
			uni.$on('update_article',(e) => {
				if(e == 'follow') {
					this.listCatchData = []
					this.load = {}
					this.getList(this.activeIndex)
				}
			})
		},
		methods: {
			loadmore(){
				if(this.load[this.activeIndex].loading != "noMore"){
					this.load[this.activeIndex].page++
					this.getList(this.activeIndex)
				}
			},
			change(e) {
				const {
					current
				} = e.detail;
				this.getList(current)
				if(!this.listCatchData[current] || !this.listCatchData[current].length)
					this.$emit("change", current);
			},
			getList(current) {
				if(!this.load[current]) {
					this.load[current] = {
						page:1,
						loading: 'loading'
					}
				}
				this.$api.get_list({
					name: this.tab[current].name,
					page:this.load[current].page,
					pageSize: this.pageSize
				}).then(res => {
					if(res.data.length < this.pageSize) {
						let oldLoad = {}
						oldLoad.loading = "noMore"
						oldLoad.page = this.load[current].page
						this.$set(this.load, current, oldLoad)
						if(res.data.length == 0) {
							this.$forceUpdate()
							return;
						}
					} 
					let oldList = this.listCatchData[current] || []
					this.$set(this.listCatchData, current,[...oldList,...res.data])
				})
			}
		}
	}
</script>

<style lang="scss">
	.home {
		height: 100%;
	
	.swiper-item {
			height: 100%;
			overflow: hidden;
		}

		.list-scroll {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
