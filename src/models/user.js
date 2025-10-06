const mongoose=require('mongoose');
const validator=require('validator');

const userSchema= new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
        },
        lastName:{
            type:String
        },
        emailId:{
            type:String,
            lowercase:true,
            required:true,
            unique:true,
            trim:true,
            validate(value){
                if(!validator.isEmail(value))
                {
                    throw new Error("Email Address is not Valid");
                }
            }
        },
        password:{
            type:String,
            required:true,
            validate(value){
                if(!validator.isStrongPassword(value))
                {
                    throw new Error("Password is not Strong");
                }
            }
        },
        age:{
            type:Number
        },
        gender:{
            type:String,
            validate(value){
                if(!["male","female","others"].includes(value))
                {
                    throw new Error("Gender is not Valid");
                }
            }
        },
        about:{
            type:String,
            default:"This is default about of user",
        },
        photoUrl:{
            type:String,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDUQzT2PsvB_pMVPVdPjrg7OiOoa2awVp6uQpZpi-DZZH0MwCerEG4aCDyi0PNe3xEd_I&usqp=CAU",
        },
        skills:{
            type:[String],
        }

    },{timestamps:true}
);
module.exports=mongoose.model("User",userSchema);