'use strict';
var port = process.env.PORT || 3000
  , express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , qs = require( 'querystring' )
  , favicon = require('serve-favicon')
  , mailer = require('express-mailer')
  , device = require('express-device')
  , bodyParser = require('body-parser')
  , config = require('./config')
  , path = require('path')
  , Parse = require('parse').Parse
  , session = require('express-session')
  , ws = require('express-ws')(app)
  , auth = require('./modules/auth')
  , parseQuery = require('./modules/parseQuery')
  , admin = require('./routes/admin')
  , sales_manager = require('./routes/sales_manager')
  , project_manager = require('./routes/project_manager');

GLOBAL._ = require('lodash');

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

var chat  =  require("./vendor/model/chat").init(function(error){
  console.error('Chat error: ',error)
});

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

var path = require('path');
//app.configure(function() {
//	app.use(express.static(path.join(__dirname, '../dist')));
//  //app.use(express.static(__dirname + '/dist'));
//});

app.use("/dist", express.static(path.join(__dirname, '/dist')));
//app.use("/dist", express.static(path.join(__dirname, '../dist')));

app.use(favicon('./assets/images/favicon.ico'));
app.use( device.capture() );

app.set('views', __dirname + '/src/templates');
app.set('view engine', 'jade');

mailer.extend( app, {
  from: process.env.MAILER_EMAIL,
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASS
  }
});

app.listen(port);
console.log('\nϟϟϟ Serving on port ' + port + ' ϟϟϟ\n');

app.ws('/chatgate/', function(ws, req) {
    if(!req.session || !req.session.user) {
        ws.close();
        return;
    }

    var user = req.session.user;
    if(req.session.isChat) {
        req.session.isChat = false;

        chat.addConnection(user, ws);

        ws.on('message', function (msg) {
            chat.in(user, user.id, msg, function (answer) {
                ws.send(answer, (err)=>{
                    if (!err)
                        req.session.isChat = true;
                });
            });
        });
    }

    ws.on('error', function(msg) {
        // console.log(msg)
    });

    ws.on('close', function() {
        chat.closeConnection(user);
    });

});

/** Uses Backbone Base **/
app.all('/*',(req, res, next)=>{
    res.isLogged = req.session.user ? true : false;
    res.locals.isLogged = res.isLogged;
    req.session.isChat = true;
    next();
});

app.use('/admin', admin);
app.use('/sales-manager', sales_manager);
app.use('/project-manager', project_manager);

app.get('/', (req, res) => {
    let device_path = req.device.type == 'desktop' ? 'desktop' : 'mobile';
    //res.sendFile(__dirname + '/dist/pages/' + device_path + '/landing_page.html' );
    res.render('../pages/' + device_path + '/landing_page', {logged: res.isLogged});
});

app.post('/', function (request, res ) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var POST = qs.parse(body);
            // use POST

            if ( typeof POST.website != 'undefined' ) {
                var subject = 'Website Evaluation';
            } else {
                var subject = POST.name + ' wants to setup a Meeting';
            }

            app.mailer.send( 'email', {
                to: 'frank@mycents.co',
                subject: subject,
                r_email: POST.email,
                r_name: POST.name,
                r_msg: POST.message
            }, function (err) {
                if (err) {
                  console.log(err);
                  res.send('There was an error sending the mail');
                  return;
                }
                res.send('Website Submitted. IGotMyWork will email you within 7 days!');
            })
        });
    }
});

app.get('/admin', (req, res) => 
    res.sendFile(__dirname + '/dist/pages/base.html')
);

app.route('/technologies')
    .get((req, res) => {
        if (res.locals.technologies)
            parseQuery.getObjects({class: "Technologies", sort:{order: "asc", key: "order"}},
                (answer)=>{
                    res.locals.technologies = answer.object;
                    res.render('../pages/technologies', {technologies:GLOBAL.technologies});
                },
                (answer)=>{
                    console.log(answer.error);
                }
            );
        else
            res.render('../pages/technologies', {technologies:res.locals.technologies});
    }).post((req, res)=>{
        /*let arr = JSON.parse(req.body.technologies);
        //let arr = ["Android", "iOS", "C#", "C", "C++", ".NET", "Java", "Ruby", "Python", "Node.js", "PHP", "HTML/CSS", "JavaScript", "E-Commerce", "WordPress & Drupal", "OS X", "Windows", "Systems Infrastructure", "Database Management"]
        let technologies = [];
        arr.forEach((item, index)=> {
            let data = {};
            data['original'] = item;
            data['modified'] =  item.toLowerCase();
            data['order'] = index;
            technologies.push(data);
            if(index == arr.length-1)
                parseQuery.saveObjects({class: "Technologies", data: technologies
                }, (answer)=> {
                    res.json(answer);
                }, (answer)=> {
                    res.json(answer);
                });
        });*/
        let data = req.body.technology;
        parseQuery.addObject({class:"Technologies", data: {original: data, modified: data.toLowerCase(), order: res.locals.technologies.length}},
            (answer)=>{
                res.json(answer);
                console.log(answer);
            },
            (answer)=>{
                res.json(answer);
                console.log(answer);
            }
        )
    });

