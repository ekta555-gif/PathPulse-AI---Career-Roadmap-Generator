import * as GoogleAI from "@google/generative-ai";
import axios from "axios";
import { LearningPath, UserProfile } from "../types";

// createAgentChat
export const createAgentChat = (profile: any, path: any) => {
  // Here GoogleAI.GoogleGenerativeAI is being used
  const genAI = new GoogleAI.GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

  return model.startChat({
    history: [],
  });
};
/**
 * Backend URL - Makeing sure Python FastAPI is running on port 8000
 */
const BACKEND_URL = "http://localhost:8000";

/**
 * Generates the full learning path curriculum by calling the Python Backend.
 */
export const generateLearningPath = async (profile: UserProfile): Promise<LearningPath> => {
  try {
    // Port 8000 ya 8001 whatever was set
    const response = await axios.post("http://localhost:8000/predict-level", {
      name: profile.name,
      dream_role: profile.targetPosition, // Ye backend ke 'dream_role' se match hona chahiye
      experience_years: 0,
      projects_count: 3,
      current_skills: [profile.department || "General"],
      weeks_available: (profile.totalDurationMonths || 3) * 4,
      hours_per_day: Math.round((profile.weeklyHours || 10) / 7),
      resume_text: profile.resumeText || "Student"
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};