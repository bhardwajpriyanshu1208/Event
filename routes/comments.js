var express = require("express");
var router  = express.Router({mergeParams:true});
var Campgrounds = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ================================
// comments routes
// ================================

// const router = require("./campgrounds");

router.get("/new",  middleware.isLoggedIn, function (req, res) {
    Campgrounds.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { campground: campground });
        }

    });

});

router.post("/",  middleware.isLoggedIn, function (req, res) {
    // look up camp using id 
    Campgrounds.findById(req.params.id, function (err, campground) {
        if (err) { //console.log(err);
            res.redirect("/campgrounds")
        }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error","Something went wrong");
                    //console.log(err);
                }
                else {
                    // add user name and id to comments
                    comment.author.id = req.user._id ;
                    comment.author.username= req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    req.flash("success","Successfully added comments");

                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });// create new commecn  // connect new coomment to cmp // redirect to show page of the same id 
});

// edit comments route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    });
});


// update comments orute
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComments){
        if(err){ 
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id ,function(err){
    if(err){
       res.redirect("back");
    }
    else{
        req.flash("success","Comment Deleted");
    res.redirect("/campgrounds/"+ req.params.id);
    }
    });
});




module.exports = router ;