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
		url: '/classOption',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 章节下拉框列表
export const getChapterList = query => {
	return request({
		url: '/chapterOption',
		method: 'get',
		params: query
	});
};
// ---------------------------------------- 名单下拉框列表
export const getBlackListTypes = query => {
	return request({
		url: '/getBlackListTypes',
		method: 'get',
		params: query
	});
};
// ---------------------------------------- 老师下拉框
export const teacherOption = query => {
	return request({
		url: '/teacherOption',
		method: 'get',
		params: query
	});
};
// ---------------------------------------- 课程下拉框
export const courseOption = query => {
	return request({
		url: '/courseOption',
		method: 'get',
		params: query
	});
};
// ---------------------------------------- 授课信息下拉框
export const teachOption = query => {
	return request({
		url: '/teachOption',
		method: 'get',
		params: query
	});
};