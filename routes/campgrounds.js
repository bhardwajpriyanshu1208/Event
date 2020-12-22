var express = require("express");
var router  = express.Router({mergeParams:true});
var Campgrounds = require("../models/campground");
var middleware = require("../middleware");



router.get("/", function (req, res) {
    // tak all the campgrounds
    Campgrounds.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser:req.user });
        }
    });
});

router.get("/book",  middleware.isLoggedIn, function (req, res) {
    // tak all the campgrounds
            res.render("campgrounds/book", { currentUser:req.user });
});


router.post("/",  middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price:price,image: image, description: desc, author:author }
    req.user 
    // creat new and save to database 
    Campgrounds.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
    // edited : campgrounds.push(newCampground);
});

// new - 
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");

});

// show
router.get("/:id", function (req, res) {
    // find th campground wth the provided id 
    //render show template with that campgound
    //res.send("This wil be a show date one day XDD");
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//edit 

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campgrounds.findById(req.params.id, function (err, foundCampground) {
     res.render("campgrounds/edit", {campground:foundCampground})
    });
});

//update

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // user logged in 
    // find and update the correct id
    Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        }
        else {
            console.log(req.body.campground);
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

});


// delete

router.delete("/:id",  middleware.checkCampgroundOwnership, function(req,res){
   Campgrounds.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }
       res.redirect("/campgrounds");
       
   });
});

//middleware
module.exports = router ;