import request from '../utils/request';
import qs from 'qs';


// 学生查询
export const selectStudent = query => { 
    return request({
		url: '/selectStudent',
        method: 'get',
        params: query
    });
};
// 教师查询
export const selectTeacher = query => { 
    return request({
		url: '/selectTeacher',
        method: 'get',
        params: query
    });
};
// 管理员查询
export const selectAdmin = query => { 
    return request({
		url: '/selectAdmin',
        method: 'get',
        params: query
    });
};
// 公用增删改
export const deleteUser = query => {
    return request({
		url: '/deleteUser',
        method: 'post',
        params: query,
		paramsSerializer: params => {
			return qs.stringify(params, { indices: false })
		}
    })
};
export const updateUser = query => {
    return request({
		url: '/updateUser',
        method: 'post',
        params: query
    });
};
export const insertUser = query => {
    return request({
		url: '/insertUser',
        method: 'post',
        params: query
    });
};