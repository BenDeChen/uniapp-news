const requireApi = require.context(".",false,/.js$/)

let module = {}
requireApi.keys().forEach(key => {
	if(key === 'index.js') {
		return
	}
	Object.assign(module, requireApi(key))
})
export default module;