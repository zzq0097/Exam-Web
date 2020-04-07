import request from '../utils/request';
import qs from 'qs';

// ---------------------------------------- 用户管理
export const getUserInfo = query => { 
    return request({
		url: '/selectUser',
        method: 'get',
        params: query
    });
};
export const deleteUser = query => {
    return request({
		url: '/deleteUser',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateUser = query => {
    return request({
		url: '/updateUser',
        method: 'put',
        params: query
    });
};
export const insertUser = query => {
    return request({
		url: '/insertUser',
        method: 'post',
        params: query
    });
};