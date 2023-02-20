<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<view :style="{height: statusBarHeight+'px'}"></view>
			<view class="navbar_contain" :class="{search:isSearch}"
				:style="{height:navBarHeight+'px',width:windowWidth+'px'}" @click.stop="open">
				<view v-if="isSearch"  @click="back" class="navbar-content_search">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-search">
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">uniapp、vue</view>
				</view>
				<view v-else class="navbar-search">
					<input class="navbar-search_text" @input="inputChange" type="text" v-model="val" placeholder="请输入你要搜索的内容">
				</view>
			</view>

		</view>

		<view :style="{height: statusBarHeight + navBarHeight +'px'}">

		</view>
	</view>
</template>

<script>
	export default {
		name: "navbar",
		props: {
			value:{
				type: [String, Number],
				default: ""
			},
			isSearch: {
				type: Boolean,
				default: false
			}
		},
		watch:{
			value:function(newVal){
				this.val = newVal
			}
		}, 
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				windowWidth: 375,
				val:""
			};
		},
		created() { 
			const info = uni.getSystemInfoSync();
			// 状态栏高度
			this.statusBarHeight = info.statusBarHeight;
			this.windowWidth = info.windowWidth
			// 小程序胶囊
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info
				.statusBarHeight);
			this.windowWidth = menuButtonInfo.left
			// #endif
		},
		methods: {
			open() {
				if(this.isSearch) {
					return
				}
				uni.navigateTo({
					url: "/pages/home-search/home-search"
				})
			},
			inputChange(e) {
				const {value} = e.detail;
				this.$emit("input", value)
			},
			back() {
				// uni.navigateBack()
				uni.switchTab({
					url:"/pages/tabbar/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '../../common/css/icons.css';

	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $mk-base-color;
		}

		.navbar_contain {
			height: 45px;
			padding: 0 15px;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;

			.navbar-search {
				display: flex;
				align-items: center;
				padding: 0 10px;
				width: 100%;
				height: 30px;
				border-radius: 30px;
				background-color: #fff;

				.navbar-search_icon {
					margin-right: 10px;
				}

				.navbar-search_text {
					width: 100%;
					font-size: 14px;
					color: #999;
				}
			}

			&.search {
				padding-left: 0;

				.navbar-content_search {
					margin-left: 10px;
					margin-right: 10px;
				}

				.navbar-search {
					border-radius: 5px;
				}
			}
		}

	}
</style>
