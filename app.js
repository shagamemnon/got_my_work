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
  , Parse = require('parse').Parse;

Parse.initialize(config.parse.appId, config.parse.JSKey, config.parse.MsKey);

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

var path = require('path');
app.configure(function() {
	app.use(express.static(path.join(__dirname, '../dist')));
  //app.use(express.static(__dirname + '/dist'));
});
//app.use(express.static(path.join(__dirname, '../dist')));
//app.use("/dist", express.static(path.join(__dirname, '../dist')));

app.use(express.favicon('./assets/images/favicon.ico'));
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

server.listen(port);
console.log('\nϟϟϟ Serving on port ' + port + ' ϟϟϟ\n');

/** Uses Backbone Base **/

app.get('/', function (req, res) {
  device_path = req.device.type == 'desktop' ? 'desktop' : 'mobile'
  res.sendfile( 'dist/pages/' + device_path + '/landing_page.html' );
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

app.get('/admin', function (req, res) {
  res.sendfile( 'dist/pages/base.html' );
});

// app.get('/settings', function (req, res) {
//   res.sendfile( 'dist/pages/settings.html')
// });

/** Static && Marketing Routes **/
app.get('/how-it-works', function (req, res) {
  res.sendfile( 'dist/pages/how_it_works.html' );
});

app.get('/pricing', function (req, res) {
  res.sendfile( 'dist/pages/pricing.html' );
});

app.get('/about', function (req, res) {
  res.sendfile( 'dist/pages/about.html' );
});

app.get('/terms-of-service', function (req, res) {
  res.sendfile( 'dist/pages/terms_of_service.html' );
});

app.get('/privacy-policy', function (req, res) {
  res.sendfile( 'dist/pages/privacy_policy.html' );
});

app.get('/listing', function ( req, res) {
  res.sendfile( 'dist/pages/project_listing.html')
});

app.get('/contact', function ( req, res) {
  res.sendfile( 'dist/pages/contact.html')
});

//app.get('/projects', function ( req, res) {
//  res.sendfile( 'dist/pages/project_index.html')
//});

app.get('/projects-dashboard', function ( req, res) {
  res.sendfile( 'dist/pages/project_dashboard.html')
});

app.get('/projects', function ( req, res) {
  var Project = Parse.Object.extend("Project"),
    query = new Parse.Query(Project);
  query.limit(8);
  query.find({
    success: function(results){
      var projects = [];
      results.map(function(project) {
        projects.push(project);
      });
      res.render( '../pages/project_index', {"projects": projects});
    },
    error: function(obj, error){
      res.json("error");
      console.log("adding error", error);
    }
  });
});

/* inserting new project */
app.post('/projects', function (req, res) {
  var Project = Parse.Object.extend("Project"),
    query = new Project();
  query.set("Title", req.params.title);
  query.save(null, {
    success: function(project){
      console.log("project", project);
    },
    error: function(obj, error){
      console.log("adding error", error)
    }
  });
  res.json("got");
});

/* project get by id */
app.get('/projects/:id', function ( req, res) {
  var query = new Parse.Query("Project");
  query.get(req.params.id, {
    success: function(project) {
      console.log("project", project);
    },
    error: function(object, error) {
      console.log("getting error", error);
    }
  });
  res.json("got");
});

/* project update by id */
app.put('/projects/:id', function ( req, res) {
  var query = new Parse.Query("Project");
  query.get(req.params.id, {
    success: function(project) {
      project.set("Title", "New");
      project.save({
        success: function(item){
          console.log("project", item);
        },
        error: function(item, error){
          console.log("saving error", error);
        }
      });
    },
    error: function(object, error) {
      console.log("getting error", error);
    }
  });
  res.json("got");
});

/* project delete by id */
app.delete('/projects/:id', function ( req, res) {
  var query = new Parse.Query("Project");
  query.get(req.params.id, {
    success: function(results) {
      results.destroy({
        success: function(project){
          console.log("deleted", project);
        },
        error: function(error){
          console.log("deleting error", error);
        }
      });
    },
    error: function(object, error) {
      console.log("getting error", error);
    }
  });
  res.json("got");
});

app.get('/dashboard', function ( req, res) {
  res.sendfile( 'dist/pages/project_dashboard.html')
});

app.get('/user', function ( req, res) {
  res.sendfile( 'dist/pages/project_dashboard.html')
});

app.get('/profile-interface', function ( req, res) {
  res.sendfile( 'dist/pages/user_profile.html')
});

app.get('/profile/:id', function ( req, res) {
  var query = new Parse.Query(Parse.User);
  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(user) {
      console.log("users", user[0].get('username'));
      res.render('../pages/user_profile', {profile: user});
    },
    error: function(user, error){

    }
  });
});

app.get('/company', function ( req, res) {
  res.sendfile( 'dist/pages/company_profile.html')
});

/* inserting new project */
app.post('/company', function (req, res) {
  var Company = Parse.Object.extend("Company"),
      query = new Company();
  query.set("Name", req.params.name);
  query.save(null, {
    success: function(company){
      console.log("company", company);
    },
    error: function(obj, error){
      console.log("adding error", error)
    }
  });
  res.json("got");
});

