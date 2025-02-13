import { FaPlus } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import images from "../../config/images";
import TextButton from "@/components/TextButton";
import { useRef, useState } from "react";
import { uploadSingleFile } from "@/service/uploadService";
import { getFileType } from "@/utils/file";
import { toast } from "sonner";
import { useAuthContext } from "@/context/Auth";

export default function ProfilePhoto() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { updateUser } = useAuthContext();
  const [selectedImageFile, setSelectedImageFile] = useState<SelectedFile | null>(null)
  const [fileSource, setFileSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      let mimeType = getFileType(file);
      setSelectedImageFile({ file, type: mimeType })
      const reader = new FileReader();
      reader.onload = () => {
        setFileSource(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const navigate = useNavigate();
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedImageFile) {
      setLoading(true)
      const response = await uploadSingleFile(selectedImageFile, `profile/${Date.now()}`);
      console.log(response)
      const updateResponse = await updateUser({ imageUrl: response?.media.url })
      console.log(updateResponse)
      if (updateResponse) {
        navigate("/bio")
      }
    } else {
      setLoading(false)
      toast.error("No file selected")
    }
  }
  return (
    <>
      <main className="screen flex items-start justify-between flex-col md:flex-row px-4 md:px-0">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} className="mb-6 md:mb-0" />
        <form onSubmit={handleUpload} className="w-full md:w-[33%] border border-accent/20 h-full px-6 md:px-12 py-8 md:py-10 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex-1 flex-col">
              <h1 className="primary-heading text-accent text-2xl md:text-4xl leading-tight">Great! Let's add your <br className="hidden md:block" />profile picture</h1>
              <p className="font-medium mt-2 md:mt-3 text-sm md:text-base">Choose a photo for your profile picture</p>
            </div>
            <Link to={"/bio"}><TextButton text="Skip" className="text-button text-sm md:text-base" type="button" /></Link>
          </div>
          <div className="flex items-center justify-center relative my-8 md:my-0">
            <div className="cursor-pointer h-[150px] w-[150px] md:h-[230px] md:w-[230px] overflow-hidden bg-gray-300 rounded-full flex items-center justify-center">
              <img onClick={() => inputRef.current?.click()} src={fileSource || "/assets/icons/user.svg"} className="h-full w-full object-cover" alt="" />
            </div>
            <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
            <button type="button" onClick={() => inputRef.current?.click()} className="absolute -bottom-4 md:-bottom-5 bg-accent h-9 w-9 md:h-12 md:w-12 rounded-full flex items-center justify-center">
              <FaPlus className="text-white text-base md:text-xl" />
            </button>
          </div>
          <Button text="Proceed" loading={loading} disabled={false} type="submit" className="mt-auto" />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none hidden md:block" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
