var express = require("express"),
    Campground = require("../campground"),
    Comment    = require("../comment"),
    middleware = require("../../middleware");
var router = express.Router({mergeParams:true});

router.get("/new",middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id,function (err,campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("newComment",{campground:campground});
        }
    });
});

router.post("/",middleware.isLoggedIn, function (req,res) {
    Comment.create(req.body.comment,function (err,addedComment) {
        if (err) {
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        } else {
            Campground.findById(req.params.id,function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    addedComment.author.id = req.user._id;
                    addedComment.author.username = req.user.username;
                    addedComment.save();
                    campground.comments.push(addedComment);
                    campground.save();
                    res.redirect("/campPlaces/"+ req.params.id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit",middleware.commentAuthorisation,function (req,res) {
    Comment.findById(req.params.comment_id,function (err,foundcomment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("updateComment",{campground_id:req.params.id,foundcomment:foundcomment});
        }
    });
});

router.put("/:comment_id",middleware.commentAuthorisation,function (req,res) {
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedComment) {
       if (err) {
           console.log(err);
           req.flash("error","Something went wrong");
           res.redirect("back");
       } else {
           req.flash("success","You edited your comment");
           res.redirect("/campPlaces/"+req.params.id);
       }
   });
});

router.delete("/:comment_id",middleware.commentAuthorisation,function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id,function (err) {
        if(err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            req.flash("success","You deleted a comment");
            res.redirect("/campPlaces/"+req.params.id);
        }
    });
});

 module.exports = router;