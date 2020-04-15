import request from '../utils/request';
import qs from 'qs';

// 授课信息管理
export const selectTeachInfo = query => { 
    return request({
		url: '/selectTeachInfo',
        method: 'get',
        params: query
    });
};
export const deleteTeachInfo = query => {
    return request({
		url: '/deleteTeachInfo',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateTeachInfo = query => {
    return request({
		url: '/updateTeachInfo',
        method: 'put',
        params: query
    });
};
export const insertTeachInfo = query => {
    return request({
		url: '/insertTeachInfo',
        method: 'post',
        params: query
    });
};