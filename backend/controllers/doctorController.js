import doctorModel from "../models/doctorModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const doctorData = await doctorModel.findById(doctorId);
    await doctorModel.findByIdAndUpdate(doctorId, {
      available: !doctorData.available,
    });
    res.json({
      success: true,
      message: "Doctor availability changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error in changing doctor availability",
      error: error.message,
    });
  }
};


const doctorList=async(req,res)=>{
    try{
        const doctors=await doctorModel.find({}).select(["-password","-email"])
        res.json({success:true,doctors})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export { changeAvailability, doctorList };
