import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

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

const loginUser = async (req,res) => {
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

export { registerUser, loginUser };
