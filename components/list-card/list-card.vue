<template>
	<view @click="open" >
		<!-- 基础卡片 -->
		<view v-if="item.mode === 'base'" class="listcard">
			<view class="listcard-image">
				<image :src="item.cover[0]" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}}</text>
					<likes :types="types" :item="item"></likes>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des-label">
						<view class="listcard-content_des-label-item">{{item.classify}}</view>
					</view>
					<view class="listcard-content_des-browse">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
		<!-- 多图魔术 -->
		<view v-if="item.mode === 'column'" class="listcard mode-column">
			<view class="listcard-content">
				<view class="listcard-content_title"><text>{{item.title}}</text><likes :types="types" :item="item"></likes></view>
				<view class="listcard-image">
					<view v-if="index < 3" v-for="(src,index) in item.cover" :key="index" class="listcard-image_item">
						<image :src="src" mode="aspectFill"></image>
					</view>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des-label">
						<view class="listcard-content_des-label-item">{{item.classify}}</view>
					</view>
					<view class="listcard-content_des-browse">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
		<!-- 大图模式 -->
		<view  v-if="item.mode === 'image'" class="listcard mode-image">
			<view class="listcard-image">
				<image :src="item.cover[0]" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">

				<view class="listcard-content_title"><text>{{item.title}}</text><likes :types="types" :item="item"></likes></view>

				<view class="listcard-content_des">
					<view class="listcard-content_des-label">
						<view class="listcard-content_des-label-item">{{item.classify}}</view>
					</view>
					<view class="listcard-content_des-browse">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "list-card",
		props:{ 
			item:{
				type: Object,
				default() {
					return {}
				}
			},
			types:{
				type:String,
				default:''
			}
		},
		data() {
			return {

			};
		},
		methods:{
			open(){
				this.$emit("click", this.item)
				const item = this.item
				const params = {
					_id: item._id,
					title: item.title,
					author: item.author,
					create_time: item.create_time,
					thumbs_up_count: item.thumbs_up_count,
					browse_count: item.browse_count,
					is_like: item.is_like
				}
				uni.navigateTo({
					url:"/pages/home-detail/home-detail?params=" + JSON.stringify(params)
				})
			}
		}
	}
</script>

<style lang="scss">
	.listcard {
		display: flex;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;

		.listcard-image {
			width: 60px;
			height: 60px;
			border-radius: 5px;
			overflow: hidden;
			flex-shrink: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.listcard-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 10px;
			width: 100%;

			.listcard-content_title {
				position: relative;
				padding-right: 30px;
				font-size: 14px;
				color: #333;
				font-weight: 400;
				line-height: 1.2;

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				
			}

			.listcard-content_des {
				display: flex;
				justify-content: space-between;
				font-size: 12px;

				.listcard-content_des-label {
					display: flex;

					.listcard-content_des-label-item {
						padding: 0 5px;
						margin-right: 5px;
						border-radius: 15px;
						color: $mk-base-color;
						border: 1px solid $mk-base-color;
					}
				}

				.listcard-content_des-browse {
					color: #999;
					padding: 0 5px;
				}
			}
		}

		&.mode-column {
			.listcard-content {
				width: 100%;
				padding-left: 0;
			}

			.listcard-image {
				display: flex;
				margin-top: 10px;
				width: 100%;
				height: 70px;

				.listcard-image_item {
					margin-left: 10px;
					width: 100%;
					border-radius: 5px;
					overflow: hidden;

					&:first-child {
						margin-left: 0;
					}

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.listcard-content_des {
				margin-top: 10px;
			}
		}

		&.mode-image {
			flex-direction: column;

			.listcard-image {
				width: 100%;
				height: 100px;
			}

			.listcard-content {
				padding-left: 0;
				margin-top: 10px;

				.listcard-content_des {
					display: flex;
					align-items: center;
					margin-top: 10px;
				}
			}
		}
	}
</style>
