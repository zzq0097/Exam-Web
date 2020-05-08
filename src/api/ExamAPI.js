import request from '../utils/request';

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
        data: query
    });
};