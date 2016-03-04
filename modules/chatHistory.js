'use strict';

var parse = require('../modules/parseQuery');
const doc = 'ChatHistory';
exports.addMessage = function(content,senderId,receiverId,done){
    parse.addObject({
        'class' : doc,
        'content' : content,
        'senderId' : senderId,
        'receiverId' : receiverId
    },done,(error)=>console.log(error));
};
exports.getMessages = function(done){
    parse.getObjects({
        'class' : doc
    },done,(error)=>console.log(error));
};
