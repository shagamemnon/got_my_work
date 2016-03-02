module.exports = (function(){
	var protocol = require('../api/chat');
	var parse= null;
	var constants = {doc:'ChatHistory'};
	var contacts = {}

	var errorCallback;



	function genInternalId(){
		return (new Date).getTime();
	}

	function store(msg){
		var historyItem =  parse.Object(constants.doc);
		historyItem.set('content',msg.content);
		historyItem.set('senderId',msg.senderId);
		historyItem.set('receiverId',msg.receiverId);
		historyItem.save(null, {
			success: function(result){
				//TODO do somethings
			},
			error: function(obj, error){
				errorCallback(error);
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
		init : function(o,error){
			parse = o;
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
			}
			if(item.connection) item.connection.close();
			item.user = user;
			item.connection = connection;
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

					return new protocol.struct.User(obj.user.id,obj.user.attributes.fullName,'//');
				});
				result = new  protocol.Contacts(userContacts);
			}
			ok(JSON.stringify(result));

		},
		closeConnection : function(id){

			if(contacts[id] && contacts[id].connection) {
				contacts[id].connection.close();
				contacts[id].connection = null;
				constants[id] = null;
			}
		}
	}
})();
