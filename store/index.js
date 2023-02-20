
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		historyLists: uni.getStorageSync("__history") || [],
		userinfo: uni.getStorageSync('USERINFO') || {}
	},
	mutations:{
		SET_HISTORY_LIST(state, history) {
			state.historyLists = history
		},
		CLEAR_HISTORY() {
			state.historyLists = []
		},
		SET_USERINFO(state, userinfo) {
			state.userinfo = userinfo
		}
	},
	actions:{
		set_history({commit, state}, history) {
			let list = state.historyLists;
			list.unshift(history)
			uni.setStorageSync("__history", list)
			commit('SET_HISTORY_LIST', list)
		},
		clear_history({commit, state}) {
			uni.removeStorageSync("__history", [])
			commit('CLEAR_HISTORY')
		},
		set_userinfo({commit, state}, userinfo) {
			uni.setStorageSync('USERINFO', userinfo)
			commit('SET_USERINFO', userinfo)
		}
	}
})

export default store