var express =require("express"),
    Campground = require("../campground"),
    middleware = require("../../middleware");
    
var router = express.Router();

router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds",{places:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds",{places:allCampgrounds, noMatch: noMatch});
           }
        });
    }
});

router.get("/new",function(req, res) {
   res.render("new") 
});


router.post("/",middleware.isLoggedIn,function (req,res) {
   var name = req.body.place;
   var url = req.body.url;
   var desc = req.body.desc;
   var author = {
       id:req.user._id,
       username:req.user.username
   };
   
   var newground = {name:name,url:url,description:desc,author:author};
   Campground.create(newground,
   function (err,place) {
       if(err){
           console.log(err);
           req.flash("error","Something went wrong");
       }else{
           req.flash("success","You created a campground");
           res.redirect("/campPlaces");
       }
   });
});

router.get("/:id",function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function (err,place) {
       if (err) {
           console.log(err);
       }else{
           res.render("show",{places:place});
       }
   });
});
   
router.get("/:id/edit",middleware.campgroundAuthorisation,function(req, res) {
        Campground.findById(req.params.id,function (err,foundCampground) {
            if (err) {
                console.log(err);
            } else {
                    res.render("update",{campground:foundCampground});
                }
        });
});

router.put("/:id",middleware.campgroundAuthorisation,function (req,res) {
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,campground) {
        if (err) {
            console.log(err);
                req.flash("error","Something went wrong");
                res.redirect("back");
        } else {
            req.flash("success","You edit this campground");
            res.redirect("/campPlaces/"+req.params.id);
        }
    });
});

router.delete("/:id",middleware.campgroundAuthorisation,function (req,res) {
    Campground.findByIdAndRemove(req.params.id,function (err) {
        if(err){
            console.log(err);
                req.flash("error","Something went wrong");
                res.redirect("back");
        }
        req.flash("success","Campground deleted successfully");
        res.redirect("/campPlaces");
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


 module.exports = router;