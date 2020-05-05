import request from '../utils/request';
import qs from 'qs';

export const selectClassByPaper = query => {
    return request({
        url: '/selectClassByPaperid',
        method: 'get',
        params: query
    });
};

export const selectEverQues = query => {
    return request({
        url: '/selectEverQues',
        method: 'get',
        params: query
    });
};

export const selectAverage = query => {
    return request({
        url: '/selectAverage',
        method: 'get',
        params: query
    });
};

export const selectSpread = query => {
    return request({
        url: '/selectSpread',
        method: 'get',
        params: query
    });
};

export const getAllPaper = query => {
    return request({
        url: '/getAllPaper',
        method: 'get',
        params: query
    });
};

export const getLineChart = query => {
    return request({
        url: '/line_chart',
        method: 'get',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    });
};