/* company get by id */
app.get('/company/:id', function ( req, res) {
  var query = new Parse.Query("Company");
  query.get(req.params.id, {
    success: function(company) {
      console.log("company", company);
    },
    error: function(object, error) {
      console.log("getting error", error);
    }
  });
  res.json("got");
});

/* company update by id */
app.put('/company/:id', function ( req, res) {
  var query = new Parse.Query("Company");
  query.get(req.params.id, {
    success: function(company) {
      project.set("Title", "New");
      project.save({
        success: function(item){
          console.log("company", item);
        },
        error: function(item, error){
          console.log("saving error", error);
        }
      });
    },
    error: function(object, error) {
      console.log("getting error", error);
    }
  });
  res.json("got");
});

/* company delete by id */
app.delete('/company/:id', function ( req, res) {
  var query = new Parse.Query("Company");
  query.get(req.params.id, {
    success: function(results) {
      results.destroy({
        success: function(company){
          console.log("deleted", company);
        },
        error: function(object, error){
          console.log("deleting error", error);
        }
      });
    },
    error: function(object, error) {
      console.log("getting error", error);
    }
  });
  res.json("got");
});

app.get('/get-started', function ( req, res) {
  res.sendfile( 'dist/pages/login/selection.html')
});

app.get('/login', function ( req, res) {
  res.sendfile( 'dist/pages/login/login.html')
});

app.post('/login', function( req, res ){
  Parse.User.enableUnsafeCurrentUser();
  console.log(Parse.User.current());
  Parse.User.logIn(req.body.email, req.body.pass, {
    success: function(user) {
      console.log(user.isCurrent());
      console.log(Parse.User.current());
      res.redirect("/");
    },
    error: function(user, error) {
      console.log("error", error);
      res.sendfile( 'dist/pages/login/login.html')
    }
  });
});

app.get('/signup-company', function ( req, res) {
  res.sendfile( 'dist/pages/login/company.html')
});

app.post('/signup-company', function ( req, res) {
  var user = new Parse.User(),
    Company = Parse.Object.extend("Company"),
    query = new Company();
  query.set("Name", req.body.companyName);

  var stripe = require("stripe")(config.stripe);

  user.set('username', req.body.email);
  user.set('password', req.body.password);
  //user.set('password', req.body.password);
  user.set('email', req.body.email);
  user.set('phone', req.body.phone);
  user.set('fullName', req.body.userName);
  user.set('userRole', "developer");
  user.set('AccountType', "company");

  user.signUp(null, {
    success: function(user) {
      query.set('userId', user.id);
      query.save(null, {
        success: function(company){
          stripe.charges.create({
            amount: config.accounts.company.payment * 100, /* amount should be in cents */
            currency: config.currency,
            source: req.body.stripeToken, // obtained with Stripe.js
            description: "Charge for company account on igotmyworks.com"
          }, function(err, charge) {
            if (!err) {
              console.log(charge);
              query.set('chargeId', charge.id);
              query.set('chargeId', charge.id);
              query.set('chargeId', charge.id);
              res.redirect("/");
            } else {
              res.redirect("/");
            }
          });

        },
        error: function(obj, error){
          res.json({error: error.message});
          console.log("adding company error", error);
        }
      });
    },
    error: function(user, error) {
      console.log("Error: " + error.code + " " + error.message);
      res.json({error: error.message});
    }
  });
});

// app.get('/signup-user', function ( req, res) {
//   res.sendfile( 'dist/pages/login/user.html')
// });

app.post('/signup-user', function ( req, res) {
  var user = new Parse.User();
  user.set('username', req.body.name);
  user.set('password', req.body.pass);
  user.set('email', req.body.email);

  user.signUp(null, {
    success: function(user) {
      res.redirect("/");
    },
    error: function(user, error) {
      console.log("Error: " + error.code + " " + error.message);
      res.json({error: error.message});
    }
  });
});

app.get('/payment', function ( req, res) {
  res.sendfile( 'dist/pages/login/payment.html')
});

app.get('/thanks', function ( req, res) {
  res.sendfile( 'src/pages/thanks.html')
});

// Manager Panel

app.get('/manager-login', function ( req, res) {
  res.sendfile( 'dist/pages/login/manager.html')
});

app.get('/manager-one', function ( req, res) {
  res.sendfile( 'dist/pages/manager/tab1.html')
});

app.get('/manager-two', function ( req, res) {
  res.sendfile( 'dist/pages/manager/tab2.html')
});

app.get('/manager-three', function ( req, res) {
  res.sendfile( 'dist/pages/manager/tab3.html')
});

app.get('/manager-four', function ( req, res) {
  res.sendfile( 'dist/pages/manager/tab4.html')
});

app.get('/manager-five', function ( req, res) {
  res.sendfile( 'dist/pages/manager/tab5.html')
});

app.get('/sales-manager', function ( req, res) {
  res.sendfile( 'dist/pages/manager/sales_manager.html')
});

app.get('/*' , function( req, res, next ) {
    var file = req.params[0];
    res.sendfile( __dirname + '/' + file );
});
