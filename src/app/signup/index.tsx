"use client"

import { FcGoogle } from 'react-icons/fc'
import { SiApple } from "react-icons/si";
import { SiFacebook } from "react-icons/si";
import Input from '../../components/Input';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import images from '../../config/images';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuthContext } from '@/context/Auth';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/FirebaseAuthErrors';

export interface SignupFormInputs {
  email: string;
  password: string;
  confirmpassword: string
}

export default function SignUp() {

  const { createAcc } = useAuthContext();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      if (password === confirmpassword) {
        await createAcc(data.email, data.password);
      } else {
        toast.error("Password doesn't match");
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error.code || 'unknown'))
    }
  };
  return (
    <>
      <main className="screen flex items-start justify-between flex-col md:flex-row px-4 md:px-0">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} className="mb-6 md:mb-0" />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[33%] border border-accent/20 h-full px-6 md:px-12 py-8 md:py-10 flex flex-col justify-between">
          <div className="h-3/5">
            <h1 className="primary-heading text-accent text-3xl md:text-4xl">Hey, <br />Welcome!</h1>
            <p className="font-medium mt-3 text-sm md:text-base">To proceed, please enter your name, <br />password and confirm it.</p>
            <div className="flex flex-col justify-between">
              <div className="">
                <div className="mt-6 flex flex-col gap-6 ">
                  <Input
                    register={register('email', { required: 'Email is required' })}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    value={email}
                    error={errors.email}
                    textarea={false}
                    id="email"
                    placeholder="Email"
                    type="email"
                  />
                  <Input
                    register={register('password', { required: 'Password is required' })}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    value={password} textarea={false}
                    id="password"
                    placeholder="Password"
                    error={errors.password}
                    type="password"
                  />
                  <Input
                    register={register('confirmpassword', { required: 'Password is required' })}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    value={confirmpassword} textarea={false}
                    id="confirmpassword"
                    placeholder="Confirm Password"
                    error={errors.confirmpassword}
                    type="password"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-2/5">
            <div></div>

            <div className="flex flex-col gap-6">
              <div className="flex gap-3 items-center w-full md:w-[80%] mx-auto">
                <div className="flex-1 border-2 h-0"></div>
                <p className="text-sm md:text-base">OR</p>
                <div className="flex-1 border-2 h-0"></div>
              </div>

              <div className="flex justify-between w-full md:w-[80%] mx-auto">
                <FcGoogle className="text-3xl md:text-4xl cursor-pointer" />
                <SiFacebook className="text-2xl md:text-3xl text-[#316FF6] cursor-pointer" />
                <SiApple className="text-2xl md:text-3xl cursor-pointer" />
              </div>
            </div>

            <div>
              <Button text="Sign Up" loading={isSubmitting} disabled={false} type="submit" className="" />
              <p className="font-semibold text-center mt-3 text-sm md:text-base">Already have an account? <Link to={"/"} className="font-semibold text-accent">Sign In</Link></p>
            </div>

          </div>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none hidden md:block" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
