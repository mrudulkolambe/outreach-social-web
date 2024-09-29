import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import images from "../../config/images";

export default function ProfilePhoto() {
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div>
            <h1 className="primary-heading text-accent">Great! Let's add your <br />profile picture</h1>
            <p className="font-medium mt-3">Choose a photo for your profile picture</p>
          </div>
          <div className="flex items-center justify-center relative">
            <div className="cursor-pointer h-[230px] w-[230px] bg-gray-300 rounded-full flex items-center justify-center">
              <img src="/assets/icons/user.svg" alt="" />
            </div>
            <button className="absolute -bottom-5 bg-accent h-12 w-12 rounded-full flex items-center justify-center">
              <FaPlus className="text-white text-xl" />
            </button>
          </div>
          <Link to={"/bio"}>
            <Button text="Proceed" loading={false} disabled={false} type="submit" className="" />
          </Link>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