// app.get('/settings', (req, res) => 
//   res.sendFile( 'dist/pages/settings.html')
// );

/** Static && Marketing Routes **/
app.get('/how-it-works', (req, res) => 
    res.sendFile(__dirname + '/dist/pages/how_it_works.html')
);

app.get('/pricing', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/pricing.html')
);

app.get('/about', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/about.html')
);

app.get('/terms-of-service', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/terms_of_service.html')
);

app.get('/privacy-policy', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/privacy_policy.html')
);

app.get('/listing', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/project_listing.html')
);

app.get('/contact', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/contact.html')
);

app.get('/project_index', function ( req, res) {
    res.sendfile( 'dist/pages/project_index.html')
});

app.get('/projects-dashboard', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/project_dashboard.html')
);

app.route("/search")
    .post((req, res) => {
        let searchString,
            exac = false,
            langSearchVal = [];

        let search = (searchVal, filters) => {

            if( searchVal[0] == "\"" && searchVal[ searchVal.length-1] == "\"") {
                exac = true;
                searchString = searchVal.substring(1, searchVal.length - 1).replace(/[^\w\s]/g, function(str){
                    return "\\" + str;
                });
                langSearchVal.push(searchVal.substring(1, searchVal.length - 1));
            } else {
                searchString = searchVal.replace(/[^\w\s]/g, function(str){
                    return "\\" + str;
                }).replace(/\s/g, "|");
                if (searchVal.split(" ").length > 1)
                    langSearchVal = searchVal.toLowerCase().split(" ");
                else
                    langSearchVal.push(searchVal.toLowerCase());
            }

            //let filter = filters.languages && filters.languages.length != 0 ? [{key: "skills", value: filters.languages, condition: "containsAll"}] : [];

            parseQuery.orGetObject(
                {
                    search: [
                        {
                            class: "Project",
                            filters: [{key: "title", value: searchString, condition: "matches", exac: exac}]
                        },
                        {
                            class: "Project",
                            filters: [{key: "description", value: searchString, condition: "matches", exac: exac}]
                        },
                        {
                            class: "Project",
                            filters: [{key: "skills", value: langSearchVal, condition: "containsAll"}]
                        }
                    ],
                    filters: filters
                },
                (answer) => {
                    res.json(answer);
                },
                (error) => {
                    res.json(error);
                }
            );
        };

        if (req.body.searchVal.length > 0 || req.body.filters != "{}" ) {
            let str = req.body.searchVal.trim();
            if ( req.body.filters == "{}" )
                search(str, []);
            else {
                let filters = setFilters(req.body.filters);
                search(str, filters);
            }
        } else {
            parseQuery.getObjects({class: "Project"},
                (answer) => {
                    var result = answer;
                    res.json(result);
                },
                (answer) => {
                    res.json("error");
                }
            );
        }
    });
app.route('/projects')
    .get((req, res) => {
        let from = req.query.page ? (req.query.page * 8) : 0;
        let printPage = () => {
            let newTech = {};
            (res.locals.technologies).forEach(function(obj){
                newTech[obj.attributes.modified] = obj.attributes.original;
            });
            parseQuery.getObjects({class: "Project", limit: 8, from: from},
                (answer) => {
                    console.log("projects", answer.object);
                    if(req.query.page)
                        res.json(answer);
                    else
                        res.isLogged ? res.render('../pages/project_index', {"projects": answer.object}) : res.render('../pages/project_index', {"projects": answer.object, technologies: newTech});
                },
                (answer) => {
                    console.log("getting projects error", answer.error);
                    res.json("error");
                }
            );
        };
        if (!res.locals.technologies)
            parseQuery.getObjects({class: "Technologies", sort:{order: "asc", key: "order"}},
                (answer)=>{
                    res.locals.technologies = answer.object;
                    printPage();
                },
                (answer)=>{
                    console.log(answer.error);
                }
            );
        else
            printPage();
    })
    .post(function (req, res) { /* inserting new project */
        if(req.body.skills && req.body.skills != "Select Skill Level") {
            let strSkills = req.body.skills,
                arrSkills = strSkills.toLowerCase().split(",");
            arrSkills.forEach((item) => {
                item = item.trim();
            });
            req.body.skills = arrSkills;
        }
        if(typeof req.body["_gotcha"] != 'undefined')
            delete req.body["_gotcha"];
        parseQuery.addObject({class: "Project", data: req.body},
            (answer) => {
                //console.log("inserting project", answer);
                res.json(answer.result);
            },
            (answer) => {
                //console.log("inserting projects error", answer);
                res.json(answer.result);
            }
        );
  });

