import {
  generateRandomAlphabetStrings,
  generateRandomAlphanumericStrings,
  generateRandomDateStrings,
  generateRandomInvalidAddressStrings,
  generateRandomInvalidDateStrings,
  generateRandomInvalidEmailStrings,
  generateRandomInvalidEnumStrings,
  generateRandomInvalidIDStrings,
  generateRandomInvalidPasswordAbove8Strings,
  generateRandomInvalidPasswordUnder8Strings,
  generateRandomInvalidStringArrayStrings,
  generateRandomMixStrings,
  generateRandomNumberStrings,
  generateRandomSpecialCharacterStrings,
} from "./helper/value.helper.js";

export const invalidGraphQLDomains = {
  Name: [
    ...generateRandomAlphabetStrings(0, 2),
    ...generateRandomAlphabetStrings(21, 100),

    ...generateRandomNumberStrings(3, 20),
    ...generateRandomSpecialCharacterStrings(3, 20),

    ...generateRandomAlphanumericStrings(3, 20),
    ...generateRandomMixStrings(3, 20),
  ],
  Email: [...generateRandomInvalidEmailStrings()],
  Role: [
    ...generateRandomInvalidEnumStrings(["student", "instructor", "admin"]),
  ],
  PhoneNumber: [
    ...generateRandomNumberStrings(0, 9),
    ...generateRandomNumberStrings(16, 100),
  ],
  Address: [...generateRandomInvalidAddressStrings()],
  Password: [
    ...generateRandomInvalidPasswordUnder8Strings(),
    ...generateRandomInvalidPasswordAbove8Strings(),
  ],
  Title: [
    ...generateRandomAlphabetStrings(0, 4),
    ...generateRandomAlphabetStrings(256, 1000),

    ...generateRandomNumberStrings(5, 255),
    ...generateRandomSpecialCharacterStrings(5, 255),

    ...generateRandomAlphanumericStrings(5, 255),
    ...generateRandomMixStrings(5, 255),
  ],
  Description: [
    ...generateRandomAlphabetStrings(0, 19),

    ...generateRandomNumberStrings(20, 1000),
    ...generateRandomSpecialCharacterStrings(20, 1000),

    ...generateRandomAlphanumericStrings(20, 1000),
    ...generateRandomMixStrings(20, 1000),
  ],
  ShortDescription: [
    ...generateRandomAlphabetStrings(0, 19),
    ...generateRandomAlphabetStrings(501, 1000),

    ...generateRandomNumberStrings(20, 500),
    ...generateRandomSpecialCharacterStrings(20, 500),

    ...generateRandomAlphanumericStrings(20, 500),
    ...generateRandomMixStrings(20, 500),
  ],
  Date: [...generateRandomDateStrings(), ...generateRandomInvalidDateStrings()],
  StringArray: [...generateRandomInvalidStringArrayStrings(1, 255)],
  EnrollmentStatus: [
    ...generateRandomInvalidEnumStrings(["accepted", "rejected"]),
  ],
  ID: [...generateRandomInvalidIDStrings()],
  OTP: [
    ...generateRandomNumberStrings(0, 19),
    ...generateRandomNumberStrings(256, 1000),

    ...generateRandomAlphabetStrings(20, 255),
    ...generateRandomSpecialCharacterStrings(20, 255),

    ...generateRandomAlphanumericStrings(20, 255),
    ...generateRandomMixStrings(20, 255),
  ],
};
