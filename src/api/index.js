import request from '../utils/request';
const ServerUrl = 'http://nu50abw.hn3.mofasuidao.cn/exam';

// ---------------------------------------- 登录
export const login = query => {
    return request({
        url: './login_success.json',
		// url: ServerUrl+'',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 获取班级下拉框列表
export const getClassList = query => {
    return request({
        // url: './user.json',
		url: ServerUrl+'/getClassList',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 获取课程下拉框列表
export const getCourseList = query => {
    return request({
        // url: './user.json',
		url: ServerUrl+'/getCourseList',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 获取章节下拉框列表
export const getChapterList = query => {
	return request({
		// url: './user.json',
		url: ServerUrl+'/getChapterList',
		method: 'get',
		params: query
	});
};
// ---------------------------------------- 用户管理
export const getUserInfo = query => { 
    return request({
        // url: './user.json',
		url: ServerUrl+'/selectUser',
        method: 'get',
        params: query
    });
};
export const deleteUser = query => {
    return request({
        // url: './user.json',
		url: ServerUrl+'/deleteUser',
        method: 'delete',
        params: query,
    });
};
export const updateUser = query => {
    return request({
        // url: './user.json',
		url: ServerUrl+'/updateUser',
        method: 'put',
        params: query
    });
};
export const insertUser = query => {
    return request({
        // url: './user.json',
		url: ServerUrl+'/insertUser',
        method: 'post',
        params: query
    });
};
// selectTestByCourse 
export const getPaper = query => {
    return request({
        url: './paper.json',
		// url: ServerUrl+'',
        method: 'get',
        params: query
    });
};

export const getCourse = query => {
    return request({
        url: './course.json',
		// url: ServerUrl+'',
        method: 'get',
        params: query
    });
};

export const getTeachingInfo = query => {
    return request({
        url: './teaching_info.json',
		// url: ServerUrl+'',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 试题管理
export const getTestLib = query => {
    return request({
        // url: './test_lib.json',
		url: ServerUrl+'/selectQuestion',
        method: 'get',
        params: query
    });
};

export const getPaperToCorrect = query => {
    return request({
        url: './correct_paper.json',
		// url: ServerUrl+'',
        method: 'get',
        params: query
    });
};