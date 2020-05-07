import request from '../utils/request';
import qs from 'qs';

export const getPaperToCorrect = query => {
    return request({
        url: '/getPaperToCorrect',
        method: 'get',
        params: query
    });
};

export const submitScore = query => {
    return request({
        url: '/correctObjective',
        method: 'post',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    });
};