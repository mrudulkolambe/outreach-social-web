import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import TextButton from "../../components/TextButton";
import images from "../../config/images";
import Input from "@/components/Input";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/Auth";
// import { LoginFormInputs } from "../signup";

export default function Bio() {
  const [bio, setBio] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { updateUser } = useAuthContext();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (bio) {
      setLoading(true)
      const data = await updateUser({ bio })
      if (data) {
        setLoading(false)
        navigate("/interest")
      } else {
        setLoading(false)
      }
    } else {
      toast.error("Please enter the bio")
    }
  }
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form onSubmit={handleSubmit} className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <h1 className="primary-heading text-accent">Share your bio with us</h1>
              <TextButton text="Skip" className="text-button" type="button" />
            </div>
            <p className="font-medium mt-3 mb-5">Write about you...</p>
            <Input onChange={(e) => setBio(e.target.value)} value={bio} textarea={true} placeholder="Write your Bio" id="bio" type="text" />
            {/* <Input register={register('password', { required: 'Password is required' })} onChange={() => { }} value="" textarea={true} placeholder="Write your Bio" id="bio" type="text" /> */}
          </div>
          <Button text="Proceed" loading={loading} disabled={false} type="submit" className="" />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
