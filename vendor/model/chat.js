'use strict';
module.exports = (function(){
	var protocol = require('../api/chat');
	var dao = require('../../modules/chatHistory');
	var UserRole = require('../UserRole.js');

	var contacts = {};

	var history = {};
	var initialChats = [];
	//initialChats.push({
	//	receiverId: '...',
	//	senderId: '...'
	//});

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

			msg.id = message.object.id;
			msg.createdAt = message.object.createdAt;
			msg.updatedAt = message.object.updatedAt;

			if(callback){
				callback(msg);
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
			//dao.getMessages(function(messages){
			//	console.log(messages);
			//});

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


			var canView = true;/*UserRole.canViewContact(contacts[id], contacts[item.user.id]);*/
			var userForContact = new protocol.Contact(item.user.id,item.user.fullName,item.user.avatar, canView, item.user.userRole, item.user.accountType);
			dao.getMessages({id: user.id, limit: 100, page: 1}, function(messages) {
				var messagesConnectedContact = [];
				messages.object.forEach(function (message) {
					if (message.attributes.receiverId === user.id || message.attributes.senderId === user.id) {
						messagesConnectedContact.push(message);
					}
				});

				_.forEach(contacts, function (contact) {
					if (contact.user.id != user.id) {
						canView = UserRole.canViewContact(contacts[contact.user.id], contacts[user.id]);
						userForContact.canView = canView;

						var resultMessages = [];

						messagesConnectedContact.forEach(function (message) {
							if (message.attributes.receiverId == contact.user.id || message.attributes.senderId == contact.user.id) {
								resultMessages.push(message);
							}
						});
						//resultMessages.sort(function (a, b) {
						//	if (a.createdAt > b.createdAt) return 1;
						//	if (a.createdAt < b.createdAt) return -1;
						//	if (a.createdAt == b.createdAt) return 0;
						//});
						userForContact.messages = resultMessages;

						contact.connection.send(JSON.stringify(userForContact));

						//dao.getMessages(function (messages) {
						//	var messagesWithMe = [];
						//	messages.object.forEach(function (message) {
						//		if (message.attributes.receiverId === id || message.attributes.senderId === id) {
						//			messagesWithMe.push(message);
						//		}
						//	});
						//
						//	var userContacts = _.map(_.filter(contacts, function (obj) {
						//		return obj.user.id != id
						//	}), function (obj) {
						//		var resultMessages = [];
						//		messagesWithMe.forEach(function (message) {
						//			if (message.attributes.receiverId == obj.user.id || message.attributes.senderId == obj.user.id) {
						//				resultMessages.push(message);
						//			}
						//		});
						//		resultMessages.sort(function (a, b) {
						//			if (a.createdAt > b.createdAt) return 1;
						//			if (a.createdAt < b.createdAt) return -1;
						//			if (a.createdAt == b.createdAt) return 0;
						//		});
						//
						//		var canView = UserRole.canViewContact(contacts[id], contacts[obj.user.id]);
						//
						//		return new protocol.struct.User(obj.user.id, obj.user.fullName, obj.user.avatar, canView, resultMessages);
						//	});
						//});
					}
				});
			});
		},
		in : function(user, id, jsMsg, ok){
			var canInitial = true;
			var count = 0;
			var result = new protocol.Ok();
			var async = false;
			var msg = JSON.parse(jsMsg);
			msg['senderObject'] = user;
			msg['senderId'] = id;
			var initiatorId = id;
			var interlocutorId;
			if(msg.interlocutorUserId != undefined) interlocutorId = msg.interlocutorUserId.id;
			function  addInitChat(initiatorUserId, interlocutorUserId){
				initialChats.push({
					initiatorUserId: initiatorUserId,
					interlocutorUserId: interlocutorUserId
				});
			}

			switch (msg.type) {

				case (protocol.typeSet.initial): {
					//canInitial = UserRole.canInitialChat(contacts[initiatorId], contacts[interlocutorId]);
					canInitial = UserRole.canInitialChat(msg.senderObject.attributes, msg.interlocutorUserId);
					if(initialChats.length>0){

						for(var i = 0; i < initialChats.length; i++){
							if(initialChats[i].initiatorUserId == interlocutorId && initialChats[i].interlocutorUserId == initiatorId ){
								console.log("true");
								result = new protocol.InitialResult(true, interlocutorId);
							} else{
								result = new protocol.InitialResult(canInitial, interlocutorId);
							}
						}
					} else{
						result = new protocol.InitialResult(canInitial, interlocutorId);
					}

					var find = false;
					initialChats.forEach(function(initialChat){
						if(initialChat.initiatorUserId == initiatorId && initialChat.interlocutorUserId == interlocutorId){
							find = true;
						}
					});
					if(!find) {
						if(canInitial == true && initialChats.length > 0){
							initialChats.forEach(function(initIdForAdding, initialChatsForAdding) {
								if (initiatorId == initIdForAdding.initiatorUserId) {
									initialChats.forEach(function (initId, initialChatsForUpdate) {
										console.log("initId[i]: " + initId.initiatorUserId);
										if (initiatorId == initId.initiatorUserId) {
											initId.interlocutorUserId = interlocutorId;
										}
									});
								} else if(initiatorId != initIdForAdding.initiatorUserId && initiatorId != initIdForAdding.interlocutorUserId) {
									count++;
									if(count == initialChats.length) {
										addInitChat(initiatorId, interlocutorId);
									}
								}
							});
						}
						else if(canInitial == true){
							addInitChat(initiatorId, interlocutorId);
						}
						//addInitChat(initiatorId, interlocutorId);
					}
					contacts[interlocutorId].connection.send(JSON.stringify(new protocol.YouInterlocutorUser(initiatorId)));
				} break;

				case (protocol.typeSet.closeChat): {
					if(!UserRole.canViewContact(contacts[interlocutorId], contacts[initiatorId])){
						if(contacts[interlocutorId]){
							if(contacts[interlocutorId].connection){
								contacts[interlocutorId].connection.send(JSON.stringify(new protocol.CantViewContact(initiatorId)));
							}
						}
					}
				} break;

				case (protocol.typeSet.message): {
					if(send(msg)){
						store(msg, function(message){
							result = new protocol.ImSend(message);
							async = true;
							ok(JSON.stringify(result));
						});
					}
				} break;

				case (protocol.typeSet.received): {
					result = new protocol.Ok();
				} break;

				case (protocol.typeSet.getContacts): {
					dao.getMessages({id: id, limit: 100, page: 1}, function(messages){
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
							//resultMessages.sort(function(a, b){
							//	if(a.createdAt > b.createdAt) return 1;
							//	if(a.createdAt < b.createdAt) return -1;
							//	if(a.createdAt == b.createdAt) return 0;
							//});

							var canView = UserRole.canViewContact(contacts[id], contacts[obj.user.id]);

							return new protocol.struct.User(obj.user.id,obj.user.fullName, obj.user.avatar, canView, obj.user.userRole, obj.user.accountType, resultMessages);
						});

						result = new  protocol.Contacts(userContacts);
						async = true;
						ok(JSON.stringify(result));
					});
				} break;
			}

			if(!async) {
				ok(JSON.stringify(result));
			}
		},

		closeConnection : function(user){
			var contactUser = contacts[user.id];
			if(contactUser) {
				if(initialChats.length>0){
					for(var i = 0; i<initialChats.length; i++){
						if(initialChats[i].initiatorUserId == user.id){
							initialChats.splice(i, 1);
						}
					}
				}
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
