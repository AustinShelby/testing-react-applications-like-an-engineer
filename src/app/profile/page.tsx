import { getAuthenticatedUser } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Register",
  description: "Register page",
};

const RegisterPage = async () => {
  const user = await getAuthenticatedUser();

  if (user) {
    redirect("/login");
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
