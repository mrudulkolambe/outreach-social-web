import { Link } from "react-router-dom";
import Button from "../../components/Button";
import images from "../../config/images";

export default function Interest() {
  return (
    <>
      <main className="screen flex items-start justify-between">
        <img src={"/assets/logo/logo.svg"} width={66} alt={"outreach-logo"} />
        <form className="w-[33%] border border-accent/20 h-full px-12 py-10 flex flex-col justify-between">
          <h1 className="primary-heading">Tell us what you're <br />interested in </h1>
          <Link to={"/home"}><Button text="Proceed" loading={false} disabled={false} type="button" className="" /></Link>
        </form>
        <img width={66} className="opacity-0 select-none pointer-events-none" src={images.logo} alt={"outreach-logo"} />
      </main>
    </>
  );
}
