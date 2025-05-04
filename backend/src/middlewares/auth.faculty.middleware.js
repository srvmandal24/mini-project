import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import Faculty from "../models/faculty.model.js";

export const verifyFacultyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken);

        
        const faculty = await Faculty.findById(decodedToken?._id).select("-password -refreshToken");
        if(!faculty) {
            throw new ApiError(401, "Invalid Access Token (F)");
        }
        req.user = faculty;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})