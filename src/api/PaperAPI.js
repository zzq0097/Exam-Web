import request from '../utils/request';
import qs from 'qs';
// 试卷管理
export const selectPaper = query => {
    return request({
		url: '/getPaperList',
        method: 'get',
        params: query
    });
};
export const deletePaper = query => {
    return request({
		url: '/deletePaper',
        method: 'post',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    });
};
export const updatePaper = query => {
    return request({
		url: '/updatePaper',
        method: 'post',
        params: query
    });
};
export const insertPaper = query => {
    return request({
		url: '/formPaper',
        method: 'post',
        data: query
    });
};
export const getTestList = query => {
    return request({
		url: '/getTestList',
        method: 'get',
        params: query
    });
};
export const selectQuestionByPaper = query => {
    return request({
		url: '/selectQuestionByPaper',
        method: 'get',
        params: query
    });
};

export const bigAnalysis = query => {
    return request({
		url: '/largePaper',
        method: 'get',
        params: query
    });
};

export const smallAnalysis = query => {
    return request({
		url: '/insertWord',
        method: 'get',
        params: query
    });
};