import axios from "axios";
import { BASE_URL } from "../utils/Constants";

const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchChartData = async (sessionId) => {
  try {
    const response = await Api.get(`/dashboard/${sessionId}`);
    console.log("✅ API Response:", JSON.stringify(response.data));

    // Ensure charts are returned as an array
    if (!response.data || !Array.isArray(response.data.charts)) {
      console.warn("⚠️ No charts found in API response");
      return [];
    }

    // Normalize charts
    return response.data.charts.map((chart, index) => ({
      chart_id: chart.chart_id || `chart-${index}`,
      question: chart.question || `Chart ${index + 1}`,
      d3: chart.d3 || "",

      // Some APIs provide chart data separately, merge it
      data: chart.data || response.data.data || [],
    }));
  } catch (error) {
    console.error("❌ Error fetching chart data:", error);
    return [];
  }
};

// ✅ Fetch profile data
export const fetchProfileData = async (sessionId) => {
  try {
    const response = await Api.get(`/profile/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching profile data:", error);
    throw error;
  }
};

export default Api;
