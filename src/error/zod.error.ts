import { ZodError } from "zod";
export function handleZodError(error: ZodError): string {
  let errors = [];
  for (const issue of error.issues) {
    if (issue.path[0] !== undefined) errors.push(issue.message);
    else errors.push("Content-Type must be application/json");
  }
  return errors.join("\n");
}
