const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required!"],
    },
    email:{
        type:String,
        required:[true,"email is required!"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"password is required!"],
        select:false
    },
    properties:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Property",
        }
    ],
    bookings:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking",
    }
    ],
},{timestamps:true});



userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:"5h",
    });
    return token;
};

userSchema.statics.authenticate=async function(){
    const user=await this.findOne({email}).select("+password");
    if(!user){
        throw new Error("Invalid email or password!");

    }
    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Invalid email or password!");
    }
    return user;
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  module.exports=mongoose.model("User",userSchema);