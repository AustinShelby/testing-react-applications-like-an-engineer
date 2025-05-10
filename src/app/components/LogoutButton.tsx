"use client";

import { logout } from "../actions/logout";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const logoutCurrentUser = async () => {
    await logout();
    router.push("/");
  };

  return <button onClick={logoutCurrentUser}>Logout</button>;
};
