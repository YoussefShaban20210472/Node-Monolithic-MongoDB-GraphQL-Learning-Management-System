import { z } from "zod";

import { getStringZObject, getEnumZObject } from "./validator.js";
function getEmailZObject() {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "email must be string",
    })
    .email("Invalid email");
}
function getPasswordZObject() {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "password is required"
          : "password must be string",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        error: (issue) =>
          issue.input!.length < 8
            ? "password must be at least 8 letters"
            : "password must contains at least 1 [lowercase letter, uppercase letter, number, special character]",
      },
    );
}
function getPhoneNumberZObject() {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "phoneNumber is required"
          : "phoneNumber must be string",
    })
    .regex(/^[0-9]{10,15}$/, "phoneNumber must be 10-15 digits");
}
function getAddressZObject() {
  return z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "address is required"
          : "address must be string",
    })
    .min(4, "address must be at least 4 characters")
    .max(1000, "address must be at maximum 1000 characters")
    .regex(/^\d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*\.$/, {
      error: (issue) =>
        issue.input!.length < 4
          ? "address must be at least 4 letters"
          : issue.input!.length > 1000
            ? "address must be at maximum 1000 letters"
            : "address has invalid format",
    });
}
export const userSchema = z.object({
  firstName: getStringZObject("firstName", 3, 20),
  lastName: getStringZObject("lastName", 3, 20),
  email: getEmailZObject(),
  password: getPasswordZObject(),
  phoneNumber: getPhoneNumberZObject(),
  address: getAddressZObject(),
  role: getEnumZObject("role", ["STUDENT", "INSTRUCTOR", "ADMIN"]),
});
export const updateUserSchema = z.object({
  firstName: getStringZObject("firstName", 3, 20).optional(),
  lastName: getStringZObject("lastName", 3, 20).optional(),
  email: getEmailZObject().optional(),
  phoneNumber: getPhoneNumberZObject().optional(),
  address: getAddressZObject().optional(),
});
