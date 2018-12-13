var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You must be logged in");
    res.redirect("/login");
};

middlewareObj.campgroundAuthorisation = function(req,res,next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id,function(err, foundCampground) {
            if(err){
                res.redirect("back");
            }
            if (foundCampground.author.id.equals(req.user._id)) {
                return next();
            } else {
                res.flash("error","Only owner can do this");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error","You must be logged in");
        res.redirect("/login");
    }
};

middlewareObj.commentAuthorisation = function(req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id,function(err, foundComment) {
            if(err){
                res.redirect("back");
            }
            if (foundComment.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error","Only owner can do this")
                res.redirect("back");
            }
        });
    } else {
        req.flash("error","You need to log in")
        res.redirect("/login");
    }
};

module.exports = middlewareObj;