let setFilters = (obj) => {
    let request = JSON.parse(obj),
        filters = [];
    (Object.keys(request)).forEach((item)=>{
        if(item == "languages") {
            filters.push({key: "skills", value: request[item], condition: "containsAll"});
            return;
        }
        (request[item]).forEach((it)=>{
            if(item == "duration" || item == "rate") {
                switch (it) {
                    case "short":
                        filters.push({key: item, value: 1, condition: "<="});
                        break;
                    case "medium":
                        filters.push({key: item, value: 1, condition: ">"});
                        filters.push({key: item, value: 4, condition: "<="});
                        break;
                    case "long":
                        filters.push({key: item, value: 4, condition: ">"});
                        filters.push({key: item, value: 8, condition: "<="});
                        break;
                    case "longest":
                        filters.push({key: item, value: 8, condition: ">"});
                        break;
                }
            } else {
                filters.push({key: item, value: it, condition: "="});
            }
        });
    });
    return filters;
};


app.route('/projectSearch')
    .post((req,res)=>{
        let filters = setFilters(req.body.filters);
        parseQuery.filterObjects({class:"Project", filters: filters, limit: 8},
            (answer) => {
                res.json(answer);
            },
            (answer) => {
                res.json(answer);
            }
        )
    });


app.route('/projects/:id')
    .get(function ( req, res) { /* project get by id */
        parseQuery.getObject({class:"Project", id: req.params.id}, function(answer){
            if (answer.result == 'ok')
              console.log("project", answer.object);
            else
              console.log("project", answer.error);
        });
    })
    .put(function ( req, res) { /* project update by id */
        parseQuery.updateObject({class: "Project", id: req.params.id, data: req.body}, function(answer){
            if (answer.result == 'ok')
              console.log("project", answer.object);
            else
              console.log("project", answer.error);
        });
    })
    .delete(function ( req, res) { /* project delete by id */
        parseQuery.deleteObject({class:"Project", id: req.params.id}, function(answer){
            if (answer.result == 'ok')
              console.log("project", answer.object);
            else
              console.log("project", answer.error);
        });
    });

app.route('/projectRequyest')
    .get()
    .put((req, res)=> {
        if(!res.isLogged)
            res.status(403).end();
        else
            parseQuery.filterObjects({class: "ProjectRequest", filters: [{key: "projectId", value:req.body.id, condition:"="}, {key: "developerId", value:req.session.user.id, condition:"="}]},
                (answer)=>{
                    if(answer.object.length == 0)
                        parseQuery.addObject({class: "ProjectRequest", data: {developerId: req.session.user.id, projectId: req.body.id}},
                            (answer) =>
                                res.json(answer),
                            (answer) =>
                                res.json(answer)
                        );
                    else
                        res.json({result: "error", error: "You already requested this project"});
                },
                (answer)=>{
                    res.status(404).end();
                }
            );
    });

app.get('/dashboard', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/project_dashboard.html')
);

app.get('/user', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/project_dashboard.html')
);

app.get('/profile-interface', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/user_profile.html')
);

app.route('/profile')
    .get((req, res) => {
        if (res.isLogged && req.session.user.attributes.userRole == "user" && req.session.user.attributes.accountType != "company")
            res.render('../pages/user_profile', {logged: res.isLogged, profile: req.session.user});
        else
            res.redirect("/get-started");
    }).post((req, res)=> {
        if (res.isLogged && req.session.user.attributes.userRole == "user") {
            parseQuery.updateObject({class: "User", id: req.session.user.id, data: req.body},
                (profile)=> {
                    Object.keys(profile.object.attributes).forEach((item) => {
                        req.session.user.attributes[item] = profile.object.attributes[item];
                    });
                    res.json('ok');
                },
                (profile)=> {
                    //console.log("user up err", profile);
                    res.json('error');
                }
            );
        } else {
            //console.log("user post err");
            res.json({error: "error"});
        }
    });

app.get('/profile/:id', (req, res) =>
    parseQuery.getObject({class: "User", id: req.params.id},
        (answer)=>{
            res.json('ok');
            console.log("user", answer)
        },
        (answer)=>{
            res.json('error');
            console.log("user", answer)
        }
    )
);

