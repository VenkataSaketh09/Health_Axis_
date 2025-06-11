import jwt from "jsonwebtoken";

const authAdmin = async (req, res,next  ) => {
  try {
    const { aToken } = req.headers;
    if (!aToken) {
      return res.json.status(401)({
        success: false,
        message: "unauthorized login",
      });
    }
    const token_decrypt = jwt.verify(aToken, process.env.JWT_SECRET);
    if (
      token_decrypt !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json.status(401)({
        success: false,
        message: "unauthorized login",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
