(function(exports){
	var  typeSet = {ok:0,message:1,getHistory:2,received:3,history:4,whoami:5,user:6,getContacts:7, contacts: 8};
	exports.typeSet = typeSet;
	exports.struct = {
		User : function(id,name,avatar){
			this.id=id;
			this.name=name;
			this.avatar = avatar;
		}
	};
	exports.Ok = function(){
		this.type = typeSet.ok;
	};
	exports.Send = function(content,receiverId,internalId){
		this.type = typeSet.message;
		this.content = content;
		this.receiverId = receiverId;
		this.internalId = internalId
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
	}
})(typeof exports === 'undefined'? this['chat']={} : exports);
