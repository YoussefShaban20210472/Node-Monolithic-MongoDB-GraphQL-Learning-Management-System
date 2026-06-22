import { userSchema } from "./schema/user.schema.graphql.js";
import { authSchema } from "./schema/auth.schema.graphql.js";
import { userResolver } from "./resolver/user.resolver.graphql.js";
import { authResolver } from "./resolver/auth.resolver.graphql.js";
import { courseSchema } from "./schema/course.schema.graphql.js";
import { courseResolver } from "./resolver/course.resolver.graphql.js";
import { enrollmentSchema } from "./schema/enrollment.schema.graphql.js";
import { enrollmentResolver } from "./resolver/enrollment.resolver.graphql.js";

export const typeDefs = [
  userSchema,
  authSchema,
  courseSchema,
  enrollmentSchema,
];
export const resolvers = [
  userResolver,
  authResolver,
  courseResolver,
  enrollmentResolver,
];
