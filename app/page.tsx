import { auth } from "@/auth";
import SignIn from "@/components/sign-in";
import Image from "next/image";

export default async function Home() {
  const session = await auth()
  return (
    <section>
      <SignIn />
      {session?.user?.name}
      {session?.user?.email}
      <Image
        src={session?.user?.image!}
        width={200}
        height={200}
        alt="Helllo"
      />
    </section>
  );

}
