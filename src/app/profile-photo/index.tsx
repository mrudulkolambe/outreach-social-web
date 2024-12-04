import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
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
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form onSubmit={handleUpload} className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="flex-1 flex-col">
              <h1 className="primary-heading text-accent">Great! Let's add your <br />profile picture</h1>
              <p className="font-medium mt-3">Choose a photo for your profile picture</p>
            </div>
            <TextButton text="Skip" className="text-button" type="button" />
          </div>
          <div className="flex items-center justify-center relative">
            <div className="cursor-pointer h-[230px] w-[230px] overflow-hidden bg-gray-300 rounded-full flex items-center justify-center">
              <img onClick={() => inputRef.current?.click()} src={fileSource || "/assets/icons/user.svg"} className="h-full w-full object-cover" alt="" />
            </div>
            <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
            <button type="button" onClick={() => inputRef.current?.click()} className="absolute -bottom-5 bg-accent h-12 w-12 rounded-full flex items-center justify-center">
              <FaPlus className="text-white text-xl" />
            </button>
          </div>
          <Button text="Proceed" loading={loading} disabled={false} type="submit" className="" />
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
