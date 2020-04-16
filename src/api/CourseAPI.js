import request from '../utils/request';
import qs from 'qs';

// 课程管理
export const selectCourse = query => {
	return request({
		url: '/selectCourse',
		method: 'get',
		params: query
	});
};
export const listChapter = query => {
	return request({
		url: '/selecthapter',
		method: 'get',
		params: query
	});
};
export const insertCourse = query => {
	return request({
		url: '/insertCourse',
		method: 'post',
		params: query
	});
};
export const updateCourse = query => {
	return request({	
		url: '/updateCourse',
		method: 'post',
		params: query
	});
};
export const deleteCourse = query => {
	return request({	
		url: '/deleteCourse',
		method: 'post',
        params: query,
        paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
	});
};