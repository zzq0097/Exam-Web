import request from '../utils/request';

export const getPaper = query => {
    return request({
		url: '/getPaperList',
        method: 'get',
        params: query
    });
};