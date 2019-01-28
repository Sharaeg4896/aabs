var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./models/user');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var request = require('superagent');



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

app.use(express.static("public"));

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

// route for home page
app.get('/', sessionChecker, (req , res) => {
    res.redirect('/login');
});

// route for sign up page
app.route('/signup')
    .get((req, res) => {
        // res.sendFile(__dirname + '/public/signup.html');
        res.render('signup', hbsContent);
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            password: req.body.password
        }).then(user => {
            req.session.user = user.dataValues;
            res.redirect('./login');
        })
        .catch(error => {
            console.log(error);
            res.redirect('/signup');
        });
    });

// route for login page 
app.route('/login')
    .get((req, res) => {
        
        res.render('login', hbsContent);
    })
    .post((req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({ where: {username: username} 
        }).then(function (user) {
            console.log(user);
            if(!user) {
                console.log('User not found');
                res.redirect('/login');
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
        // res.render('form', hbsContent);
        res.render('form', hbsContent);
    } else{
        res.redirect('/login');
    }
});


// route for provider search info
app.get('/results', (req, res) => {
    console.log(req.query);
    console.log('CPT: ', req.query.cpt);
    console.log('City: ', req.query.city);
    console.log('hit')
    request
        .get("https://data.cms.gov/resource/4hzz-sw77.json?nppes_provider_city=" + req.query.city + "&hcpcs_code=" + req.query.cpt + "&$order=average_medicare_allowed_amt")
        .query('$limit=10')
        .query('$$app_token=FySBuoMt6fWdfjNhCEnX93Lq3')
        .end(function(err, response) {
            if(req.session.user && req.cookies.user_sid){
                hbsContent.loggedin = true;
                hbsContent.userName = req.session.user.username;
                hbsContent.title = 'You are logged in';
                response.body.forEach((monty, index) => {
                    console.log('index: ', index);
                    console.log('monty prop: ', monty.nppes_provider_last_org_name);

                })
                res.render('results', {
                    information: response.body
                });
            } else{
                res.redirect('/login');
            }
        });
    
    
});

// route for user saved searches
app.get('/savedProvInfo', (req, res) => {
    if(req.session.user && req.cookies.user_sid){
        hbsContent.loggedin = true;
        hbsContent.userName = req.session.user.username;
        hbsContent.title = 'You are logged in';
        res.sendFile(__dirname + '/public/saved.html');
    } else{
        res.redirect('/login');
    }
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
        res.redirect('/login');
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't locate that on site.");

});

app.listen(app.get('port'), () => console.log('App started on port'));





