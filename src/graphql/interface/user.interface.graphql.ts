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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
}

export interface CreateUserArgs {
  input: CreateUserInput;
}
