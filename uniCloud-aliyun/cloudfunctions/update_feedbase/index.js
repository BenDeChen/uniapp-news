'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let {
		user_id,
		feedbackImages = [],
		content=""
	} = event
	await db.collection('feedback').add({
		user_id: user_id,
		feedbackImages: feedbackImages,
		content:content
	})
	//返回数据给客户端
	return {
		code: 200,
		msg:"反馈成功"
	}
};
