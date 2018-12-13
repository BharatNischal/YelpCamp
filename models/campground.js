var mongoose = require("mongoose"),
    User     = require("./user");
var campgroundSchema = new mongoose.Schema({
    name:String,
    url:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            rel:User
        },
        username:String
    },
    comments:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"comment"
                }
        ]
});


module.exports = mongoose.model("campground",campgroundSchema);
