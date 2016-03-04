'use strict'
module.exports = (function(){
	var protocol = require('../api/chat');
	var dao = require('../../modules/chatHistory');

	var contacts = {};
	var history = {};

	var errorCallback;



	function genInternalId(){
		return (new Date).getTime();
	}

	function store(msg){
		dao.addMessage(msg.senderId,msg.receiverId,msg.content,()=>{});
		if(history[msg.receiverId][msg.senderId]) history[msg.receiverId][msg.senderId] = [];
		history[msg.receiverId][msg.senderId].push(msg);
	}


	function send(msg){
		var senderId = msg['senderId'];
		var receiverId = msg['receiverId'];
		var receiver = contacts[receiverId];
		if(receiver) {
			receiver.connection.send(JSON.stringify(msg));
			return true;
		}
		return false;
	}
	return{
		init : function(error){
			errorCallback = error;
			return this;
		},
		addConnection : function(user,connection){
			var item = contacts[user.id];
			if(!item){
				contacts[user.id] = {};
				item = contacts[user.id];
				item.user = null;
				item.connection = null;
				item.chats = [];
				history[user.id] = {};
			}
			if(item.connection) item.connection.close();
			item.user = user.attributes;
			item.user.id = user.id;
			item.connection = connection;

			var userForContact = JSON.stringify(new protocol.Contact(item.user.id,item.user.fullName,'//'));
			_.forEach(contacts,function(contact){
				if(contact.user.id != user.id)
					contact.connection.send(userForContact)
			});
		},
		in : function(id,jsMsg,ok){
			var result = '';
			var msg = JSON.parse(jsMsg);
			msg['senderId'] = id;
			if(msg.type == protocol.typeSet.message){
				if(send(msg))store(msg);

				result = new protocol.Ok();
			} else if(msg.type == protocol.typeSet.received){

			} else if(msg.type == protocol.typeSet.getContacts){
				 var userContacts = _.map(_.filter(contacts,function(obj){return obj.user.id != id}),function(obj){

					return new protocol.struct.User(obj.user.id,obj.user.fullName,'//');
				});
				result = new  protocol.Contacts(userContacts);
			}
			ok(JSON.stringify(result));

		},
		closeConnection : function(id){

			if(contacts[id] && contacts[id].connection) {
				contacts[id].connection.close();
				contacts[id].connection = null;
				contacts[id] = null;
			}
		}
	}
})();
