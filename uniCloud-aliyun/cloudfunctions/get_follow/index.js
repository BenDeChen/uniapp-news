'use strict';
const db = uniCloud.database();
const $ = db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let {
		user_id
	} = event
	
	let user  = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	
	const list = await db.collection('article')
	.aggregate()
	.addFields({
		is_like: $.in(['$_id', user.article_likes_ids])
	})
	.project({
		content: false
	})
	.match({
		is_like: true
	})
	.end()
	//返回数据给客户端
	return {
		code: 200,
		data:list.data
	}
};
