'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		name,
		page = 1,
		pageSize = 10,
		user_id
	} = event;
	let matchObj = {}
	if (name !== '全部') {
		matchObj = {
			classify: name
		}
	}
	const userinfo = await db.collection('user').doc(user_id).get();
	const article_likes_ids = userinfo.data[0].article_likes_ids
	const list = await db.collection('article')
		.aggregate()
		.addFields({
			is_like: $.in(['$_id',article_likes_ids])
		})
		.match(matchObj)
		.project({
			content: false
		})
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end()
	//返回数据给客户端
	return {
		code: 200,
		data: list.data
	}
};
