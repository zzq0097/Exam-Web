import request from '../utils/request';
import qs from 'qs';

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

// ---------------------------------------- 章节管理
export const listChapter = query => {
	return request({
		url: '/listChapter',
		method: 'get',
		params: query
	});
};
export const insertChapter = query => {
	return request({
		url: '/insertChapter',
		method: 'post',
		params: query
	});
};
export const updateChapter = query => {
	return request({	
		url: '/updateChapter',
		method: 'post',
		params: query
	});
};
// selectTestByCourse 
export const getPaper = query => {
    return request({
		url: '/getPaperList',
        method: 'get',
        params: query
    });
};
export const getCourse = query => {
    return request({
        url: './course.json',
        method: 'get',
        params: query
    });
};
export const getTeachingInfo = query => {
    return request({
        url: './teaching_info.json',
        method: 'get',
        params: query
    });
};
// ---------------------------------------- 试题管理
export const getTestLib = query => {
    return request({
		url: '/selectQuestion',
        method: 'get',
        params: query
    });
};

export const getPaperToCorrect = query => {
    return request({
        url: './correct_paper.json',
        method: 'get',
        params: query
    });
};