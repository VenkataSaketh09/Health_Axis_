import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import {v2 as cloudinary} from "cloudinary";
//API to register user
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      image,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      address,
      city,
      state,
      zipCode,
      country,
      medicalConditions,
      allergies,
      medications,
      emergencyContactName,
      emergencyContactNumber,
      familyDoctor,
      agreeTerms,
      agreePrivacy,
      healthNotifications,
    } = req.body;

    // Validation checks
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password (minimum 8 characters)",
      });
    }

    if (!validator.isMobilePhone(phone)) {
      return res.json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (
      !dateOfBirth ||
      !gender ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      return res.json({
        success: false,
        message: "Please fill all required personal information",
      });
    }

    if (!validator.isDate(dateOfBirth)) {
      return res.json({
        success: false,
        message: "Please enter a valid date of birth",
      });
    }

    if (!["male", "female", "other", "prefer-not-to-say"].includes(gender)) {
      return res.json({
        success: false,
        message: "Please select a valid gender",
      });
    }

    if (
      bloodGroup &&
      !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodGroup)
    ) {
      return res.json({
        success: false,
        message: "Please select a valid blood group",
      });
    }

    if (!agreeTerms || !agreePrivacy) {
      return res.json({
        success: false,
        message: "Please agree to terms and privacy policy",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingUser) {
      return res.json({
        success: false,
        message:
          existingUser.email === email
            ? "User already exists with this email"
            : "User already exists with this phone number",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user data object
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      city,
      state,
      zipCode,
      country,
      agreeTerms: Boolean(agreeTerms),
      agreePrivacy: Boolean(agreePrivacy),
    };

    // Add optional fields if provided
    // if (image) userData.image = image;
    if (bloodGroup) userData.bloodGroup = bloodGroup;
    if (height) userData.height = Number(height);
    if (weight) userData.weight = Number(weight);
    if (medicalConditions) userData.medicalConditions = medicalConditions;
    if (allergies) userData.allergies = allergies;
    if (medications) userData.medications = medications;
    if (emergencyContactName)
      userData.emergencyContactName = emergencyContactName;
    if (emergencyContactNumber)
      userData.emergencyContactNumber = emergencyContactNumber;
    if (familyDoctor) userData.familyDoctor = familyDoctor;
    if (healthNotifications !== undefined)
      userData.healthNotifications = Boolean(healthNotifications);

    // Create new user
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please enter email and password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, user:userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you get user ID from JWT middleware
    const {
      firstName,
      lastName,
      email,
      phone,
      currentPassword,
      newPassword,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      address,
      city,
      state,
      zipCode,
      country,
      medicalConditions,
      allergies,
      medications,
      emergencyContactName,
      emergencyContactNumber,
      familyDoctor,
      healthNotifications,
    } = req.body;
    const image = req.file;
    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Validation checks for updated fields
    if (email && !validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (phone && !validator.isMobilePhone(phone)) {
      return res.json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    if (dateOfBirth && !validator.isDate(dateOfBirth)) {
      return res.json({
        success: false,
        message: "Please enter a valid date of birth",
      });
    }

    if (
      gender &&
      !["male", "female", "other", "prefer-not-to-say"].includes(gender)
    ) {
      return res.json({
        success: false,
        message: "Please select a valid gender",
      });
    }

    if (
      bloodGroup &&
      !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodGroup)
    ) {
      return res.json({
        success: false,
        message: "Please select a valid blood group",
      });
    }

    if (height && (height < 50 || height > 300)) {
      return res.json({
        success: false,
        message: "Please enter a valid height (50-300 cm)",
      });
    }

    if (weight && (weight < 10 || weight > 500)) {
      return res.json({
        success: false,
        message: "Please enter a valid weight (10-500 kg)",
      });
    }

    // Check if email or phone already exists (excluding current user)
    if (email || phone) {
      const existingUser = await userModel.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              ...(email ? [{ email: email }] : []),
              ...(phone ? [{ phone: phone }] : []),
            ],
          },
        ],
      });

      if (existingUser) {
        return res.json({
          success: false,
          message:
            existingUser.email === email
              ? "Email already exists"
              : "Phone number already exists",
        });
      }
    }

    // Handle password update
    let hashedNewPassword;
    if (newPassword) {
      if (!currentPassword) {
        return res.json({
          success: false,
          message: "Current password is required to update password",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        return res.json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 8) {
        return res.json({
          success: false,
          message: "New password must be at least 8 characters long",
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      hashedNewPassword = await bcrypt.hash(newPassword, salt);
    }

    // Create update object with only provided fields
    const updateData = {};

    // Basic Information
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (hashedNewPassword) updateData.password = hashedNewPassword;
    if (image !== undefined) updateData.image = image;

    // Personal Information
    if (dateOfBirth !== undefined)
      updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender !== undefined) updateData.gender = gender;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (height !== undefined) updateData.height = Number(height);
    if (weight !== undefined) updateData.weight = Number(weight);

    // Contact & Location
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (country !== undefined) updateData.country = country;

    // Medical Information
    if (medicalConditions !== undefined)
      updateData.medicalConditions = medicalConditions;
    if (allergies !== undefined) updateData.allergies = allergies;
    if (medications !== undefined) updateData.medications = medications;
    if (emergencyContactName !== undefined)
      updateData.emergencyContactName = emergencyContactName;
    if (emergencyContactNumber !== undefined)
      updateData.emergencyContactNumber = emergencyContactNumber;
    if (familyDoctor !== undefined) updateData.familyDoctor = familyDoctor;

    // Preferences
    if (healthNotifications !== undefined)
      updateData.healthNotifications = Boolean(healthNotifications);

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if(image){
      const imageUpload=await cloudinary.uploader.upload(image.path,{resource_type:"image"});
      const image_url=imageUpload.secure_url;
      updatedUser.image = image_url;
    }

    // Return updated user data (excluding password)
    const userResponse = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.image,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      bloodGroup: updatedUser.bloodGroup,
      height: updatedUser.height,
      weight: updatedUser.weight,
      address: updatedUser.address,
      city: updatedUser.city,
      state: updatedUser.state,
      zipCode: updatedUser.zipCode,
      country: updatedUser.country,
      medicalConditions: updatedUser.medicalConditions,
      allergies: updatedUser.allergies,
      medications: updatedUser.medications,
      emergencyContactName: updatedUser.emergencyContactName,
      emergencyContactNumber: updatedUser.emergencyContactNumber,
      familyDoctor: updatedUser.familyDoctor,
      healthNotifications: updatedUser.healthNotifications,
      createdAt: updatedUser.createdAt,
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { registerUser, loginUser, getUserProfile, updateUserProfile };
