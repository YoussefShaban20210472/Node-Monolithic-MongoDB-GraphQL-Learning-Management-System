export interface CreateUserInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: string;
  role: string;
}

export interface UpdateUserInput {
  _id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export interface CreateUserArgs {
  input: CreateUserInput;
}
export interface UpdateUserArgs {
  input: UpdateUserInput;
}
