// dependencies required
var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./models/user');
var SavedSearches = require('./models/savedSearches');
var Scans = require('./models/scans')
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('superagent');


// initializing express server
var app = express();
app.set('port', 8080);
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// static html and css 
app.use(express.static("public"));

// handlebars setup 
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout'}));
app.set('view engine', 'hbs');


// if browser=alive but server=dead.. clears cookie info in browser
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user){
        res.clearCookie('user_sid')
    }
    next();
    
});

// content to display for logged users 
var hbsContent = {userName: '', loggedin: false, title: 'You are not logged in', body: 'Hello!' };

// if user can log in redirects to form page
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/form');
    } else {
        next();
    }
};

app.get('/', sessionChecker, (req , res) => {
    res.redirect('/signup');
});

// route for sign up page
app.route('/signup')
    .get((req, res) => {
    
        res.render('signup', hbsContent);
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            password: req.body.password
        }).then(user => {
            req.session.user = user.dataValues;
            res.redirect('/login');
        })
        .catch(error => {
            console.log(error);
            res.redirect('/signup');
        });
    });

// route for login page 
app.route('/login')
    .get((req, res) => {
        
        res.render('index', hbsContent);
    })
    .post((req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({ where: {username: username} 
        }).then(function (user) {
            console.log(user);
            if(!user) {
                console.log('User not found');
                res.redirect('/signup');
            } else if (user.validPassword(password)) {
                req.session.user = user.dataValues;
                res.redirect('/form');
            } else {
                console.log('Password is incorrect')
                res.redirect('/login');
            }
    });
});


// route for form page
app.get('/form', (req, res) => {
    if(req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = true;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = 'You are logged in';
        res.render('form', hbsContent)
    } else{
        res.redirect('/login');
    }
});

app.get("/api/:scan", function(req, res) {
    console.log(req.params.scan)
    if (req.params.scan){
        Scans.findAll({
            where : {
                type: req.params.scan
            }
        }).then(function(choices) {
          
          res.json(choices);
        });
    } 

  });
    

// route for provider search info
app.get('/results', (req, res) => {
    console.log(req.query);
    console.log('CPT: ', req.query.cpt);
    console.log('City: ', req.query.city);
    console.log('cptClick: ', req.query.cptCode);
    
    if (req.query.cpt) {
        console.log('first if condi')
        request
        .get("https://data.cms.gov/resource/4hzz-sw77.json?nppes_provider_city=" + req.query.city + "&hcpcs_code=" + req.query.cpt + "&$order=average_medicare_allowed_amt")
        .query('$limit=10')
        .query('$$app_token=FySBuoMt6fWdfjNhCEnX93Lq3')
        .end(function(err, response) {
            if(req.session.user && req.cookies.user_sid){
                hbsContent.loggedin = true;
                hbsContent.userName = req.session.user.username;
                hbsContent.title = 'You are logged in';
                
                res.render('results', {
                    information: response.body
                });
            } 
        });
    } else {
        console.log('second if condi');
        request
        .get("https://data.cms.gov/resource/4hzz-sw77.json?nppes_provider_city=" + req.query.city + "&hcpcs_code=" + req.query.cptCode + "&$order=average_medicare_allowed_amt")
        .query('$limit=10')
        .query('$$app_token=FySBuoMt6fWdfjNhCEnX93Lq3')
        .end(function(err, response) {
            if(req.session.user && req.cookies.user_sid){
                hbsContent.loggedin = true;
                hbsContent.userName = req.session.user.username;
                hbsContent.title = 'You are logged in';
                
                res.render('results', {
                    information: response.body
                });
            } 
        });
    }
    
    
});


// Saved searches route for saving user searches
app.post('/savedSearches', (req, res) => {
    console.log("USER: " + req.session.user.username);
    var sessionname = req.session.user.username;
    var username = sessionname.toString();
    console.log(sessionname)
    console.log(username);

    SavedSearches.create({
        cpt: req.body.cpt,
        userName: username,
        providerName: req.body.providerName,
        providerAddress: req.body.providerAddress,
        providerCharged: req.body.providerCharged,
        medicareAllowed: req.body.medicareAllowed,
        medicarePaid: req.body.medicarePaid,
        nationalAverage: req.body.nationalAverage 
        }).then((result) => {
            res.json(result);
        });
});

// Get saved searches
app.get('/savedSearches', (req, res) => {
    var sessionname = req.session.user.username;
    var username = sessionname.toString();
    // console.log("User name:" + username);

    SavedSearches.findAll({
        where: {
            userName: username
        }
      }).then(function(response) {
        console.log("Results: " + response[0])
        res.render('saved', {
            information: response
        });
        // res.json(savedResults);
      });
    
    
});

// DELETE route for deleting a provider 
app.delete('/savedSearches/:id', (req, res) => {
    let deleteRecord = req.params.id;
    console.log(deleteRecord)

    SavedSearches.destroy({
        where: {
            id: deleteRecord
        }
    }).then ((result) => {
        res.json(result);
    });

});

// route to log out
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        hbsContent.loggedin = false;
        hbsContent.title = 'You are logged out';
        res.clearCookie('user_sid');
        console.log(JSON.stringify(hbsContent));
        res.redirect('/');
    }else {
        res.render('index', hbsContent);
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't locate that on site.");

});

app.listen(app.get('port'), () => console.log('App started on port'));





