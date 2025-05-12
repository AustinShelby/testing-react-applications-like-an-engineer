import { getAuthenticatedUser } from "@/auth";
import { RegisterForm } from "./components/RegisterForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Register",
  description: "Register page",
};

const RegisterPage = async () => {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/profile");
  }

  return (
    <div className="flex items-center justify-center mt-32">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
