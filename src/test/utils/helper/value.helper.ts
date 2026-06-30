import { createIntervals, setYear } from "./date.helper.js";

const smallAlphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const capitalAlphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const alphabet = [...smallAlphabet, ...capitalAlphabet];
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const specialCharacters = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "=",
  "+",
  "[",
  "]",
  "{",
  "}",
  "\\",
  "|",
  ";",
  ":",
  "'",
  '"',
  ",",
  ".",
  "<",
  ">",
  "/",
  "?",
  "`",
  "~",
];

function generateRandomString(
  array: string[],
  minlength: number,
  maxlength: number,
): string {
  const count =
    Math.floor(Math.random() * (maxlength - minlength + 1)) + minlength;
  return Array.from({ length: count }, () => {
    return array[Math.floor(Math.random() * array.length)];
  }).join("");
}
function generateRandomStrings(
  array: string[],
  minlength: number,
  maxlength: number,
  minCount: number,
  maxCount: number,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    const count =
      Math.floor(Math.random() * (maxlength - minlength + 1)) + minlength;
    return Array.from({ length: count }, () => {
      return array[Math.floor(Math.random() * array.length)];
    }).join("");
  });
}
function randomCase(str: string): string {
  return str
    .split("")
    .map((char) =>
      Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase(),
    )
    .join("");
}
export function generateRandomAlphabetStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 5,
  maxCount: number = 10,
): string[] {
  return generateRandomStrings(
    alphabet,
    minlength,
    maxlength,
    minCount,
    maxCount,
  );
}
export function generateRandomNumberStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 5,
  maxCount: number = 10,
): string[] {
  return generateRandomStrings(
    numbers,
    minlength,
    maxlength,
    minCount,
    maxCount,
  );
}
export function generateRandomSpecialCharacterStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 5,
  maxCount: number = 10,
): string[] {
  return generateRandomStrings(
    specialCharacters,
    minlength,
    maxlength,
    minCount,
    maxCount,
  );
}

export function generateRandomAlphanumericStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 5,
  maxCount: number = 10,
): string[] {
  return generateRandomStrings(
    [...numbers, ...alphabet],
    minlength,
    maxlength - 1,
    minCount,
    maxCount,
  ).map((value) => `${value}1`);
}
export function generateRandomAlphaspecialStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 5,
  maxCount: number = 10,
): string[] {
  return generateRandomStrings(
    [...specialCharacters, ...alphabet],
    minlength,
    maxlength - 1,
    minCount,
    maxCount,
  ).map((value) => `${value}!`);
}
export function generateRandomMixStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 5,
  maxCount: number = 10,
): string[] {
  return generateRandomStrings(
    [...specialCharacters, ...alphabet, ...numbers],
    minlength,
    maxlength - 2,
    minCount,
    maxCount,
  ).map((value) => `1${value}!`);
}
export function generateRandomInvalidEmailStrings(
  minCount: number = 10,
  maxCount: number = 20,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    const part1 = generateRandomString([...numbers, ...alphabet], 2, 10);
    const part2 = "@";
    const part3 = generateRandomString([...numbers, ...alphabet], 2, 10);
    const part4 = ".";
    const part5 = generateRandomString(alphabet, 2, 10);
    const parts = [part1, part2, part3, part4, part5];
    const email = parts.filter(() => Math.random() > 0.5);
    if (email.length < 5) {
      return email.join("");
    } else {
      return email.slice(1).join("");
    }
  });
}

export function generateRandomInvalidEnumStrings(
  array: string[],
  minCount: number = 2,
  maxCount: number = 3,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return array
    .map((value) => {
      return Array.from({ length: count }, () => {
        return randomCase(value);
      });
    })
    .flat();
}
export function generateRandomInvalidAddressStrings(
  minCount: number = 20,
  maxCount: number = 30,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    const part1 = generateRandomString(numbers, 1, 5);
    const part2 = " ";
    const part3 = generateRandomString(alphabet, 1, 1);
    const part4 = generateRandomString(
      [...alphabet, ...numbers, "_", ".", "-"],
      1,
      1,
    );
    const part5 = " ";
    const part6 = generateRandomString(alphabet, 1, 10);
    const part7 = " ";
    const part8 = generateRandomString(alphabet, 1, 10);
    const part9 = " ";
    const part10 = generateRandomString(alphabet, 0, 20);
    const part11 = ".";

    const parts = [
      part1,
      part2,
      part3,
      part4,
      part5,
      part6,
      part7,
      part8,
      part9,
      part10,
      part11,
    ];
    const address = parts.filter(() => Math.random() > 0.5);
    if (address.length < 11) {
      return address.join("");
    } else {
      return address.slice(1).join("");
    }
  });
}

