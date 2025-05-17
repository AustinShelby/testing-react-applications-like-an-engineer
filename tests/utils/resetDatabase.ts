import shellExec from "shell-exec";

export const resetDatabase = async () => {
  await shellExec("npx prisma migrate reset --force");
};
