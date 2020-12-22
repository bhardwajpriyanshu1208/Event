// al the middelware goes here
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error","Campgrounds not found");
                res.redirect("back");
            }
            else {
                // user own the campground if id of user === id of the campground
                // campground.author.id is a object
                // req.user._id is a string 
                if (foundCampground.author.id.equals(req.user._id)) {
                    // it does any of the code 
                    next();
                }
                else {
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back");
                }
            }
        });
    } else {
        // takes to the previous page danummm
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }

}



middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                
                res.redirect("back");
            }
            else {
                // user own the comment if id of user === id of the campground
                // campground.author.id is a object
                // req.user._id is a string 
                if (foundComment.author.id.equals(req.user._id)) {
                    // it does any of the code 
                    next();
                }
                else {
                    req.flash("error","you don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        // takes to the previous page danummm
        res.redirect("back");
    }
}



middlewareObj.isLoggedIn =function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in to do that")
    res.redirect("/login")
 }
 
 module.exports= middlewareObj;