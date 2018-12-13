var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");


function seed(){
    // delete campgrounds
    Campground.remove({},function (err,removed) {
        if (err) {
            console.log(err);
        } else {
            console.log("campgrounds removed");
            // add campgrounds
//             data.forEach(function (campground) {
//                 Campground.create(campground,function (err,savedCampground) {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log("added campground");
//                         Comment.create({
//                             text:"this place is soo cold",
//                             author:"bharat"
//                         },function (err,addedComment) {
//                             if (err) {
//                                 console.log(err);
//                             } else {
//                                 savedCampground.comments.push(addedComment);
//                                 savedCampground.save();
//                                 console.log("created new comment");
//                             }
//                         });
//                     }
//                 });
//             });
        }
    });
}

module.exports = seed;