import Button from "../../components/Button";
import images from "../../config/images";
import interestsOptions from "@/lib/interests";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAuthContext } from "@/context/Auth";
import { toast } from "sonner";

export default function Interest() {
  const [selectedInterest, setSelectedInterest] = useState<string[]>([])
  function toggleItemInList(item: string) {
    let newArr = [...selectedInterest];
    const index = newArr.indexOf(item);
    if (index === -1) {
      newArr.push(item);
    } else {
      newArr.splice(index, 1);
    }
    setSelectedInterest(newArr)
  }

  const [loading, setLoading] = useState(false)
  const { updateUser } = useAuthContext();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedInterest) {
      setLoading(true)
      const data = await updateUser({ interest: selectedInterest })
      if (data) {
        setLoading(false)
        window.location.href = "/"
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
          <div>
            <h1 className="primary-heading text-accent text-2xl md:text-4xl leading-tight">Tell us what you're <br className="hidden md:block" />interested in </h1>
            <p className="font-medium mt-2 md:mt-3 text-sm md:text-base">Select your interests to help us personalize your experience</p>
          </div>
          <div className="flex flex-1 mt-4 md:mt-6 overflow-y-auto max-h-[50vh] md:max-h-none">
            <div className="w-full h-max flex flex-wrap gap-2 md:gap-3">
              {interestsOptions.map((interest) => {
                return (
                  <div 
                    key={interest.interest}
                    onClick={() => toggleItemInList(interest.interest)} 
                    className={twMerge(
                      "cursor-pointer border-2 hover:bg-black/5 duration-150 h-max px-2.5 md:px-3 py-1.5 md:py-2 bg-white shadow-lg rounded-full text-xs md:text-sm flex items-center justify-center gap-1.5 md:gap-2",
                      selectedInterest.indexOf(interest.interest) === -1 ? "border-black/5" : "border-accent"
                    )}
                  >
                    <img className="h-4 w-4 md:h-6 md:w-6 object-fill" src={interest.icon} alt={interest.interest} />
                    <span className="whitespace-nowrap">{interest.interest}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <Button text="Proceed" loading={loading} disabled={selectedInterest.length === 0} type="submit" className="mt-6 md:mt-0" />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none hidden md:block" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
