import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema =new mongoose.Schema({
  email: {
    type: String,
    require: [true, "email is required"],
    unique: true
  },
  password: {
    type: String,
    require: [true, "password is required"]
  },
  firstName: {
    type: String,
    require: false
  },
  lastName: {
    type: String,
    require: false
  },
  image: {
    imageData: {
      type: String,
      required: false
    },
    mimeType: {
      type: String,
      required: false
    }
  },
  color: {
    type: Number,
    require: false
  },
  profileSetup: {
     type: Boolean,
     default: false
  }
});

// bcrypt the password while signup
userSchema.pre('save', async function(next){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);   
    next();    
})



const User = mongoose.model('User', userSchema);

export default User;