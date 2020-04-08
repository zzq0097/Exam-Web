import request from '../utils/request';

export const getPaperToCorrect = query => {
    return request({
        url: '/getPaperToCorrect',
        method: 'get',
        params: query
    });
};