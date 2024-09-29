import { FcGoogle } from 'react-icons/fc'
import { SiApple, SiFacebook } from "react-icons/si";
import Input from '../../components/Input';
import TextButton from '../../components/TextButton';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import images from '../../config/images';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthContext } from '../../context/Auth';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/FirebaseAuthErrors';
import { sendPasswordResetEmail, signInWithPopup } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { GoogleAuthProvider } from "firebase/auth";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuthContext();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      toast.error(getErrorMessage(error.code || 'unknown'))
    }
  };

  const handleResetPassword = () => {
    if (email.length == 0) {
      toast.error("Please enter the email!")
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("Email sent!")
        })
        .catch((error) => {
          toast.error(error.message)
        });
    }
  }

  const googleLogin = () => {

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        GoogleAuthProvider.credentialFromResult(result);
        navigate('/');
      }).catch((error) => {
        console.log(error)
      });
  }
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form onSubmit={handleSubmit(onSubmit)} className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div className="h-1/2">
            <h1 className="primary-heading text-accent">Hey, <br />Welcome!</h1>
            <p className="font-medium mt-3">To proceed, please enter your name & <br />password.</p>
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
                </div>
                <TextButton onClick={handleResetPassword} text="Reset Password" className="text-button text-left mt-2" type="button" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between h-1/2">
            <div></div>

            <div className="flex flex-col gap-6">
              <div className="flex gap-3 items-center w-[80%] mx-auto">
                <div className="flex-1 border-2 h-0"></div>
                <p>OR</p>
                <div className="flex-1 border-2 h-0"></div>
              </div>

              <div className="flex justify-between w-[80%] mx-auto">
                <FcGoogle onClick={googleLogin} className="cursor-pointer text-4xl" />
                <SiFacebook className="text-3xl text-[#316FF6]" />
                <SiApple className="text-3xl" />
              </div>
            </div>

            <div>
              <Button text="Login" loading={isSubmitting} disabled={false} type="submit" className="" />
              <p className="font-semibold text-center mt-3">Don't have an account? <Link to={"/signup"} className="font-semibold text-accent">Sign Up</Link></p>
            </div>

          </div>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
