"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { menuItems } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContextProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// Icon
import { TiThLarge } from "react-icons/ti";
import { GoPeople } from "react-icons/go";
import { Button } from "../ui/button";
import { IoIosMenu } from "react-icons/io";

export default function Index() {
  const user = useAuth();
  const pathname = usePathname();
  const [isMenuToggle, setIsMenuToggle] = useState<boolean>(false);

  const router = useRouter();

  // Sign Out
  const handleSignOut = () => {
    user?.signOut();
    router.push("/");
    
    localStorage.setItem('isLoggedIn', 'false');
    window.location.reload();
  };

  return (
    <aside
      className={`${
        isMenuToggle ? "w-[10vh]" : "w-[35vh]"
      } hidden  md:block relative bg-white h-screen rounded-tr-3xl transition-all ease-in-out duration-500 shadow-lg overflow-hidden`}
    >
      {/* Logo */}
      <div
        className={`${
          isMenuToggle ? "px-0 justify-center" : "px-8 justify-between"
        } flex items-center mt-8`}
      >
        {!isMenuToggle && (
          <h1 className="uppercase">
            <Image
              src={"/assets/sidebar/logo.png"}
              alt="DIGISAILOR"
              height={512}
              width={512}
              className="w-32"
            />
          </h1>
        )}

        {!isMenuToggle ? (
          <div
            onClick={() => setIsMenuToggle(true)}
            className="text-3xl text-green cursor-pointer"
          >
            <IoIosMenu />
          </div>
        ) : (
          <div
            onClick={() => setIsMenuToggle(false)}
            className="text-3xl text-main cursor-pointer"
          >
            <IoIosMenu />
          </div>
        )}
      </div>

      {/* Menus */}
      <div className={`${isMenuToggle ? "p-2" : "p-4"} mt-4`}>
        <h1
          className={`${
            isMenuToggle ? "text-center mt-4" : "text-left pl-4"
          } uppercase text-sm font-bold text-black mb-4`}
        >
          Menus
        </h1>

        {menuItems.map((menus, menusKey) => {
          const isActive = pathname === menus.href;
          return (
            <Link
              key={menusKey}
              href={menus.href}
              title={menus.menu}
              className={`${
                isMenuToggle ? "justify-center" : "justify-start"
              } ${
                isActive
                  ? "bg-red-400 text-white font-bold"
                  : "bg-white text-black hover:text-main"
              } flex items-center gap-2 p-4 rounded-xl transition-all ease-in-out duration-500 whitespace-nowrap`}
            >
              <menus.icon className="text-2xl" />
              {!isMenuToggle && <p>{menus.menu}</p>}
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div className="absolute bottom-10 left-5 w-4/5 cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center gap-3">
                <Avatar>
                  {user && <AvatarImage src={"/kubes.png"} alt="profile" />}
                  <AvatarFallback>
                    <GoPeople />
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm">KUBE</p>
                  <p className="text-xs font-bold py-1">
                    {user?.userDetails?.role == "Admin" ? "Admin" : "Staff"}
                  </p>
                </div>
              </div>

              <div>
                <TiThLarge className="text-2xl text-main" />
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent className="fixed -bottom-5 left-36 w-[25vw] bg-white bg-opacity-5 backdrop-blur">
            {user &&
            user.userDetails?.email &&
            user.userDetails?.uid &&
            user.userDetails?.role ? (
              <>
                <div className="text-sm">
                  <p>FullName: KUBE</p>
                  <p>Email: {user.userDetails?.email}</p>
                  <p>UID: {user.userDetails?.uid}</p>
                  <p>Role: {user.userDetails?.role}</p>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSignOut}
                    variant={"outline"}
                    className="rounded-full border border-main text-black bg-white hover:text-white hover:bg-main"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="font-bold"  onClick={handleSignOut}>You have to login first</div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}
