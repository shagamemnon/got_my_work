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
				actions[name].apply(this,Array.prototype.slice.call(arguments, 1));
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


	function render(template,map){
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
		var contacts={};
		//in messages
		processor.addMessageProcessor(chat.typeSet.ok,function(){

		});
		processor.addMessageProcessor(chat.typeSet.contacts,function(message){
			message.contacts.forEach(function(item){
				contacts[item.id] = item;
				contacts[item.id].messages = [];
			});
			processor.action('show');
			processor.action('addContacts',message.contacts);

		});
		processor.addMessageProcessor(chat.typeSet.contact,function(message){
			if(!contacts[message.id]) {
				contacts[message.id] = message;
				contacts[message.id].messages = [];
				processor.action('addContact', message);
			}

		});
		processor.addMessageProcessor(chat.typeSet.message,function(message){
			contacts[message.senderId].messages.push(message);
			processor.action('addMessage','in',message.content,contacts[message.senderId].name,new Date());

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

		resolve();
	}

	function communication(resolve){
		var socket = new WebSocket('ws://'+window.location.host+'/chatgate/');
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
						'name': type=='out' ? 'You' : name,
						'class': type,
						'time': type=='out'? timeFormatter() :timeFormatter(date)
					}))
					scroll.getContentElement().append(item);
					scrollToDown();
				}

				var scroll = chatBlock.find('.messages').simplebar({ autoHide: false }).data('simplebar');
				var sendBlock = chatBlock.find('.sendBlock');
				var input = sendBlock.find('textarea');
				var scroller = scroll.getContentElement().parent();

				var infoBlock = chatBlock.find('.infoBlock');
				var contactName = infoBlock.find('.name');

				sendBlock.find('div').click(function(){
					var content = input.val();
					if(content.length){
						printMessage('out',content);
						processor.event('sendMessage',currentContact.id,input.val());

					}
				});
				setTimeout(scrollToDown,0);
				processor.addAction('setContact',function(){
					contactName.text(currentContact.name);
				});

				processor.addAction('addMessage',printMessage);
			}
			function contacts(){
				function addContact(contact){
					var item = $(render(contactTemplate,{'img':'http://findicons.com/files/icons/1072/face_avatars/300/a05.png','name':contact.name,'msg':JSON.stringify(contact)}));
					item.click(function(){
						currentContact = contact;
						processor.action('setContact');
						switchItem(chatBlock,chatTab,contactsBlock,contactsTab);
					});
					scroll.getContentElement().append(item);
				}

				var scroll = container.find('.contactList').simplebar({ autoHide: false }).data('simplebar');
				processor.addAction('addContacts',function(contacts) {
					contacts.forEach(addContact);
				});
				processor.addAction('addContact',addContact);
			}
			container = $(layout);
			var tabs = container.find('.tabs');
			var header = container.find('.header');
			var minminaze = 	header.find('.minimaze');
			minminaze.click(minimaze);
			var chatTab = tabs.find('.chat');
			var contactsTab = tabs.find('.contacts');
			var chatBlock = container.find('.body.chat');
			var contactsBlock = container.find('.body.contacts');
			chatTab.click(function(){switchItem(chatBlock,chatTab,contactsBlock,contactsTab)});
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

