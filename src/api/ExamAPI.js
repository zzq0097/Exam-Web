import request from '../utils/request';

export const login = query => {
    return request({
        url: './login_success.json',
        method: 'get',
        params: query
    });
};