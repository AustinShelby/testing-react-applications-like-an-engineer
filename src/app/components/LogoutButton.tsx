"use client";

import { logout } from "../actions/logout";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const logoutCurrentUser = async () => {
    await logout();
    router.push("/");
  };

  return (
    <button
      onClick={logoutCurrentUser}
      className="px-4 py-2 text-white font-medium bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
    >
      Logout
    </button>
  );
};
