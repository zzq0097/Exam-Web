import request from '../utils/request';

// 考试记录
export const getRecordList = query => { 
    return request({
		url: '/getRecordList',
        method: 'get',
        params: query
    });
};
export const getTestsByRecordId = query => { 
    return request({
		url: '/selectQuestionByRecord',
        method: 'get',
        params: query
    });
};