app.route('/company')
    .get( (req, res) => {
        if (res.isLogged && req.session.user.attributes.userRole == "user" && req.session.user.attributes.accountType == "company") {

            let printPage = () => {
                let newTech = {};
                (res.locals.technologies).forEach(function (obj) {
                    newTech[obj.attributes.modified] = obj.attributes.original;
                });
                res.render('../pages/company_profile', {profile: req.session.user, technologies: newTech});
            };
            if (!res.locals.technologies)
                parseQuery.getObjects({class: "Technologies", sort: {order: "asc", key: "order"}},
                    (answer)=> {
                        res.locals.technologies = answer.object;
                        printPage();
                    },
                    (answer)=> {
                        console.log(answer.error);
                    }
                );
            else
                printPage();

        } else
          res.redirect("/get-started");
        //res.sendFile(__dirname + '/dist/pages/company_profile.html')
    })
    .post( (req, res) => { /* inserting new company */
        parseQuery.addObject({class: "Company", data: req.body},
            (answer) =>
                console.log("company!", answer),
            (answer) =>
                console.log("company?", answer.error)
        );
    });

app.route('/company/:id')
    .get( (req, res) => { /* company get by id */
        parseQuery.getObject({class: "Company", id: req.params.id},
            (answer) =>
              console.log("company", answer.object),
            (answer) =>
              console.log("company", answer.error)
        );
    })
    .put( (req, res) =>/* company update by id */
        parseQuery.updateObject(
            {class: "Company", id: req.params.id, data: req.body},
            (answer)=>{
                res.json('ok');
                console.log("company", answer)
            },
            (answer)=>{
                res.json('error');
                console.log("company", answer)
            }
        )
    )
    .delete( (req, res) => { /* company delete by id */
        parseQuery.deleteObject({class: "Company", id: req.params.id}, (answer) => {
            if (answer.result == 'ok')
              console.log("company", answer.object);
            else
              console.log("company", answer.error);
        });
    });

app.get('/get-started', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/login/selection.html')
);

app.route('/login')
    .get( (req, res) =>
        res.sendFile(__dirname + '/dist/pages/login/login.html')
    )
    .post( (req, res ) => {
        auth.loginUser(req.body,
            (loginRes) => {
                console.log(loginRes);
                req.session.user = { id: loginRes.answer.id, attributes: loginRes.answer.attributes };
                if(loginRes.answer.attributes.accountType == 'company')
                    req.session.user.company = loginRes.answer.company;
                res.redirect('/');
                //res.status(200).json({result: 'ok'});
            },
            (loginError) =>
                res.render('../pages/login/login', {error:{result: loginError.error.message, email: req.body.email, pass: req.body.pass}})
        );
    });

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/signup-user', (req, res) =>
    auth.userSignUp(req.body,
        (signUpRes) => {
            console.log('1', signUpRes);
            req.session.user = {id: signUpRes.answer.id, attributes: signUpRes.answer.attributes};
            res.status(200).json({result: 'ok'});
        },
        (signUpError) => {
            console.log("Error: " + signUpError.error.code + " " + signUpError.error.message);
            res.status(400).send({code: signUpError.error.code, error: signUpError.error.message});
        }
    )
);

app.post('/signup-company', (req, res) =>
    auth.companySignUp(req.body,
        (signUpRes) => {
            console.log(signUpRes);
            req.session.user = {id: signUpRes.user.answer.id, attributes: signUpRes.user.answer.attributes, company: signUpRes.company};
            res.status(200).json({result: 'ok'})
        },
        (signUpError) => {
            console.log("Error: " + signUpError.error.code + " " + signUpError.error.message);
            res.status(400).send({code: signUpError.error.code, error: signUpError.error.message});
        }
    )
);

app.get('/payment', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/login/payment.html')
);

// app.get('/signup-user', function ( req, res) {
//   res.sendfile( 'dist/pages/login/user.html')
// });

app.get('/thanks', (req, res) =>
    res.sendFile(__dirname + '/src/pages/thanks.html')
);

// Manager Panel

app.get('/manager-login', (req, res) =>
    res.sendfile(__dirname + '/dist/pages/login/manager.html')
);

app.get('/manager-one', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/manager/tab1.html')
);

app.get('/manager-two', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/manager/tab2.html')
);

app.get('/manager-three', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/manager/tab3.html')
);

app.get('/manager-four', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/manager/tab4.html')
);

app.get('/manager-five', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/manager/tab5.html')
);

app.get('/sales-manager', (req, res) =>
    res.sendFile(__dirname + '/dist/pages/manager/sales_manager.html')
);

app.get('/*' , (req, res, next) => {
    var file = req.params[0];
    res.sendFile( __dirname + '/' + file );
});
