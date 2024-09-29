"use client"

import { FcGoogle } from 'react-icons/fc'
import { SiApple } from "react-icons/si";
import { SiFacebook } from "react-icons/si";
import Input from '../../components/Input';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import images from '../../config/images';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface LoginFormInputs {
  email: string;
  password: string;
  confirmpassword: string
}

export default function SignUp() {

  // const { login } = useAuthContext();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { register, formState: { errors } } = useForm<LoginFormInputs>();

  // const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  //   try {
  //     console.log(data);
  //     // await login(data.email, data.password);
  //   } catch (error: any) {
  //     toast.error(getErrorMessage(error.code || 'unknown'))
  //   }
  // };
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div className="h-3/5">
            <h1 className="primary-heading text-accent">Hey, <br />Welcome!</h1>
            <p className="font-medium mt-3">To proceed, please enter your name, <br />password and confirm it.</p>
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
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    value={password} textarea={false}
                    id="confirmpassword"
                    placeholder="Confirm Password"
                    error={errors.password}
                    type="password"
                  />
                  {/* <Input onChange={() => { }} value='' textarea={false} id="confpassword" placeholder="Confirm password" type="password" /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-2/5">
            <div></div>

            <div className="flex flex-col gap-6">
              <div className="flex gap-3 items-center w-[80%] mx-auto">
                <div className="flex-1 border-2 h-0"></div>
                <p>OR</p>
                <div className="flex-1 border-2 h-0"></div>
              </div>

              <div className="flex justify-between w-[80%] mx-auto">
                <FcGoogle className="text-4xl" />
                <SiFacebook className="text-3xl text-[#316FF6]" />
                <SiApple className="text-3xl" />
              </div>
            </div>

            <div>
              <Link to={"/profile-photo"}><Button text="Login" loading={false} disabled={false} type="submit" className="" /></Link>
              <p className="font-semibold text-center mt-3">Already have an account? <Link to={"/"} className="font-semibold text-accent">Sign In</Link></p>
            </div>

          </div>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
