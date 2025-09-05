import React from "react";

import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register | Project Management",
  description: "Register for the project management application",
};

const Register = () => {
  return <RegisterForm />;
};

export default Register;
