const user = JSON.parse(localStorage.getItem("user") || "{}");

export const isAdmin = user.role === "admin";
export const isStaff = user.role === "staff";
export const isSalesman = user.role === "salesman";
