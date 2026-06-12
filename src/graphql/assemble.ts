import { userSchema } from "./schema/user.schema.graphql.js";
import { authSchema } from "./schema/auth.schema.graphql.js";
import { userResolver } from "./resolver/user.resolver.graphql.js";
import { authResolver } from "./resolver/auth.resolver.graphql.js";

export const typeDefs = [userSchema, authSchema];
export const resolvers = [userResolver, authResolver];
