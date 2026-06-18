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
  { name: "firstName" },
  { name: "lastName" },
  { name: "phoneNumber" },
  { name: "email" },
  { name: "password" },
  { name: "address" },
  { name: "role" },
] as const;
export const updateUserFields = [
  { name: "firstName" },
  { name: "lastName" },
  { name: "phoneNumber" },
  { name: "email" },
  { name: "address" },
] as const;
