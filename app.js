const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const User = require('./models/user');

app.use(session({

    name:'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// DATABASE CONNECTION
const dbUrl = 'mongodb://127.0.0.1:27017/community-connect';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error',console.error.bind(console, "connection error"));
db.once('open',() => {
    console.log("Database connected");
})


app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use((req,res,next) => {
    
    res.locals.currentUser = req.user;
    next()
})

const Community = require('./models/community');
// Home Endpoint
app.get('/', async (req,res) => {

    const communities = await Community.find({});
    res.render('home',{communities});
})

// Community Endpoints
const communityRoutes = require('./routes/community');
app.use('/community',communityRoutes);


//User EndPoints
const userRoutes = require('./routes/user');
app.use('/user',userRoutes);


app.listen(3000, () => {
    console.log("Serving on port 3000");
})