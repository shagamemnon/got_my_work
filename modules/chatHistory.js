'use strict';

var parse = require('../modules/parseQuery');
const doc = 'ChatHistory';
exports.addMessage = function(content,senderId,receiverId,done){
    parse.addObject({
        'class' : doc,
        'data' : {
            'class' : doc,
            'content' : content,
            'senderId' : senderId,
            'receiverId' : receiverId
        }
    },done,(error)=>console.log(error));
};
exports.getMessages = function(params, done){
    if(!params.page)
        params.page = 1;
    parse.orGetObject({
        'class' : doc,
        'filters': [
            {
                'condition' : '=',
                'key' : 'senderId',
                'value' : params.id
            },
            {
                'condition' : '=',
                'key' : 'receiverId',
                'value' : params.id
            }
        ],
        'sort' : {
            'order' : 'desc',
            'key' : 'createdAt'
        },
        'limit' : params.limit,
        'from' : (params.page != 1) ? params.limit * (params.page - 1) : 0
    }, done, (error)=>console.log(error));
};