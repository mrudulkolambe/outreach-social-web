import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import images from "../../config/images";
import Input from "@/components/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useAuthContext } from "@/context/Auth";
import { toast } from "sonner";

export interface UsernameFormInputs {
  name: string;
  username: string;
}

export default function Username() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UsernameFormInputs>();
  const { updateUser } = useAuthContext();
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  const onSubmit: SubmitHandler<UsernameFormInputs> = async () => {
    try {
      if (name && username) {
        const response = await updateUser({ name, username });
        if (response) {
          navigate("/profile-photo")
        }
      } else {
        toast.error("Fill the form");
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  };
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form onSubmit={handleSubmit(onSubmit)} className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div>
            <h1 className="primary-heading text-accent">Tell us name & Create<br />Username</h1>
            <p className="font-medium mt-3">We're thrilled to have you onboard</p>
          </div>
          <div className="mt-6 flex flex-col gap-6 flex-1">
            <Input
              register={register('name', { required: 'name is required' })}
              onChange={(e) => setName(e.currentTarget.value)}
              value={name}
              error={errors.name}
              textarea={false}
              id="name"
              placeholder="Name"
              type="text"
            />
            <Input
              register={register('username', { required: 'Password is required' })}
              onChange={(e) => setUsername(e.currentTarget.value)}
              value={username} textarea={false}
              id="username"
              placeholder="Username"
              error={errors.username}
              type="text"
            />
            <p>*User names must be 6-20 characters long, no uppercase, numbers, and underscores.</p>
          </div>
          <Button text="Continue" loading={isSubmitting} disabled={false} type="submit" className="" />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
