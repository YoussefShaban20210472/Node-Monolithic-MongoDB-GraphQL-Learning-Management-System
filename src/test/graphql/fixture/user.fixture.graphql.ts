import config from "../../../config/index.js";
export const adminUser = config.admin;
export const adminLogin = {
  email: adminUser.email,
  password: adminUser.unhashedPassword,
};
export const instructorUser = config.instructor;
export const instructorLogin = {
  email: instructorUser.email,
  password: instructorUser.unhashedPassword,
};
export const studentUser = config.student;
export const studentLogin = {
  email: studentUser.email,
  password: studentUser.unhashedPassword,
};

export const requiredUserFields = [
  { name: "firstName", domain: "Name" },
  { name: "lastName", domain: "Name" },
  { name: "phoneNumber", domain: "PhoneNumber" },
  { name: "email", domain: "Email" },
  { name: "password", domain: "Password" },
  { name: "address", domain: "Address" },
  { name: "role", domain: "Role" },
] as const;
export const updateUserFields = [
  { name: "firstName", domain: "Name" },
  { name: "lastName", domain: "Name" },
  { name: "phoneNumber", domain: "PhoneNumber" },
  { name: "email", domain: "Email" },
  { name: "address", domain: "Address" },
] as const;
