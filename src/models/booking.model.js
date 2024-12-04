const mongoose=require('mongoose');


const bookingSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    property:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Property",
        required:true,

    },
    checkInDate:{
        type:Date,
        required:true,
    },
    checkOutDate:{
        type:Date,
        required:true,
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["Pending","Confirmed","Cancelled"],
        default:"Pending",
    },

},{timestamps:true})

module.exports=mongoose.model("Booking",bookingSchema);