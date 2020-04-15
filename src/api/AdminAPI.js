import request from '../utils/request';
import qs from 'qs';

// 用户管理
export const selectAdmin = query => { 
    return request({
		url: '/selectAdmin',
        method: 'get',
        params: query
    });
};
export const deleteAdmin = query => {
    return request({
		url: '/deleteAdmin',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateAdmin = query => {
    return request({
		url: '/updateAdmin',
        method: 'post',
        params: query
    });
};
export const insertAdmin = query => {
    return request({
		url: '/insertAdmin',
        method: 'post',
        params: query
    });
};