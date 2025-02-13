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
      <main className="screen flex items-start justify-between flex-col md:flex-row px-4 md:px-0">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} className="mb-6 md:mb-0" />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-[33%] border border-accent/20 h-full px-6 md:px-12 py-8 md:py-10 flex flex-col justify-between">
          <div>
            <h1 className="primary-heading text-accent text-2xl md:text-4xl leading-tight">Tell us name & Create<br className="hidden md:block" />Username</h1>
            <p className="font-medium mt-2 md:mt-3 text-sm md:text-base text-gray-600">We're thrilled to have you onboard</p>
          </div>
          <div className="mt-4 md:mt-6 flex flex-col gap-4 md:gap-6 flex-1">
            <div>
              <Input
                register={register('name', { required: 'Name is required' })}
                onChange={(e) => setName(e.currentTarget.value)}
                value={name}
                error={errors.name}
                textarea={false}
                id="name"
                placeholder="Name"
                type="text"
              />
            </div>
            <div>
              <Input
                register={register('username', { required: 'Username is required' })}
                onChange={(e) => setUsername(e.currentTarget.value)}
                value={username}
                textarea={false}
                id="username"
                placeholder="Username"
                error={errors.username}
                type="text"
              />
              <p className="text-[10px] md:text-sm mt-2 text-gray-500">*Usernames must be 6-20 characters long, no uppercase, numbers, and underscores.</p>
            </div>
          </div>
          <Button 
            text="Continue" 
            loading={isSubmitting} 
            disabled={!name.trim() || !username.trim()} 
            type="submit" 
            className="mt-6 md:mt-8" 
          />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none hidden md:block" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
