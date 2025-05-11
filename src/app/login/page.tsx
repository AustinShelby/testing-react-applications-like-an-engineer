import { getAuthenticatedUser } from "@/auth";
import { LoginForm } from "./components/LoginForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login",
  description: "Login page",
};

const LoginPage = async () => {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center mt-32">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
