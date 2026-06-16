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
  "firstName",
  "lastName",
  "phoneNumber",
  "email",
  "password",
  "address",
  "role",
] as const;
export const updateUserFields = [
  "firstName",
  "lastName",
  "phoneNumber",
  "email",
  "address",
] as const;
