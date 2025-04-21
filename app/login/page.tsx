'use client';

import { useState } from "react";
import  LoginForm from "../Components/login-form"
import SignUpForm from "../Components/signup-form";

export default function Page() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
      {isLogin ? <LoginForm setIsLogin = {setIsLogin} />: <SignUpForm setIsLogin={setIsLogin}/>}
        
      </div>
    </div>
  )
}
