import { ObjectId } from "mongodb";

export default interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  createdAt?: Date;
  updatedAt?: Date;
}
