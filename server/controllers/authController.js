import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import multer from 'multer'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// create token function
const createToken = async (email, userId) =>{
   return await jwt.sign({email, userId}, process.env.JWT_SECRET_KEY, {expiresIn: '3d'});
} 

// signup controller
export const signupController = async(req, res, next) =>{
     try {
      const { email, password } = req.body;
      if(!email || !password){
         return res.status(400).send("Email or Password field can't be empty")
      }

      const user = await User.create({
         email, password
      })

      return res.status(201).send({
      success: true,
      msg: "user created successfully",
      user: {
         id: user.id,
         email: user.email,
         profileSetup: user.profileSetup
         }
      })
        
     } catch (error) {
      console.log(error);     
        return res.status(500).send({
           success: false,
           msg: "error while creating user",
           error
        })
     }
}


// login controller
export const loginController = async (req, res) => {
   try {
      const { email, password } = req.body;
      if(!email || !password){
         return res.status(400).send({
            success: false,
            message: "Email or Password field can't be empty"
         })
      }

      const user = await User.findOne({
         email
      })

      if(!user){
          return res.status(404).send({
             success: false,
             message: "User not found with this email"
             
          })
      }
      const hashedPassword = user?.password
      const isMatched = await bcrypt.compare(password,hashedPassword)
      
      if(!isMatched){
         return res.status(400).send({
             success: false,
             message: "incorrect password"
         })
      }
      res.cookie("jwt", await createToken(email, user.id),{
          maxAge: 3 * 24 * 60 * 60 * 1000,
          secure: true,
          sameSite: "None"
      })
      return res.status(200).send({
      success: true,
      msg: "successfully logged in",
      user: {
         id: user.id,
         email: user.email,
         profileSetup: user.profileSetup,
         firstName: user.firstName,
         lastName: user.lastName,
         color: user.color,
         image: user.image
         }
      })
        
     } catch (error) {
      console.log(error);     
        return res.status(500).send({
           success: false,
           msg: "error while creating user",
           error
        })
     }
}

// get user info
export const getUserInfoController = async(req, res) => {
    try {      
      const user = await User.findById(req.user.userId).select('-password');
      if(!user){
         return res.status(404).send({
            success: false,
            message: "user not found with the given userId"
         })
      }
      return res.status(200).send({
         success: true,
         message: "user profile fetched successful",
         user
      })     
    } catch (error) {
       return res.status(500).send({
         success: false,
         error
       })
    }
}

// update-profile controller
export const updateProfileController = async (req, res) => {
    try {
      const { firstName, lastName, color } = req.body;
      if(!firstName || !lastName ) {
         return res.status(400).send({
            success: false,
            message: "For profile update, firstName and lastname is required"
         })
      }
      const user = await User.findByIdAndUpdate(req.user.userId, { firstName, lastName, color, profileSetup: true }, {new: true, runValidators: true}).select('-password')
      return res.status(200).send({
         success: true,
         message: "user profile updated successful",
         user
      })
      
    } catch (error) {
      return res.status(500).send({
         success: false,
         message: "error while updating profile",
         error
      })
    }
}

// upload profile image controller
export const uploadImageController = async (req, res) => {
     try {      
         const image = req.file;
         const { userId } = req.user;                  
         if(!userId){
            return res.status(404).send({
               success: false,
               message: "user not found, userId missing"
            })
         }
         const base64Image = await image.buffer.toString('base64');
         const imageData = {
            imageData: base64Image,
            mimeType: req.file.mimetype
         }
         
         const user = await User.findByIdAndUpdate(userId, {image:  imageData  }, {new: true, runValidators: true }).select('-password');
         return res.status(200).send({
            success: true,
            message: "profile image upload successful",
            user
         })      
     } catch (error) {
         return res.status(500).send({
            success: false,
            message: "error while updating profile photo",
            error
         })
     }
}

//get-profile-photo controller
export const getProfilePhotoController = async(req, res) => {
    try {
      const { userId } = req.user;
      if(!userId){
         return res.status(404).send({
            success: false,
            message: "user not found, userId missing"
         })
      }
      const base64Image = await User.findById(userId).select('image')
      return res.status(200).send({
         success: true,
         message: "profile-photo fetched succesful",
         base64Image
      })
      
    } catch (error) {
      return res.status(500).send({
         success: false,
         message: "error while fetching  profile photo",
         error
      })
    }
}


// delete profile image
export const deleteProfileImageController = async (req, res )=> {
   try {
      const { userId } = req.user;
      if(!userId){
         return res.status(404).send({
            success: false,
            message: "user not found, userId missing"
         })
      }
      const user = await User.findByIdAndUpdate(userId, { image: {imageData: "", mimeType: ""}},  { new: true }).select('-password')
      return res.status(200).send({
         success: true,
         message: "profile-photo removed successful",
         user
      })
      
   } catch (error) {
      return res.status(500).send({
         success: false,
         message: "error while deleting  profile photo",
         error
      })
   }
}

