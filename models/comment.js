var mongoose = require("mongoose"),
    Comment = require("./user");

var commentSchema = new mongoose.Schema({
    text:String,
    author:{
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User"
                },
                username:String
            }
});

module.exports = mongoose.model("comment",commentSchema);