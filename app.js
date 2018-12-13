var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    seedDB     = require("./seedDB"),
    User       = require("./models/user"),
    expressSession = require("express-session"),
    campPlaces     = require("./models/routes/campPlaces"),
    comment        = require("./models/routes/comments"),
    auth           = require("./models/routes/auth"),
    flash     = require("connect-flash"),
    mongoose  = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(flash());

// seedDB();

//PASSPORT CONFIGURE
console.log( "gmail="+process.env.GMAILPW);

app.use(expressSession({
    secret:"my name is bharat",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    return next();
});

app.use("/campPlaces",campPlaces);
app.use(auth);
app.use("/campPlaces/:id/comments",comment);

app.listen(process.env.PORT,process.env.IP,function () {
    console.log("server has started");
});