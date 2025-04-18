import authMiddleware from '../middleware/authMiddleware.js'
import express from 'express'
import User from '../models/User.js'

const router = express.Router();

router.put("/complete-profile", async (req, res) => {
  const { fullName, department, cpi } = req.body;
  const userId = req.user.id;
  
  try {
    const user = await User.findById(userId);
    
    if (!user || user.role !== "student") {
      return res.status(400).json({ message: "Student not found" });
    }
    
    if (user.filledDetails) {
      return res.status(400).json({ message: "Profile already completed" });
    }
    
    // Update user details
    user.fullName = fullName;
    user.department = department;
    user.cpi = cpi;
    user.filledDetails = true;
    
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/leaderboard", async (req, res) => {
  try {
    const students = await User.find({ role: "student", filledDetails: true })
      .select("fullName department cpi")
      .sort({ cpi: -1 });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile/:regNo", async (req, res) => {
  try {
    // console.log(req.params);
    const regNo = req.params.regNo;
    const user = await User.findOne({registrationNumber : regNo}).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", async (req, res) => {
  // console.log("hehe");
  try {
    const {
      fullName,
      branch,
      cpi,
      dateOfBirth,
      gateScore,
      interest,
      gender,
      areaOfResearch,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.branch = branch || user.branch;
    user.cpi = cpi !== undefined ? parseFloat(cpi) : user.cpi;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gateScore = gateScore !== undefined ? parseInt(gateScore) : user.gateScore;
    user.interest = interest || user.interest;
    user.gender = gender || user.gender;
    user.areaOfResearch = Array.isArray(areaOfResearch) ? areaOfResearch : user.areaOfResearch;
    user.filledDetails = true;
    user.facultyPreferences = [];

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/preferences", async (req, res) => {
  try {
    const studentId = req.user.id;
    const { facultyPreferences } = req.body;
    // console.log(facultyPreferences);
    // console.log(studentId);
    
    const student = await User.findByIdAndUpdate(
      studentId,
      {
        facultyPreferences,
        filledPreferences: true,
      },
      { new: true }
    );

    res.status(200).json({ message: "Preferences updated", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
