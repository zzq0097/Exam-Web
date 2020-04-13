import request from '../utils/request';
import qs from 'qs';

// 课程管理
export const listChapter = query => {
	return request({
		url: '/listChapter',
		method: 'get',
		params: query
	});
};
export const insertChapter = query => {
	return request({
		url: '/insertChapter',
		method: 'post',
		params: query
	});
};
export const updateChapter = query => {
	return request({	
		url: '/updateChapter',
		method: 'post',
		params: query
	});
};
export const deleteChapter = query => {
	return request({	
		url: '/deleteChapter',
		method: 'delete',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
	});
};