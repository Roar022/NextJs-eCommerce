"use client";
import headerClassNames from "./headerClassName";

import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/storeHook";
import { toggleCart } from "@/redux/features/cartSlice";
import useCartTotals from "@/hooks/useCartTotals";
import SignUp from "../SignUp/SignUp";
import headerlogo from "../../../public/images/GameOnLogo.png"
import { signIn, useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  // destructuring header class names
  const {
    header,
    container,
    li,
    logoContainer,
    link,
    logo,
    nav,
    ul,
    orders,
    contactUs,
    signupBtn,
    signinBtn,
    logoutBtn,
    cart,
  } = headerClassNames;
  const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      // handle user not authenticated
    },
  });

  // console.log(status, session);

  const { totalQuantity } = useCartTotals();
  const dispatch = useAppDispatch();
  const toggleForm = () => {
    setIsSignUpFormOpen(!isSignUpFormOpen);
  };

  const signinHandler = async () => {
    try {
      // await signIn("google", { callbackUrl: "http://localhost" });
      await signIn();
    } catch (error) {
      console.log("Sign In ERROR", error);
    }
  };
  return (
    <>
      <SignUp isSignUpFormOpen={isSignUpFormOpen} toggleform={toggleForm} />
      <header className={header}>
        <div className={container}>
          {/* Contains Logo */}
          <Link href="/" className={logoContainer}>
            <h1 className={logo}>
            {/* <h1 className={` ${logo}`}> */}
          <Image
           src={headerlogo}
           alt="Logo"
           height={45}
          
        
          />
        {/* </h1> */}

            </h1>
          </Link>

          {/* Contains right side components like SignUp, Login, etc... */}
          <nav className={nav}>
            <ul className={ul}>
              <li>
                <button onClick={() => dispatch(toggleCart())} className={link}>
                  <span className="relative" >
                    Cart
                    <AiOutlineShoppingCart className="inline text-3xl" />
                  </span>
                  <div className="absolute inline-flex justify-center items-center z-50 w-5 h-5 text-xs font-bold text-white bg-primary border-2 border-white rounded-full">{totalQuantity}</div>
                </button>
              </li>

              <li className="flex items-center justify-center h-7">
                {session?.user && (
                  <>
                    <Link href="/orders" className={orders}>
                      Orders
                    </Link>
                    <button onClick={() => signOut()} className={logoutBtn}>
                      Logout
                    </button>
                  </>
                )}
                {!session?.user && (
                  <>
                    <button onClick={toggleForm} className={signupBtn}>
                      Sign Up
                    </button>
                    <button onClick={signinHandler} className={signinBtn}>
                      Sign In
                      <FcGoogle
                        style={{
                          fontSize: "25px",
                          cursor: "pointer",
                          marginLeft: "12px",
                        }}
                        className={link}
                      />
                    </button>
                  </>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
