
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
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const {Server} = require("socket.io");
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const io = new Server(server);

const User = require('./models/user');
const Post =require('./models/post');
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
// Local strategy
passport.use(new LocalStrategy(User.authenticate()));
// GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/user/login/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({
                githubId: profile.id,
                username: profile.username,
                profileUrl: profile.profileUrl,
                avatarUrl: profile._json.avatar_url
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));
// Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/user/login/google/callback"
  },
  async (token, tokenSecret, profile, done) => {
      try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
              user = new User({
                  googleId: profile.id,
                  username: profile.displayName,
                  profileUrl: profile._json.url,
                  avatarUrl: profile.photos[0].value
              });
              await user.save();
          }
          return done(null, user);
      } catch (err) {
          return done(err, null);
      }
}));

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
app.get('/test2',(req,res)=>{
    res.render('test2');
})
// Home Endpoint
app.get('/',async (req,res) => {

    const communities = await Community.find({}).populate('posts')
    if(req.user){
        const userId=req.user._id;
        const user=await User.findById(userId).populate({
            path : 'followings',
            populate : {
                path : 'posts'
            }
        })
        res.render('home',{communities,user});
    }
    else{
        res.render('home',{communities});
    }
})

app.get('/test', (req,res) => {
    res.render('test');
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

//Password Reseting Endpoints
const resetPasswordRoutes = require('./routes/resetPassword');
const { upvote, downvote } = require('./controllers/post');
app.use('/user',resetPasswordRoutes);

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

    socket.on('acceptRequest',async (userId,communityId) => {
        
        const user = await User.findById(userId);
        const community = await Community.findById(communityId);

        community.followers.push(userId);
        user.followings.push(communityId);

        community.requests = community.requests.filter(request => request.toString() !== userId.toString());

        // console.log(community);

        await community.save();
        await user.save();

    })

    socket.on('sendRequest',async(userId,communityId) => {

        const community = await Community.findById(communityId);
        await community.requests.push(userId);

        // console.log(community);

        await community.save();
    })

    socket.on('upvote',async(postId,userId)=>{
        const post = await Post.findById(postId);
        const userUpvoted = post.upvotes.includes(userId);

        if (userUpvoted) {
            post.upvotes = post.upvotes.filter(upvote => upvote.toString() !== userId.toString());
        } else {
            post.upvotes.push(userId);
        }

        await post.save();
        const upvoteCount=post.upvotes.length;
        io.emit('upvoteCount',upvoteCount,postId,userId);
    })
    socket.on('downvote',async(postId,userId)=>{
        const post = await Post.findById(postId);
        const userDownvoted = post.downvotes.includes(userId);

        if (userDownvoted) {
            post.downvotes = post.downvotes.filter(downvote => downvote.toString() !== userId.toString());
        } else {
            post.downvotes.push(userId);
        }

        await post.save();
        const downvoteCount=post.downvotes.length;
        io.emit('downvoteCount',downvoteCount,postId,userId);
    })
});

server.listen(3000, () => {
    console.log("Serving on port 3000");
})
