$(document).ready(function(){
	'use strict';
	var processor = (function(){
		var messageProcessors = {};
		var events = {};
		var actions  = {};
		var handlers = {};
		return {
			addMessageProcessor : function(name,event){
				messageProcessors[name] = event;
			},
			process : function(msg){
				messageProcessors[msg.type](msg);
			},
			addAction : function(name,action){
				actions[name] = action;
			},
			action : function(name){
				return actions[name].apply(this,Array.prototype.slice.call(arguments, 1));
			},

			//TODO if need added linked list as message container
			addEvent : function(name,event){
				events[name] = event;
			},
			event : function(name){
				events[name].apply(this,Array.prototype.slice.call(arguments, 1))
			},

			handler : function(name,hendler){
				if(hendler == undefined){
					return this.handlers[name];
				} else {
					this.handlers[name] = hendler;
					this.name = hendler;
				}
			}

		}
	}());

	var syncRuner = function(actions){
		var promise = (function(){
			var done;
			return {
				then : function(done){
					this.done = done;
				},
				done : done
			}
		}());
		var counter = actions.length;
		function resolve(){
			if((--counter) == 0)
				promise.done();
		}
		actions.forEach(function(action){
			action(resolve);
		});
		return promise;
	};


	function render(template, map){
		for(var key in map){
			template = template.split('['+key.toUpperCase()+']').join(map[key]);
		}
		return template;
	}
	function timeFormatter(date){
		date =  typeof date !== 'undefined' ?  date : new Date();
		var currentDate = new Date();

		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		var hours = date.getHours();
		var minutes = date.getMinutes();

		var currentDay = currentDate.getDate();
		var currentMonth = currentDate.getMonth()+1;
		var currentYear = currentDate.getFullYear();

		if(year < currentYear){
			return 'more than a year';
		} else if(month < currentMonth){
			return 'more than a month';
		} else if(day <currentDay){
			return 'more than a day'
		} else {
			return hours+':'+minutes+ ', Today';
		}
	}
	function initProcessor(resolve){
		//global
		var contacts = {};

		//in messages
		processor.addMessageProcessor(chat.typeSet.ok,function(){

		});

		processor.addMessageProcessor(chat.typeSet.contacts,function(message){
			message.contacts.forEach(function(item){
				contacts[item.id] = item;
			});
			console.debug('Set contacts', contacts);
			processor.action('show');
			processor.action('addContacts',message.contacts);

		});

		processor.addMessageProcessor(chat.typeSet.contact,function(message){
			if(!contacts[message.id]) {
				contacts[message.id] = message;
				//processor.action('addContact', message);
				processor.action('addContacts', [contacts[message.id]]);
			}
		});

		processor.addMessageProcessor(chat.typeSet.message, function(message){
			contacts[message.senderId].messages.push(message);
			processor.action('addMessage','in',message.content,contacts[message.senderId].name, new Date());
			processor.action('checkUnread', message, contacts);
		});

		processor.addMessageProcessor(chat.typeSet.imSend, function(message){
			var messageObj = message.message;
			processor.action('addMessage', 'out', messageObj.content, undefined, new Date(messageObj.createdAt));
		});

		processor.addMessageProcessor(chat.typeSet.disconnectedContact, function(responce){
			var disconnectedUserId = responce.data;
			processor.action('removeContact', disconnectedUserId);
		});

		processor.addMessageProcessor(chat.typeSet.initialResult, function(responce){
			var success =  responce.success;
			var interlocutorUserId = responce.interlocutorUserId;
			processor.action('initialResult', success, contacts[interlocutorUserId]);
		});

		processor.addMessageProcessor(chat.typeSet.youInterlocutorUser, function(responce){
			var initiatorUser = contacts[responce.initiatorUserId];
			processor.action('youInterlocutorUser', initiatorUser);
		});

		processor.addMessageProcessor(chat.typeSet.cantViewContact, function(response){
			var hideContactId = response.contactId;
			var hideContact = contacts[hideContactId];
			processor.action('hideContact', hideContact);
		});

		//out events
		processor.addEvent('init',function(){
			processor.action('send',new chat.GetContacts());
		});

		processor.addEvent('sendMessage',function(targetId,content){
			processor.action('send',new chat.Send(content,targetId,'-1'));
		});

		//technical
		processor.addEvent('error',function(error){
			console.log(error);
		});

		processor.addEvent('closeConnection',function(event){
			console.log(event);
		});

		processor.addEvent('droppedConnection',function(event){
			console.log(event);
		});

		processor.addAction('getContacts', function(){
			return contacts;
		});

		resolve();
	}

	function communication(resolve){
		var socket = new WebSocket('ws://'+window.location.host+'/chatgate/');
		communication.socket = socket;

		socket.onopen = function() {
			resolve();
		};

		socket.onclose = function(event) {
			if (event.wasClean) {
				processor.event('closeConnection',event)
			} else {
				processor.event('droppedConnection',event)
			}
		};

		socket.onmessage = function(event) {
			var msg = JSON.parse(event.data);
			processor.process(msg);
		};

		socket.onerror = function(error) {
			processor.event('error',error);
		};

		processor.addAction('send',function(msg) {
			socket.send(JSON.stringify(msg));
		});
	}

	communication.initialChat = function(interlocutorUserId){
		if(!interlocutorUserId){
			return false;
		}

		communication.socket.send(JSON.stringify({
			type: chat.typeSet.initial,
			interlocutorUserId: interlocutorUserId
		}));
	};

	communication.closeChat = function(interlocutorUserId){
		if(!interlocutorUserId){
			return false;
		}

		communication.socket.send(JSON.stringify({
			type: chat.typeSet.closeChat,
			interlocutorUserId: interlocutorUserId
		}));
	};


	function initView(resolve){
		var CHAT_PADDING_FOR_SCROLL = 8;
		var currentContact = null;
		var $body = $('body');
		var container;
		var messageTemplate;
		var contactTemplate;

		$.get('/dist/templates/chat/message.html',function(template){messageTemplate = template});
		$.get('/dist/templates/chat/contact.html',function(template){contactTemplate = template});
		$.get('/dist/templates/chat/layout.html',function(layout){
			function switchItem(showed,showedTab,hided,hidedTab){
				showed.show();
				showed.addClass('active');
				hided.hide();
				hided.removeClass('active');
				showedTab.addClass('active');
				hidedTab.removeClass('active');
			}

			function minimaze(){
				container.find('> div.body.active').slideUp('normal',function(){
					tabs.slideUp('fast',function(){
						header.click(openChat);
						minminaze.unbind();
					});
				});
			}

			function openChat(){
				tabs.slideDown('fast',function(){

					if($('div.chat').length != 0)
						$(".tabs").children('.chat').addClass('chatDisabled').removeClass('chat');

					container.find('> div.body.active').slideDown(function(){
						minminaze.click(minimaze);
						header.unbind();
					});

				});
			}

			function chat(){
				function scrollToDown(){
					scroll.recalculate();
					scroller.scrollTop(scroll.getContentElement().height() - scroller.height()+CHAT_PADDING_FOR_SCROLL);
					scroll.flashScrollbar();
				}

				function printMessage(type,content,name,date){
					var item = $(render(messageTemplate, {
						'content': content,
						'name': type == 'out' ? 'You' : name,
						'class': type,
						'time': timeFormatter(date)
					}));
					scroll.getContentElement().append(item);
					scrollToDown();
				}

				var scroll = chatBlock.find('.messages').simplebar({ autoHide: false }).data('simplebar');
				var sendBlock = chatBlock.find('.sendBlock');
				var input = sendBlock.find('textarea');
				var scroller = scroll.getContentElement().parent();

				var infoBlock = chatBlock.find('.infoBlock');
				var contactName = infoBlock.find('.name');
				var contactAvatar = chatBlock.find('.avatar img');

				let shift = false;
				sendBlock.keydown(function(event){
					switch (event.which) {
						case 13: return false;
						case 16: shift = true;
					}
				});
				sendBlock.keyup(function(event){
					let content = input.val();
					switch (event.which) {
						case 13:
							if (!shift) {
								if(content.length){

									processor.event('sendMessage',currentContact.id,input.val().replace(/\n/g, "<br />"));
									$("textarea").val("");
								}
								return false;
							} else{
								let indent = input.val()  + '\n' ;
								input.val(indent);
								return false;
							}
							break;
						case 16: shift = false;
					}
				});

				sendBlock.find('div').click(function(){
					var content = input.val();
					if(content.length){
						//printMessage('out',content);
						processor.event('sendMessage',currentContact.id,input.val());
						$("textarea").val("");

					}
				});

				setTimeout(scrollToDown,0);

				processor.addAction('setContact',function(){
					contactName.text(currentContact.name);
					contactAvatar.attr("src", currentContact.avatar);
					console.log(currentContact);

					if($('div.chatDisabled').length != 0)
						$(".tabs").children('.chatDisabled').addClass('chat').removeClass('chatDisabled');

					currentContact['unreadMessages'] = undefined;
					printUnreadMark();

					currentContact.messages.forEach(function(message){
						if(currentContact.id == message.receiverId) {
							if(message.createdAt != undefined){
								printMessage('out', message.content, undefined, new Date(message.createdAt));
							}
						}
						if(currentContact.id == message.senderId) {
							if(message.createdAt != undefined){
								printMessage('input', message.content, currentContact.name, new Date(message.createdAt));
							}
						}
					});
				});

				processor.addAction('checkUnread', function(message, contacts){
					if(!currentContact) {
						setUnread();
					} else {
						if(currentContact.id === message.senderId) {
							console.log('?????? ?? ??????, ??? ??? ?? ? ??? ??? ?????????????');
						} else {
							setUnread();
						}
					}

					function setUnread(){
						if(contacts[message.senderId]['unreadMessages']){
							contacts[message.senderId]['unreadMessages']++;
						} else {
							contacts[message.senderId]['unreadMessages'] = 1;
						}

						printUnreadMark();
					}
				});

				processor.addAction('addMessage', printMessage);
			}

			function printUnreadMark(){
				var contacts = processor.action('getContacts');

				var unreadMessages = 0;

				for(var index in contacts){
					var contact = contacts[index];

					var scroll = processor.action('getScroll');
					var contactElement = scroll.getContentElement().find('.contact[data-id='+ contact.id +']');
					var unreadMessagesCount = contactElement.find('.unreadMessagesCount');

					if(contact['unreadMessages']){
						unreadMessages += contact['unreadMessages'];
						unreadMessagesCount.css({
							display: 'inline-block'
						}).html(contact['unreadMessages']);
					} else {
						unreadMessagesCount.hide();
					}
				}

				if(unreadMessages) {
					allUnreadMark.show().html(unreadMessages);
				} else {
					allUnreadMark.hide();
				}
			}

			function contacts(){
				processor.addAction('initialResult', function(success, interlocutorUser){
					if(success) {
						currentContact = interlocutorUser;
						processor.action('setContact');
						switchItem(chatBlock,chatTab,contactsBlock,contactsTab);
					} else {
						//TODO ??????? ???????? ?? ?????? ????????????? ???????????????? ???????
						console.info('??????? ???????? ?? ?????? ????????????? ???????????????? ???????');
					}
				});

				processor.addAction('youInterlocutorUser', function(initiatorUser){
					console.log('Initial chat with ', initiatorUser);
					initiatorUser.jQueryElement.show();
					setInitialChatContact(initiatorUser, true);
				});

				processor.addAction('hideContact', function(hideContact){
					hideContact.jQueryElement.hide();
				});

				function calculateInitiatorChatMark(){
					var contacts = processor.action('getContacts');

					var initialChatMarkers = 0;
					for(var contactId in contacts){
						var contact = contacts[contactId];
						if(contact.jQueryElement.find('.initialChatContactMarker').is(':visible')){
							initialChatMarkers++;
						}
					}

					if(initialChatMarkers > 0) {
						allInitialChats.show();
					} else {
						allInitialChats.hide();
					}
					allInitialChats.html(initialChatMarkers);
				}

				function setInitialChatContact(contact, value){
					var initialChatContactMarker = contact.jQueryElement.find('.initialChatContactMarker');

					if(value){
						initialChatContactMarker.show();
					} else {
						initialChatContactMarker.hide();
					}

					calculateInitiatorChatMark();
				}

				function addContact(contact){
					var item = $(render(contactTemplate,{
							img: contact.avatar,
							name: contact.name,
							id: contact.id
						}
					));

					contact.jQueryElement = item;

					item.click(function(){
						setInitialChatContact(contact, false);

						if(currentContact) {
							if(currentContact.id == contact.id){
								return false;
							}
						}

						if(currentContact){
							if(currentContact.id){
								communication.closeChat(currentContact.id);
							}
						}

						communication.initialChat(contact);
					});

					if(!contact.canView) {
						contact.jQueryElement.hide();
					}

					scroll.getContentElement().append(item);
				}

				var scroll = container.find('.contactList').simplebar({ autoHide: false }).data('simplebar');

				processor.addAction('addContacts',function(contacts) {
					contacts.forEach(addContact);
				});

				processor.addAction('addContact',addContact);

				processor.addAction('removeContact', function(contactId){
					var contacts = processor.action('getContacts');
					for(var contactIndex in contacts){
						if(contactId === contacts[contactIndex].id){
							if(contacts[contactIndex].jQueryElement){
								contacts[contactIndex].jQueryElement.remove();
								delete contacts[contactIndex];
							}
						}
					}

					if(currentContact){
						if(currentContact.id == contactId){
							currentContact = undefined;
							switchItem(contactsBlock,contactsTab,chatBlock,chatTab)
						}
					}
					if($('div.chat').length != 0)
						$(".tabs").children('.chat').addClass('chatDisabled').removeClass('chat');
				});

				processor.addAction('getScroll', function(){
					return scroll;
				})
			}
			container = $(layout);
			var tabs = container.find('.tabs');
			var header = container.find('.header');

			var allUnreadMark = header.find('#allUnreadMark');
			var allInitialChats = header.find('#allInitialChats');

			var minminaze = 	header.find('.minimaze');
			minminaze.click(minimaze);
			var chatTab = tabs.find('.chat');
			var contactsTab = tabs.find('.contacts');
			var chatBlock = container.find('.body.chat');
			var contactsBlock = container.find('.body.contacts');
			chatTab.click(function(){
				if($(".tabs").children('.chat').hasClass('chat')){
					switchItem(chatBlock,chatTab,contactsBlock,contactsTab);
				}
			});
			contactsTab.click(function(){switchItem(contactsBlock,contactsTab,chatBlock,chatTab)});
			chat();
			contacts();
			processor.addAction('show',function(){container.show()});
			$body.append(container);
			tabs.hide();
			container.find('> div.body.active').hide();
			header.click(openChat);
			resolve();
		});
	}

	syncRuner([communication,initView,initProcessor]).then(function(){processor.event('init')});
});

