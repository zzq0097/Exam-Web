import request from '../utils/request';
import qs from 'qs';

// 用户管理
export const selectTeacher = query => { 
    return request({
		url: '/selectTeacher',
        method: 'get',
        params: query
    });
};
export const deleteTeacher = query => {
    return request({
		url: '/deleteTeacher',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateTeacher = query => {
    return request({
		url: '/updateTeacher',
        method: 'post',
        params: query
    });
};
export const insertTeacher = query => {
    return request({
		url: '/insertTeacher',
        method: 'post',
        params: query
    });
};