import Image from "next/image";
import { Button } from "./ui/button";

const Navigation = () => {
  return (
    <div className="mx-[10%] mt-2 flex flex-row justify-between">
      <Image src="/own-logo.svg" height={40} width={80} alt="logo" />

      <Button variant="outline">Connect Wallet</Button>
    </div>
  );
};

export default Navigation;
