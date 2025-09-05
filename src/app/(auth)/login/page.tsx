import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Project Management",
  description: "Login to access your project management dashboard",
};

export default function Login() {
  return <LoginForm />;
}
