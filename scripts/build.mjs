import { spawnSync } from "node:child_process";

function run(command, args) {
  const executable = process.platform === "win32" && command === "pnpm" ? "pnpm.cmd" : command;
  const result = spawnSync(executable, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

if (process.env.VERCEL === "1" && process.env.DIRECT_URL?.startsWith("postgresql://")) {
  run("pnpm", ["prisma", "migrate", "deploy"]);
}

run("pnpm", ["prisma", "generate"]);
run("pnpm", ["exec", "next", "build"]);
