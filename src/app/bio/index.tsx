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
      <main className="screen flex items-start justify-between flex-col md:flex-row px-4 md:px-0">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} className="mb-6 md:mb-0" />
        <form onSubmit={handleSubmit} className="w-full md:w-[33%] border border-accent/20 h-full px-6 md:px-12 py-8 md:py-10 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="primary-heading text-accent text-2xl md:text-4xl leading-tight">Share your bio <br className="hidden md:block" />with us</h1>
                <p className="font-medium mt-2 md:mt-3 text-sm md:text-base text-gray-600">Tell us about yourself, your interests, and what makes you unique...</p>
              </div>
              <TextButton text="Skip" onClick={() => navigate("/interest")} className="text-button text-sm md:text-base" type="button" />
            </div>
            <div className="mt-6 md:mt-8">
              <Input 
                onChange={(e) => setBio(e.target.value)} 
                value={bio} 
                textarea={true} 
                placeholder="Write your Bio" 
                id="bio" 
                type="text"
              />
            </div>
          </div>
          <Button text="Proceed" loading={loading} disabled={!bio.trim()} type="submit" className="mt-6 md:mt-8" />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none hidden md:block" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
