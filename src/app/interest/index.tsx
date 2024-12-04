import { Link } from "react-router-dom";
import Button from "../../components/Button";
import images from "../../config/images";
import interestsOptions from "@/lib/interests";

export default function Interest() {
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <h1 className="primary-heading text-accent">Tell us what you're <br />interested in </h1>
          <div className="flex flex-1 mt-6">
            <div className="w-full h-max flex flex-wrap gap-3">
              {interestsOptions.map((interest) => {
                return <div className="cursor-pointer border-2 hover:bg-black/5 duration-150 border-black/5 h-max px-3 py-2 bg-white shadow-lg rounded-full text-sm flex items-center justify-center gap-1"><img  className="h-6 w-6 object-fill" src={interest.icon} alt={interest.interest} />{interest.interest}</div>
              })}
            </div>
          </div>
          <Link to={"/"}><Button text="Proceed" loading={false} disabled={false} type="button" className="" /></Link>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
