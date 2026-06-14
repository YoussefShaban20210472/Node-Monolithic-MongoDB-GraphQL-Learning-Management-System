import { faker } from "@faker-js/faker";

export function createRandomUser(role: string = "admin") {
  return {
    firstName: faker.string
      .alpha({ length: { min: 10, max: 15 } })
      .toLocaleLowerCase(),
    lastName: faker.string
      .alpha({ length: { min: 10, max: 15 } })
      .toLocaleLowerCase(),
    email: faker.internet.email({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    }),
    phoneNumber: faker.string.numeric({ length: { min: 10, max: 15 } }),
    password: "Password@123",
    address: "253 N. Cherry St.",
    role: role.toLocaleUpperCase(),
  };
}
