import api from "./api";

export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  // Store role in localStorage if available in response
  if (response?.data?.role) {
    localStorage.setItem("role", response.data.role);
  }

  return response;
};

export const forgotPassword = async (emailData) => {
  return await api.post("/auth/forgot-password", emailData);
};

export const resetPassword = async (resetData) => {
  return await api.post("/auth/reset-password", resetData);
};

export const verifyOtp = async (otpData) => {
  return await api.post("/auth/verify-otp", otpData);
};

export const createAdmin = async (adminData) => {
  return await api.post("/auth/create-admin", adminData);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
};
