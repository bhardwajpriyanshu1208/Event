//const campground = require("./models/campground");

var passportLocalMongoose = require("passport-local-mongoose"),
    express = require('express'),
    mongoose = require("mongoose"),
    app = express(),
    flash = require("connect-flash");
    LocalStrategy = require("passport-local"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    Campgrounds = require("./models/campground"),
    Comment = require("./models/comment"),
    methodOverride = require("method-override");

const { Router } = require("express");
 var  commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds");
      indexRoutes = require("./routes/index");
//Comment =require("./models/user");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/yelp_camp");
// seed the data base seedDB();



// dry up the code it affects all of the 

app.use(flash());

// passpoer configuration
app.use(require("express-session")({
    secret: "Xavier is a Web Developer",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
// var campgrounds = [
//     { name: "Salmon Creek", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Granite Hill", image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Mountain Goat's rest", image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Jolathan hills", image: "https://images.unsplash.com/photo-1438786657495-640937046d18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Salmon Creek", image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Granite Hill", image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Mountain Goat's rest", image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
//     { name: "Jolathan hills", image: "https://images.unsplash.com/photo-1438786657495-640937046d18?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" }
// ]

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(3000, function () {
    console.log("Event Mania Server is started");
});