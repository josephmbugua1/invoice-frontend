import api from "./api";

// create invoice (USER)
export const createInvoice = async (data) => {
  return await api.post("/invoices/create", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// get my invoices (USER)
export const getMyInvoices = async () => {
  return await api.get("/invoices/my");
};

// admin: get all invoices
export const getAllInvoices = async () => {
  return await api.get("/invoices/all");
};

// admin: approve invoice
export const approveInvoice = async (id) => {
  return await api.put(`/invoices/approve/${id}`);
};

// admin: reject invoice
export const rejectInvoice = async (id) => {
  return await api.put(`/invoices/reject/${id}`);
};