import { ObjectId } from "mongodb";

export default interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}
