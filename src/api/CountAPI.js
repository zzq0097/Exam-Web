import request from '../utils/request';

// 课程管理
export const userCount = query => {
	return request({
		url: '/userCount',
		method: 'get',
		params: query
	});
};
export const paperCount = query => {
	return request({
		url: '/paperCount',
		method: 'get',
		params: query
	});
};
export const recordCount = query => {
	return request({
		url: '/recordCount',
		method: 'get',
		params: query
	});
};