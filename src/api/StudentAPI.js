import request from '../utils/request';
import qs from 'qs';

// 用户管理
export const selectStudent = query => { 
    return request({
		url: '/selectStudent',
        method: 'get',
        params: query
    });
};
export const deleteStudent = query => {
    return request({
		url: '/deleteStudent',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateStudent = query => {
    return request({
		url: '/updateStudent',
        method: 'post',
        params: query
    });
};
export const insertStudent = query => {
    return request({
		url: '/insertStudent',
        method: 'post',
        params: query
    });
};