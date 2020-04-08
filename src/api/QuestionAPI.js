import request from '../utils/request';
import qs from 'qs';

// 试题管理
export const selectQuestion = query => {
    return request({
		url: '/selectQuestion',
        method: 'get',
        params: query
    });
};
export const deleteQuestion = query => {
    return request({
		url: '/deleteQuestion',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateQuestion = query => {
    return request({
		url: '/updateQuestion',
        method: 'put',
        params: query
    });
};
export const insertQuestion = query => {
    return request({
		url: '/insertQuestion',
        method: 'post',
        params: query
    });
};