(function(exports){
	var  typeSet = {
		ok:0,
		message:1,
		getHistory:2,
		received:3,
		history:4,
		whoami:5,
		user:6,
		getContacts:7,
		contacts: 8,
		contact:9,
		imSend: 10,
		disconnectedContact: 11
	};
	exports.typeSet = typeSet;
	exports.struct = {
		User : function(id,name,avatar, messages){
			this.id=id;
			this.name=name;
			this.avatar = avatar;
			this.messages = messages;
		}
	};
	exports.Ok = function(data){
		this.type = typeSet.ok;
		this.data = data;
	};
	exports.ImSend = function(message){
		this.type = typeSet.imSend;
		this.message = message;
	};
	exports.Send = function(content,receiverId,internalId, message){
		this.type = typeSet.message;
		this.content = content;
		this.receiverId = receiverId;
		this.internalId = internalId;
		this.message = message;
	};
	exports.Received = function(internalId){
		this.type = typeSet.received;
		this.internalId = internalId;
	};
	exports.GetHistory  =  function(internalId){
		this.type = this.type.received;
		this.internalId = internalId;
	};
	exports.Whoami = function(){
		this.type = typeSet.whoami;
	};
	exports.User = function(id,name,avatar){
		this.type = typeSet.User;
		this.name = name;
		this.avatar = avatar;
	};
	exports.GetContacts = function(){
		this.type = typeSet.getContacts;
	};

	exports.Contacts = function(contacts){
		this.type = typeSet.contacts;
		this.contacts = contacts;
	};

	exports.Contact = function(id,name,avatar){
		exports.struct.User.call(this,id,name,avatar);
		this.type = typeSet.contact;
	};

	exports.DisconnectedContact = function(user){
		this.data = user.id;
		this.type = typeSet.disconnectedContact;
	}

})(typeof exports === 'undefined'? this['chat']={} : exports);
