import { auth } from "@/auth";
import CreateRepo from "@/components/create-repo";
import { SignIn } from "@/components/sign-in";
import Image from "next/image";

export default async function Home() {
  const session = await auth()

  return (
    <section>
      <SignIn />
      {session && (
        <>
          <p>
            {session?.user?.name}
          </p>
          <p>
            {session?.user?.email}
          </p>
          <Image
            src={session?.user?.image!}
            width={200}
            height={200}
            alt="Helllo"
            priority
          />
        </>
      )}
      <CreateRepo />
    </section>
  );

}
