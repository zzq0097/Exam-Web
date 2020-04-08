import request from '../utils/request';
import qs from 'qs';

// 班级管理
export const selectClass = query => { 
    return request({
		url: '/selectClass',
        method: 'get',
        params: query
    });
};
export const deleteClass = query => {
    return request({
		url: '/deleteClass',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateClass = query => {
    return request({
		url: '/updateClass',
        method: 'put',
        params: query
    });
};
export const insertClass = query => {
    return request({
		url: '/insertClass',
        method: 'post',
        params: query
    });
};