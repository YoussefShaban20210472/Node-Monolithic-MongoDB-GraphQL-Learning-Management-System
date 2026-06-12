import development from "./development.js";
import shared from "./shared.js";

const configs = {
  development,
};
const env = process.env.NODE_ENV || "development";
export default {...configs[env  as keyof typeof configs],...shared};