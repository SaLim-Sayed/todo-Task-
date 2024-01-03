"use client";
import React from "react";
import Login from "./Login/Login";
import SignupCard from "./Signup/Signup";
import ForgotPasswordForm from "./ForgetPassword/ForgotPasswordForm";
import { usePathname, useRouter } from "next/navigation";
interface IProps {}

const Auth = ({}: IProps) => {
    const pathname=usePathname()
  return <>
  {pathname==="/auth/login" ? <Login/>: pathname==="/auth/signup" ? <SignupCard/> : pathname==="/auth/forgetPassword" ? <ForgotPasswordForm/>:<Login/>}
  </>;
};

export default Auth;
