import {
  booleanValues,
  numberValues,
  objectArrayValues,
  objectValues,
  stringArrayValues,
  stringValues,
} from "./values.fixture.graphql.js";

export const graphqlTypeValues = {
  String: stringValues,
  Number: numberValues,
  Boolean: booleanValues,
  StringArray: stringArrayValues,
  Object: objectValues,
  ObjectArray: objectArrayValues,
};

export const invalidGraphQLTypes = {
  String: [
    ...graphqlTypeValues.Boolean,
    ...graphqlTypeValues.Object,
    ...graphqlTypeValues.Number,
    ...graphqlTypeValues.StringArray,
  ],
  Number: [
    ...graphqlTypeValues.Boolean,
    ...graphqlTypeValues.Object,
    ...graphqlTypeValues.String,
    ...graphqlTypeValues.StringArray,
  ],
  Boolean: [
    ...graphqlTypeValues.String,
    ...graphqlTypeValues.Object,
    ...graphqlTypeValues.Number,
    ...graphqlTypeValues.StringArray,
  ],
  StringArray: [
    ...graphqlTypeValues.Boolean,
    ...graphqlTypeValues.Object,
    ...graphqlTypeValues.Number,
    // ...graphqlTypeValues.String,
  ],
  Object: [
    ...graphqlTypeValues.Boolean,
    ...graphqlTypeValues.StringArray,
    ...graphqlTypeValues.Number,
    ...graphqlTypeValues.String,
  ],
  ObjectArray: [
    ...graphqlTypeValues.Boolean,
    ...graphqlTypeValues.Object,
    ...graphqlTypeValues.Number,
    ...graphqlTypeValues.String,
    ...graphqlTypeValues.StringArray,
    ...graphqlTypeValues.ObjectArray,
  ],
};

export type graphqlTypes = keyof typeof graphqlTypeValues;
