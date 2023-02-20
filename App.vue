<script>
	export default {
		onLaunch: function() {
			// 模拟用户登录成功获取用户信息 
			this.$api.get_user({
				user_id: "63e8f132f5cf3ae51049e43d"
			}).then(res=>{
				this.$store.dispatch('set_userinfo', res.data)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "components/gaoyia-parse/parse.css";
</style>
