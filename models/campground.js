var mongoose = require("mongoose");
// like a class declaration 

var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    price:String,
    description: String,
    author:{
        id:{
           type: mongoose.Schema.Types.ObjectId,
           ref:"User"
        },
        username:String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"  
        }
    ]
});

// like a create a object of class type campgroundsSchema
module.exports = mongoose.model("Campground", campgroundsSchema);