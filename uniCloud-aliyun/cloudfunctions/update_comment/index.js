'use strict';
const db = uniCloud.database()
const dbCmd = db.command
const $ = db.command.aggregate;
exports.main = async (event, context) => {
	let {
		user_id, //用户id
		article_id, // 文章ID
		content, // 评论内容
		comment_id='', // 评论id
		reply_id = "", //评论子回复的 id
		is_reply = false, //是否是子回复
	} = event
	
	let user = await db.collection('user').doc(user_id).get();
	user = user.data[0];
	const article= await db.collection('article').doc(article_id).get();
	const comments = article.data[0].comments
	let commentObj = {
		comment_id: genID(5), //评论id
		comment_content: content, //评论内容
		create_time:new Date().getTime(), // 创建时间
		is_reply: is_reply,
		author:{
			author_id:user._id, // 作者id
			author_name: user.author_name, // 作者名称
			avatar: user.avatar, // 作者头像
			professional: user.professional, // 专业
		},
		replys:[], // 回复
	}
	if(comment_id === '') {
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	}else{
		// 回复评论
		// 找到要评论的那条
		let commentIndex = comments.findIndex(item => item.comment_id===comment_id)
		
		let commentAuthor = null
		if(is_reply) {
			// 子回复
			// 找到评论的子回复的那条
			commentAuthor = comments[commentIndex].replys.find(item => item.comment_id === reply_id)
		}else{
			commentAuthor = comments.find(item => item.comment_id===comment_id)
		}
		commentAuthor = commentAuthor.author.author_name;
		commentObj.to = commentAuthor
		commentObj = {
			[commentIndex] : {
				replys: dbCmd.unshift(commentObj)
			}
		}
	}
	await db.collection('article').doc(article_id).update({
		comments: commentObj
	})
	//返回数据给客户端
	return {
		code: 200,
		msg:"数据更新成功"
	}
};

function genID(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}