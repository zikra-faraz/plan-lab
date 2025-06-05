import React from "react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import UserMenu from "@/components/user-menu";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";

const Header = async () => {
  await checkUser();
  return (
    <>
      <UserLoading />
      <header className="fixed top-0 z-50 w-full bg-white/30 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm">
        <div className="container mx-auto">
          <nav className="h-20 py-6 px-4 flex justify-between items-center  ">
            <Link href="/">
              <div className="flex items-center gap-1 ">
                {" "}
                <Image
                  src={"/p.png"}
                  alt="Plan lab Logo"
                  width={50}
                  height={50}
                  className="object-fit"
                />
                <p className="text-3xl font-bold tracking-tight text-purple-500">
                  Pl<span className="dark:text-white text-black ">a</span>n{" "}
                  <span className="dark:text-white text-black">Lab</span>
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/project/create">
                <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500">
                  <PenBox size={18} className="text-white" />
                  <span className="hidden md:inline text-white">
                    Create Project
                  </span>
                </Button>
              </Link>
              <SignedOut>
                <SignInButton forceRedirectUrl="/onboarding">
                  <Button variant="outline">Login</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserMenu />
              </SignedIn>
              <ThemeToggle />
            </div>
          </nav>
        </div>
        {/* <div className="pt-1">
       
          <hr className="border-t border-gray-300 dark:border-gray-700 max-w-[90vw] mx-auto mb-4" />
        </div> */}
      </header>
    </>
  );
};

export default Header;
