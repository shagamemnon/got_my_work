var port = process.env.PORT || 3000
  , express = require('express')
  , app = express()
  , server = require('http').Server(app)
  , qs = require( 'querystring' )
  , favicon = require('serve-favicon')
  , mailer = require('express-mailer')
  , device = require('express-device');

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

app.get('/projects', function ( req, res) {
  res.sendfile( 'dist/pages/project_index.html')
});

app.get('/dashboard', function ( req, res) {
  res.sendfile( 'dist/pages/project_dashboard.html')
});

app.get('/profile', function ( req, res) {
  res.sendfile( 'dist/pages/user_profile.html')
});

app.get('/company', function ( req, res) {
  res.sendfile( 'dist/pages/company_profile.html')
});

app.get('/signup-company', function ( req, res) {
  res.sendfile( 'dist/pages/login/company.html')
});

app.get('/signup-user', function ( req, res) {
  res.sendfile( 'dist/pages/login/user.html')
});

app.get('/signup-manager', function ( req, res) {
  res.sendfile( 'dist/pages/login/manager.html')
});

app.get('/payment', function ( req, res) {
  res.sendfile( 'dist/pages/login/payment.html')
});

app.get('/thanks', function ( req, res) {
  res.sendfile( 'src/pages/thanks.html')
});

app.get('/*' , function( req, res, next ) {
    var file = req.params[0];
    res.sendfile( __dirname + '/' + file );
});
