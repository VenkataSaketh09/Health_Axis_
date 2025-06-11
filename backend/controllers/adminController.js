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
      available,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;
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
      !available ||
      !fees ||
      !address
    ) {
      res.status(400).json({ success: false, message: "Missing Details" });
    }
    //validating email format
    if (!validator.isEmail(email)) {
      res.status(400).json({ success: false, message: "Missing Details" });
    }
    //validating strong password
    if (password.length < 8) {
      res.status(400).json({ success: false, message: "Missing Details" });
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
      available,
      fees,
      address,
      date: Date.now(),
    };
    const doctorUpload = new doctorModel(doctorData);
    await doctorUpload.save();
    return res
      .status(200)
      .json({ success: true, message: "successfully uploaded data" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const loginAdmin=async(req,res)=>{
  try{
    const {email,password}=req.body
  if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
    const token=jwt.sign(email+password,process.env.JWT_SECRET)
    return res.status(200).json({success:true,token})
  }
  else{
    return res.status(400).json({success:false,message:"invalid credentials"})
  }
  }
  catch(error){
    return res.json({success:false,message:error.message})
  }
}

export { addDoctor,loginAdmin };