export function generateRandomInvalidPasswordUnder8Strings(
  minCount: number = 10,
  maxCount: number = 20,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    const part1 = generateRandomString(smallAlphabet, 1, 1);
    const part2 = generateRandomString(capitalAlphabet, 1, 1);
    const part3 = generateRandomString(numbers, 1, 1);
    const part4 = generateRandomString(
      ["@", "$", "!", "%", "*", "?", "&"],
      1,
      1,
    );
    const part5 = generateRandomString(
      [...alphabet, ...numbers, "@", "$", "!", "%", "*", "?", "&"],
      0,
      4,
    );
    const parts = [part1, part2, part3, part4, part5];
    const password = parts.filter(() => Math.random() > 0.5);
    if (password.length < 5) {
      return password.join("");
    } else {
      return password.slice(1).join("");
    }
  });
}
export function generateRandomInvalidPasswordAbove8Strings(
  minCount: number = 10,
  maxCount: number = 20,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    const part1 = generateRandomString(smallAlphabet, 5, 10);
    const part2 = generateRandomString(capitalAlphabet, 5, 10);
    const part3 = generateRandomString(numbers, 5, 10);
    const part4 = generateRandomString(
      ["@", "$", "!", "%", "*", "?", "&"],
      5,
      10,
    );
    const parts = [part1, part2, part3, part4];
    const password = parts.filter(() => Math.random() > 0.5);
    if (password.length < 4) {
      return password.join("");
    } else {
      return password.slice(1).join("");
    }
  });
}
export function generateRandomDateStrings(): string[] {
  return [
    ...createIntervals(setYear(new Date(), -20), new Date(), 10),
    ...createIntervals(setYear(new Date(), 2), setYear(new Date(), 22), 10),
  ];
}
export function generateRandomInvalidDateStrings(
  minCount: number = 30,
  maxCount: number = 40,
): string[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    const part1 = generateRandomString(numbers, 4, 4);
    const part2 = "-";
    const part3 = generateRandomString(numbers, 2, 2);
    const part4 = "-";
    const part5 = generateRandomString(numbers, 2, 2);
    const part6 = "T";
    const part7 = generateRandomString(numbers, 2, 2);
    const part8 = ":";
    const part9 = generateRandomString(numbers, 2, 2);
    const part10 = ":";
    const part11 = generateRandomString(numbers, 2, 2);
    const part12 = ".";
    const part13 = generateRandomString(numbers, 3, 3);
    const part14 = "+";
    const part15 = generateRandomString(numbers, 2, 2);
    const part16 = ":";
    const part17 = generateRandomString(numbers, 2, 2);
    const parts = [
      part1,
      part2,
      part3,
      part4,
      part5,
      part6,
      part7,
      part8,
      part9,
      part10,
      part11,
      part12,
      part13,
      part14,
      part15,
      part16,
      part17,
    ];
    const date = parts.filter(() => Math.random() > 0.5);
    if (date.length < 17) {
      return date.join("");
    } else {
      return date.slice(1).join("");
    }
  });
}

export function generateRandomInvalidStringArrayStrings(
  minlength: number,
  maxlength: number,
  minCount: number = 10,
  maxCount: number = 20,
): string[][] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    return [
      generateRandomAlphabetStrings(0, minlength - 1),
      generateRandomAlphabetStrings(maxlength + 1, maxlength * 2),

      generateRandomNumberStrings(minlength, maxlength),
      generateRandomSpecialCharacterStrings(minlength, maxlength),

      generateRandomAlphanumericStrings(minlength, maxlength),
      generateRandomMixStrings(minlength, maxlength),
      [
        ...generateRandomAlphanumericStrings(minlength, maxlength),
        ...generateRandomAlphabetStrings(minlength, maxlength),
      ],
      [
        ...generateRandomMixStrings(minlength, maxlength),
        ...generateRandomAlphabetStrings(minlength, maxlength),
      ],
    ];
  }).flat();
}

export function generateRandomInvalidIDStrings(
  minCount: number = 10,
  maxCount: number = 20,
): string[] {
  const array = [
    ...smallAlphabet.slice(0, 6),
    ...capitalAlphabet.slice(0, 6),
    ...numbers,
  ];
  return [
    ...generateRandomStrings(array, 0, 23, minCount, maxCount),
    ...generateRandomStrings(array, 25, 100, minCount, maxCount),
    ...generateRandomAlphanumericStrings(24, 24, minCount, maxCount),
    ...generateRandomMixStrings(24, 24, minCount, maxCount),
  ];
}

function generateRandomInteger(minInt: number, maxInt: number): number {
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}
export function generateRandomIntegers(
  minInt: number,
  maxInt: number,
  minCount: number = 50,
  maxCount: number = 100,
): number[] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    return generateRandomInteger(minInt, maxInt);
  });
}

export function generateRandomInvalidIDArrayStrings(
  minCount: number = 20,
  maxCount: number = 40,
): string[][] {
  const count =
    Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
  return Array.from({ length: count }, () => {
    return generateRandomInvalidIDStrings();
  });
}
function generateRandomInvalidAnswerStrings(
  minCount: number = 20,
  maxCount: number = 40,
): string[] {
  return [
    ...generateRandomAlphabetStrings(0, 0, minCount, maxCount),
    ...generateRandomAlphabetStrings(256, 1000, minCount, maxCount),

    ...generateRandomNumberStrings(1, 255, minCount, maxCount),
    ...generateRandomSpecialCharacterStrings(1, 255, minCount, maxCount),

    ...generateRandomAlphanumericStrings(1, 255, minCount, maxCount),
    ...generateRandomMixStrings(1, 255, minCount, maxCount),
  ];
}
export function generateRandomInvalidQuestionAnswerArray(
  minCount: number = 20,
  maxCount: number = 40,
): { questionId: string; answer: string }[] {
  const invalidIds = generateRandomInvalidIDStrings(minCount, maxCount);
  const invalidAnswers = generateRandomInvalidAnswerStrings(minCount, maxCount);
  const count = Math.min(invalidAnswers.length, invalidIds.length);
  const answers: { questionId: string; answer: string }[] = [];
  for (let i = 0; i < count; i++) {
    answers.push({ answer: invalidAnswers[i], questionId: invalidIds[i] });
  }
  return answers;
}
