import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import Student from "../models/student.model.js";

export const verifyStudentJWT = asyncHandler(async(req, _, next) => {
    try {
        // console.log("hehe");
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(decodedToken);

        
        const student = await Student.findById(decodedToken?._id).select("-password -refreshToken");
        if(!student) {
            throw new ApiError(401, "Invalid Access Token (S)");
        }
        // console.log(student);
        
        req.user = student;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})