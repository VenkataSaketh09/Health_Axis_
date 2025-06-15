import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bpReadingModel from "../models/BPModel.js";
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
    res.json({ success: true, user: userData });
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
    if (image) {
      const imageUpload = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      const image_url = imageUpload.secure_url;
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

//API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, slotDate, slotTime } = req.body;
    const doctorData = await doctorModel.findById(doctorId).select("-password");
    if (!doctorData) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    let slots_booked = doctorData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const userData = await userModel.findById(userId).select("-password");
    delete doctorData.slots_booked;
    const appointmentData = {
      userId,
      doctorId,
      userData,
      doctorData,
      amount: doctorData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save updated slots_booked in doctor model
    await doctorModel.findByIdAndUpdate(doctorId, { slots_booked });
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get All Appointments
const listAppointment = async (req, res) => {
  try {
    const userId  = req.userId;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }
    const appointments = await appointmentModel
      .find({ userId })
      .populate("doctorId", "-password")
      .sort({ date: -1 });
    if (!appointments || appointments.length === 0) {
      return res.json({ success: false, message: "No appointments found" });
    }
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId,appointmentId } = req.body;
    if (!appointmentId) {
      return res.json({ success: false, message: "Appointment ID is required" });
    }
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }
    if(appointmentData.userId!==userId){
      return res.json({ success: false, message: "Unauthorized to cancel this appointment" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
    //releasing doctor slot
    const {doctorId,slotDate,slotTime} = appointmentData;
    const doctorData = await doctorModel.findById(doctorId);
    let slots_booked= doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!==slotTime);
    await doctorModel.findByIdAndUpdate(doctorId,{slots_booked});
    res.json({ success: true, message: "Appointment cancelled successfully" });
  }
  catch(error){
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}


// API to add BP reading
const addBpReading = async (req, res) => {
  try {
    const { userId,systolic, diastolic, pulse, date, time, notes } = req.body;

    // Validate required fields
    if (!userId || !systolic || !diastolic || !date) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Validate BP values
    if (systolic <= diastolic) {
      return res.json({ success: false, message: "Systolic pressure must be higher than diastolic pressure" });
    }

    if (systolic < 70 || systolic > 250) {
      return res.json({ success: false, message: "Systolic pressure must be between 70-250 mmHg" });
    }

    if (diastolic < 40 || diastolic > 150) {
      return res.json({ success: false, message: "Diastolic pressure must be between 40-150 mmHg" });
    }

    if (pulse && (pulse < 40 || pulse > 200)) {
      return res.json({ success: false, message: "Pulse must be between 40-200 bpm" });
    }

    // Create new BP reading
    const readingData = {
      userId,
      systolic: parseInt(systolic),
      diastolic: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : undefined,
      date,
      time: time || undefined,
      notes: notes || undefined,
      timestamp: Date.now()
    };

    const newReading = new bpReadingModel(readingData);
    await newReading.save();

    res.json({ success: true, message: "BP reading saved successfully", reading: newReading });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to get all BP readings for a user
const getBpReadings = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, startDate, endDate, category } = req.query;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Initialize query object
    let query = { userId };

    // Date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Category filtering
    if (category) {
      query.category = category;
    }

    // Get readings with pagination
    const readings = await bpReadingModel.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalReadings = await bpReadingModel.countDocuments(query);

    // Calculate analytics
    let analytics = null;
    if (readings.length > 0) {
      const totalSystolic = readings.reduce((sum, reading) => sum + reading.systolic, 0);
      const totalDiastolic = readings.reduce((sum, reading) => sum + reading.diastolic, 0);
      
      analytics = {
        totalReadings,
        avgSystolic: Math.round(totalSystolic / readings.length),
        avgDiastolic: Math.round(totalDiastolic / readings.length),
        latestReading: readings[0] // Since sorted by timestamp desc
      };
    }

    res.json({
      success: true,
      readings,
      analytics,
      totalReadings,
      totalPages: Math.ceil(totalReadings / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get BP reading analytics/statistics
const getBpAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Calculate date range
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    // Get readings in date range
    const readings = await bpReadingModel.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 });

    if (readings.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalReadings: 0,
          avgSystolic: 0,
          avgDiastolic: 0,
          avgPulse: 0,
          categoryDistribution: {},
          latestReading: null
        }
      });
    }

    // Calculate statistics
    const totalReadings = readings.length;
    const avgSystolic = Math.round(readings.reduce((sum, r) => sum + r.systolic, 0) / totalReadings);
    const avgDiastolic = Math.round(readings.reduce((sum, r) => sum + r.diastolic, 0) / totalReadings);
    const avgPulse = readings.filter(r => r.pulse).length > 0 
      ? Math.round(readings.filter(r => r.pulse).reduce((sum, r) => sum + r.pulse, 0) / readings.filter(r => r.pulse).length)
      : 0;

    // Category distribution
    const categoryDistribution = {};
    readings.forEach(reading => {
      categoryDistribution[reading.category] = (categoryDistribution[reading.category] || 0) + 1;
    });

    const analytics = {
      totalReadings,
      avgSystolic,
      avgDiastolic,
      avgPulse,
      categoryDistribution,
      latestReading: readings[0]
    };

    res.json({ success: true, analytics });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to update BP reading
const updateBpReading = async (req, res) => {
  try {
    const { readingId } = req.params;
    const { systolic, diastolic, pulse, notes } = req.body;

    if (!readingId) {
      return res.json({ success: false, message: "Reading ID is required" });
    }

    const reading = await bpReadingModel.findById(readingId);
    if (!reading) {
      return res.json({ success: false, message: "BP reading not found" });
    }

    // Validate BP values if provided
    if (systolic && diastolic && systolic <= diastolic) {
      return res.json({ success: false, message: "Systolic pressure must be higher than diastolic pressure" });
    }

    // Update fields
    if (systolic) reading.systolic = parseInt(systolic);
    if (diastolic) reading.diastolic = parseInt(diastolic);
    if (pulse !== undefined) reading.pulse = pulse ? parseInt(pulse) : undefined;
    if (notes !== undefined) reading.notes = notes;

    await reading.save(); // This will trigger pre-save middleware to update category

    res.json({ success: true, message: "BP reading updated successfully", reading });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to delete BP reading
const deleteBpReading = async (req, res) => {
  try {
    const { readingId } = req.params;

    if (!readingId) {
      return res.json({ success: false, message: "Reading ID is required" });
    }

    const reading = await bpReadingModel.findByIdAndDelete(readingId);
    if (!reading) {
      return res.json({ success: false, message: "BP reading not found" });
    }

    res.json({ success: true, message: "BP reading deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  addBpReading,
  getBpReadings,
  getBpAnalytics,
  updateBpReading,
  deleteBpReading,
};
