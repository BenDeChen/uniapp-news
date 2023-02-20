'use strict';
const db = uniCloud.database();
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id
	} = event
	if(!user_id) {
		return {
			code: 201,
			mag:"获取用户失败"
		}
	}
	const userInfo = await db.collection('user').doc(user_id).get()
	
	
	//返回数据给客户端
	return {
		code: 200,
		data: userInfo.data[0]
	}
};
