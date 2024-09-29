import { Link } from "react-router-dom";
import Button from "../../components/Button";
import TextButton from "../../components/TextButton";
import images from "../../config/images";

export default function Bio() {
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between">
              <h1 className="primary-heading text-accent">Share your bio with us</h1>
              <TextButton text="Skip" className="text-button" type="button" />
            </div>
            <p className="font-medium mt-3 mb-5">Write about you...</p>
            {/* <Input onChange={() => {}} value=""  textarea={true} placeholder="Write your Bio" id="bio" type="text" /> */}
          </div>
          <Link to={"/interest"}>  <Button text="Proceed" loading={false} disabled={false} type="submit" className="" /></Link>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
