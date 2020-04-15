import request from '../utils/request';

// ---------------------------------------- 登录
export const login = query => {
    return request({
        url: '/login',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 获取班级下拉框列表
export const getClassList = query => {
    return request({
		url: '/getClassList',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 获取课程下拉框列表
export const getCourseList = query => {
    return request({  
		url: '/getCourseList',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 获取章节index下拉框列表
export const getChapterList = query => {
	return request({
		url: '/getChapterList',
		method: 'get',
		params: query
	});
};
// ---------------------------------------- 获取黑名单下拉框列表
export const getBlackListTypes = query => {
	return request({
		url: '/getBlackListTypes',
		method: 'get',
		params: query
	});
};
// 老师下拉框
export const teacherOption = query => {
	return request({
		url: '/teacherOption',
		method: 'get',
		params: query
	});
};
export const courseOption = query => {
	return request({
		url: '/courseOption',
		method: 'get',
		params: query
	});
};