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
  , parseQuery = require('./modules/parseQuery');

GLOBAL._ = require('lodash');

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

var chat  =  require("./vendor/model/chat").init(Parse,function(error){
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
  chat.addConnection(user,ws);
  ws.on('message', function(msg) {
    chat.in(user.id,msg,function(answer){
      ws.send(answer);
    });
  });
  ws.on('error', function(msg) {
   // console.log(msg)
  });
  ws.on('close', function() {
    chat.closeConnection(req.query.id);
  });


});

/** Uses Backbone Base **/
app.all('/*',(req, res, next)=>{
  res.isLogged = req.session.user ? true : false;
  next();
});

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

app.route('/projects')
  .get(function ( req, res) {
      parseQuery.getObjects({class: "Project", limit: 8}, function(answer){
        if (answer.result == 'ok') {
          console.log("projects", answer.object);
          res.render('../pages/project_index', {"projects": answer.object});
        } else {
          console.log("getting projects error", answer.error);
          res.json("error");
        }
      });
  })
  .post(function (req, res) { /* inserting new project */
      parseQuery.updateObject({class: "Project", id: req.params.id}, function(answer){
        if (answer.result == 'ok') {
          console.log("updated project", project);
          res.json("got");
        } else {
          console.log("updating projects error", answer.error);
          res.json("error");
        }
      });
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

app.get('/dashboard', (req, res) =>
  res.sendFile(__dirname + 'dist/pages/project_dashboard.html')
);

app.get('/user', (req, res) =>
  res.sendFile(__dirname + '/dist/pages/project_dashboard.html')
);

app.get('/profile-interface', (req, res) =>
  res.sendFile(__dirname + '/dist/pages/user_profile.html')
);

app.route('/profile')
  .get((req, res) => {
    if (res.isLogged)
      parseQuery.getObject({class: "User", id: req.session.user.id},
          (profile)=> {
            res.render('../pages/user_profile', {logged: res.isLogged, profile: profile.object});
            console.log("user", profile)
          },
          (profile)=> {
            res.json('error');
            console.log("user", profile)
          }
      );
    else {
      //res.render('../pages/user_profile');
      res.redirect("/get-started")
    }
  }).post((req, res)=> {
    if (res.isLogged) {
      parseQuery.updateObject({class: "User", id: req.session.user.id, data: req.body},
          (profile)=> {
            //console.log("user up", profile);
            res.json('ok');
          },
          (profile)=> {
            //console.log("user up err", profile);
            res.json('ok');
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
        res.json('ok');
        console.log("user", answer)
      }
  )
);

app.route('/company')
  .get( (req, res) => {
    res.sendFile(__dirname + '/dist/pages/company_profile.html')
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
        res.redirect('/');
        //res.status(200).json({result: 'ok'});
      },
      (loginError) =>
        res.render('../pages/login/login', {error:{result: loginError.error.message, email: req.body.email, pass: req.body.pass}})
    );
  });

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect( '/');
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
      req.session.user = {id: signUpRes.user.answer.id, attributes: signUpRes.user.answer.attributes};
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
