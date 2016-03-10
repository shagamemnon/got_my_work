'use strict';
module.exports = (function(){
	var protocol = require('../api/chat');
	var dao = require('../../modules/chatHistory');

	var contacts = {};
	var history = {};

	var errorCallback;



	function genInternalId(){
		return (new Date).getTime();
	}

	function store(msg, callback){
		dao.addMessage(msg.content, msg.senderId, msg.receiverId, (message)=>{
			if(!history[msg.receiverId][msg.senderId]) {
				history[msg.receiverId][msg.senderId] = [];
			}
			history[msg.receiverId][msg.senderId].push(msg);

			if(callback){
				callback(message);
			}
		});
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
			dao.getMessages(function(messages){
				console.log(messages);
			});

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
			var result = new protocol.Ok();
			var async = false;
			var msg = JSON.parse(jsMsg);
			msg['senderId'] = id;

			switch (msg.type) {

				case (protocol.typeSet.message): {
					if(send(msg)){
						store(msg, function(message){
							var messageObj = message.object;
							result = new protocol.ImSend(messageObj);
							async = true;
							ok(JSON.stringify(result));
						});
					}
				} break;

				case (protocol.typeSet.received): {
					result = new protocol.Ok();
				} break;

				case (protocol.typeSet.getContacts): {
					dao.getMessages(function(messages){
						var messagesWithMe = [];
						messages.object.forEach(function(message){
							if(message.attributes.receiverId === id || message.attributes.senderId === id) {
								messagesWithMe.push(message);
							}
						});

						var userContacts = _.map(_.filter(contacts,function(obj){return obj.user.id != id}),function(obj){
							var resultMessages = [];
							messagesWithMe.forEach(function(message){
								if(message.attributes.receiverId == obj.user.id || message.attributes.senderId == obj.user.id){
									resultMessages.push(message);
								}
							});
							resultMessages.sort(function(a, b){
								if(a.createdAt > b.createdAt) return 1;
								if(a.createdAt < b.createdAt) return -1;
								if(a.createdAt == b.createdAt) return 0;
							});

							return new protocol.struct.User(obj.user.id,obj.user.fullName,'//', resultMessages);
						});

						result = new  protocol.Contacts(userContacts);
						async = true;
						ok(JSON.stringify(result));
					});
				} break;
			}

			//if(msg.type == protocol.typeSet.message){
			//	if(send(msg)){
			//		store(msg, function(message){
			//			result = new protocol.ImSend(message);
			//			async = true;
			//			ok(JSON.stringify(result));
			//		});
			//	}
            //
			//	//result = new protocol.Ok(message);
			//} else if(msg.type == protocol.typeSet.received){
            //
			//} else if(msg.type == protocol.typeSet.getContacts){
			//	dao.getMessages(function(messages){
			//		var messagesWithMe = [];
			//		messages.object.forEach(function(message){
			//			if(message.attributes.receiverId === id || message.attributes.senderId === id) {
			//				messagesWithMe.push(message);
			//			}
			//		});
            //
			//		var userContacts = _.map(_.filter(contacts,function(obj){return obj.user.id != id}),function(obj){
			//			var resultMessages = [];
			//			messagesWithMe.forEach(function(message){
			//				if(message.attributes.receiverId == obj.user.id || message.attributes.senderId == obj.user.id){
			//					resultMessages.push(message);
			//				}
			//			});
            //
			//			return new protocol.struct.User(obj.user.id,obj.user.fullName,'//', resultMessages);
			//		});
            //
			//		result = new  protocol.Contacts(userContacts);
			//		async = true;
			//		ok(JSON.stringify(result));
			//	});
			//}

			if(!async) {
				ok(JSON.stringify(result));
			}
		},

		closeConnection : function(user){
			var contactUser = contacts[user.id];

			if(contactUser) {
				if(contactUser.connection) {
					contactUser.connection.close();
					contactUser.connection = undefined;
					delete contacts[user.id];
				}
			}

			for(var contactId in contacts) {
				contacts[contactId].connection.send(JSON.stringify(new protocol.DisconnectedContact(user)));
			}
		}

	}

})();
