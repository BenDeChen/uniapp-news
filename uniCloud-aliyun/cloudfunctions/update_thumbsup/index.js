'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	let {
		user_id,
		article_id
	} = event;
	
	const user = await db.collection('user').doc(user_id).get();
	let thumbs_up_article_ids = user.data[0].thumbs_up_article_ids;
	let thumbs_ids = null
	if(thumbs_up_article_ids.includes(article_id)) {
		return {
			code: 200,
			msg: "您已经点赞过了"
		} 
	}else{
		thumbs_ids = dbCmd.addToSet(article_id)
	}
	
	// 添加点赞文章
	await db.collection('user').doc(user_id).update({
		thumbs_up_article_ids: thumbs_ids,
		// thumbs_up_count: 
	})
	// /更新点赞数
	await db.collection('article').doc(article_id).update({
		thumbs_up_count: dbCmd.inc(1)
	})
	//返回数据给客户端
	return {
		code: 200,
		msg:"点赞成功"
	}
};
