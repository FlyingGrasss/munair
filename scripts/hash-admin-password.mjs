import { randomBytes, scrypt } from "node:crypto";
import { createInterface } from "node:readline/promises";

const terminal = createInterface({ input: process.stdin, output: process.stdout });
const password = await terminal.question("Admin password (minimum 12 characters): ");
terminal.close();
if (password.length < 12 || password.length > 256) {
  console.error("Password must contain between 12 and 256 characters.");
  process.exitCode = 1;
} else {
  const salt = randomBytes(16).toString("hex");
  scrypt(password, salt, 64, (error, derived) => {
    if (error) throw error;
    console.log(`${salt}:${derived.toString("hex")}`);
  });
}
