import development from "./development.js";
import test from "./test.js";
import shared from "./shared.js";

const configs = {
  development,
  test,
};
const env = process.env.NODE_ENV || "development";
export default { ...configs[env as keyof typeof configs], ...shared };
