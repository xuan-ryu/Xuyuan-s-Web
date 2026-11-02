import { Loader } from "@/components/loader";
import { HomeStage } from "@/components/home-stage";
import "./home-stage.css";

export default function Home() {
  return (
    <>
      <Loader />
      <HomeStage />
    </>
  );
}
