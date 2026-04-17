import api from "./api";

// admin: get all users
export const getAllUsers = async () => {
  return await api.get("/users/all");
};

// admin: get user details
export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};
