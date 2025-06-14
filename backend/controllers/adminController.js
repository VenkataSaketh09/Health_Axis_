import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
//API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
    console.log(imageFile);
    // console.log({name,email,password,speciality,degree,experience,about,available,fees,address},imageFile)
    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageURL = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageURL,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      available:true,
      fees,
      address,
      date: Date.now(),
    };
    const doctorUpload = new doctorModel(doctorData);
    await doctorUpload.save();
    return res
      .json({ success: true, message: "successfully uploaded data" });
  } catch (error) {
    return  res.json({ success: false, message: error.message });
  }
};



const loginAdmin=async(req,res)=>{
  try{
    const {email,password}=req.body
  if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
    const token=jwt.sign(email+password,process.env.JWT_SECRET)
    return  res.json({success:true,token})
  }
  else{
    return  res.json({success:false,message:"invalid credentials"})
  }
  }
  catch(error){
    return  res.json({success:false,message:error.message})
  }
}


//ApI  to get All doctors for admin panel
const AllDoctors=async(req,res)=>{
  try{
    const doctors=await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  }
  catch(error){
    res.json({success:false,message:error.message})
  }
}

export { addDoctor,loginAdmin,AllDoctors };
