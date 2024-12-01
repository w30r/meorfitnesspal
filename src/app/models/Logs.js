import mongoose from "mongoose";

const LogsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  breakfast: { type: Array, required: true },
  lunch: { type: Array, required: true },
  dinner: { type: Array, required: true },
});

const Logs = mongoose.models.Logs || mongoose.model("Logs", LogsSchema);

export default Logs;
