import { RegisterForm } from "./components/RegisterForm";

const RegisterPage = async () => {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;

export const metadata = {
  title: "Register",
  description: "Register page",
};
