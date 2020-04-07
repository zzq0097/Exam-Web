import request from '../utils/request';
import qs from 'qs';

export const selectBlackList = query => {
    return request({
        url: '/selectBlackList',
        method: 'get',
        params: query
    });
};
export const updateBlackList = query => {
    return request({
        url: '/updateBlackList',
        method: 'get',
        params: query
    });
};
export const deleteBlackList = query => {
    return request({
        url: '/deleteBlackList',
        method: 'get',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    });
};
export const insertBlackList = query => {
    return request({
        url: '/insertBlackList',
        method: 'get',
        params: query
    });
};