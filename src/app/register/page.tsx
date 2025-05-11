import { RegisterForm } from "./components/RegisterForm";

export const metadata = {
  title: "Register",
  description: "Register page",
};

const RegisterPage = async () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
