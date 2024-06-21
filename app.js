
if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}


const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const {Server} = require("socket.io");
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const io = new Server(server);

const User = require('./models/user');
const { isLoggedIn } = require('./middleware');

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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next) => {
    
    res.locals.currentUser = req.user;
    next()
})

const Community = require('./models/community');
// Home Endpoint
app.get('/',isLoggedIn,async (req,res) => {

    const userId=req.user._id;
    const communities = await Community.find({});
    const user=await User.findById(userId).populate({
        path : 'followings',
        populate : {
            path : 'posts'
        }
    })
    res.render('home',{communities,user});
})

// Community Endpoints
const communityRoutes = require('./routes/community');
app.use('/community',communityRoutes);

//chat Endpoints
const chatRoutes = require('./routes/chat');
app.use('/community/:id',chatRoutes);

//User EndPoints
const userRoutes = require('./routes/user');
app.use('/user',userRoutes);

//Post Endpoints
const postRoutes = require('./routes/post');
app.use('/community/:id',postRoutes);

app.use((err,req,res,next)=>{
    
    const {message,statusCode=500}=err;
    if(!message) err.message="Something unusual happened !! ";
    res.status(statusCode).send(message);
})

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log("Serving on port 3000");
})