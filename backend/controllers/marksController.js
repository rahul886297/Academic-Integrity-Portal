import PerformanceRecord from "../models/PerformanceRecord.js";
import Subject from "../models/Subject.js";
import { analyzeAnomalies } from "../utils/anomalyDetector.js";

// @desc    Upload marks for a student
// @route   POST /api/marks
// @access  Private/Teacher
export const uploadMarks = async (req, res) => {
  try {
    const { studentId, subjectId, semester, marks, attendance, assignments } = req.body;
    
    // Create record
    const record = new PerformanceRecord({
      student: studentId,
      subject: subjectId,
      semester,
      marks,
      attendance,
      assignments,
      teacher: req.user._id
    });
    
    // Pass entire record to our Intelligent Logic Engine
    const analysis = await analyzeAnomalies(record);
    record.consistencyScore = analysis.score;
    record.flags = analysis.flags;
    
    await record.save();
    res.status(201).json({ message: "Marks uploaded successfully", data: record });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get dashboard metrics & flags
// @route   GET /api/marks/dashboard
// @access  Private/Admin, Teacher, Student
export const getDashboardMetrics = async (req, res) => {
   // Complex aggregation goes here...
   // For now returning mock
   res.json({ message: "Dashboard metrics endpoint active" });
};
