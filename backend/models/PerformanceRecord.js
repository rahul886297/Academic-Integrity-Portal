import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  semester: { type: Number, required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
  attendance: { type: Number, default: 0, min: 0, max: 100 },
  assignments: { type: Number, default: 0, min: 0, max: 100 },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consistencyScore: { type: Number, default: 100 },
  flags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("PerformanceRecord", performanceSchema);
