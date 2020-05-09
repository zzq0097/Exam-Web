import request from '../utils/request';
import qs from 'qs';

// 授课信息管理
export const selectGetClass = query => { 
    return request({
		url: '/selectGetClass',
        method: 'get',
        params: query
    });
};
export const deleteGetClass = query => {
    return request({
		url: '/deleteGetClass',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateGetClass = query => {
    return request({
		url: '/updateGetClass',
        method: 'post',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    });
};
export const insertGetClass = query => {
    return request({
		url: '/insertGetClass',
        method: 'post',
        params: query
    });
};