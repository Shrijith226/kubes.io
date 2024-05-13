"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

// Icons
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

// Firebase
import { Auth } from "@/lib/firebase";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Image from "next/image";
import Navbar from "@/components/Navbar";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/providers/AuthContextProvider";
import { CustomerProvider } from "@/providers/CustomerCountProvider";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  recoveryEmail: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Check if user is logged in when component mounts
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const [isEmail, setIsEmail] = useState<string>("");
  const [isPassword, setIsPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isRecoveryPassword, setIsRecoveryPassword] = useState<string>("");
  const [isForgetPasswordClicked, setIsforgetPasswordClicked] =
    useState<boolean>(false);

  // Error Handling
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Login
  const Login = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      email: isEmail,
      password: isPassword,
    };

    if (!data.email || !data.password) {
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Invalid email");
      setIsLoading(false);
      return;
    }

    // Password Validation
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        Auth,
        data.email,
        data.password
      );

      if (userCredential) {
        const userLogin = userCredential.user;

        if (userLogin && userLogin.email && userLogin.uid) {
          setError("");
          setIsLoading(false);

          setIsSuccess("Login successfull");
          localStorage.setItem("UID", userLogin.uid);
          localStorage.setItem("Email", userLogin.email);
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
        }
      }
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error) {
        const errorCode = (error as any).code;
        if (errorCode === "auth/invalid-credential") {
          setError("Invalid Credentials");
        } else if (errorCode === "auth/too-many-requests") {
          setError("Too many attempts, try again later");
        } else {
          setError("Something went wrong");
        }
        console.log(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pass Recovery
  const passRecovery = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const recoveryDatas = {
      recoveryEmail: isRecoveryPassword,
    };

    if (!recoveryDatas.recoveryEmail) {
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(Auth, recoveryDatas.recoveryEmail);
      setIsSuccess(
        "A password recovery email has been sent to your email address."
      );
    } catch (error) {
      setError("Something went wrong!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <>
      {isLoggedIn ? (
        <main className="">
          <AuthProvider>
            <CustomerProvider>
              <main className="flex ">
                <Sidebar />

                <Component {...pageProps} />
              </main>

              <Navbar />
            </CustomerProvider>
          </AuthProvider>
        </main>
      ) : (
        <main>
          <section className="h-screen overflow-hidden md:flex md:justify-between items-center">
            <div className="w-1/2 h-full flex justify-center items-center">
              <Image
                src={"/kubes.png"}
                alt="KUBES"
                priority
                height={10000}
                width={10000}
                className="w-96 h-96 object-cover"
              />
            </div>

            <div className="w-1/2 h-full flex justify-center items-center">
              <div>
                <h1 className="font-bold text-6xl">
                  {!isForgetPasswordClicked ? "Login" : "ForgetPassword"}
                </h1>
                <p className="font-light text-xl py-3">
                  {!isForgetPasswordClicked
                    ? "Please login to continue to your account"
                    : "give your email to change the password"}
                </p>

                {!isForgetPasswordClicked ? (
                  <Form {...form}>
                    <form className="text-xs relative">
                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Email"
                                type="email"
                                onChange={(
                                  e: ChangeEvent<HTMLInputElement>
                                ) => {
                                  setIsEmail(e.target.value);
                                  field.onChange(e);
                                }}
                                className="border-2 border-black py-6 px-8 rounded-xl focus-visible:border-green placeholder:text-xl placeholder:text-black text-xl font-light"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="password"
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setIsPassword(e.target.value);
                                    field.onChange(e);
                                  }}
                                  className="border-2 border-black py-6 px-8 rounded-xl focus-visible:border-green placeholder:text-xl placeholder:text-black text-xl font-light"
                                />

                                {showPassword ? (
                                  <div
                                    title="hide passwords"
                                    onClick={() => setShowPassword(false)}
                                    className="text-2xl cursor-pointer absolute top-3.5 right-5"
                                  >
                                    <IoIosEyeOff />
                                  </div>
                                ) : (
                                  <div
                                    title="show passwords"
                                    onClick={() => setShowPassword(true)}
                                    className="text-2xl cursor-pointer absolute top-3.5 right-5"
                                  >
                                    <IoIosEye />
                                  </div>
                                )}
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remember me */}
                      <div className="flex justify-between items-center text-xs py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Checkbox id="terms" />
                          <label
                            htmlFor="terms"
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            remember me
                          </label>
                        </div>
                        <div className="flex justify-center items-center">
                          Forget Password?
                          <Button
                            type="button"
                            onClick={() => setIsforgetPasswordClicked(true)}
                            className="text-green underline font-bold p-1"
                          >
                            click here
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={Login}
                        disabled={!(isEmail && isPassword)}
                        className="bg-green text-white border border-green w-full h-10 rounded-xl hover:bg-white hover:text-black transition-all ease-in-out duration-500"
                      >
                        {isLoading ? "Loading..." : "Login"}
                      </Button>

                      {error && (
                        <div className="text-red-600 mt-4">*{error}</div>
                      )}
                    </form>
                  </Form>
                ) : (
                  <Form {...form}>
                    <form>
                      {/* Recovery Email */}
                      <FormField
                        control={form.control}
                        name="recoveryEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Email"
                                type="email"
                                onChange={(
                                  e: ChangeEvent<HTMLInputElement>
                                ) => {
                                  setIsRecoveryPassword(e.target.value);
                                  field.onChange(e);
                                }}
                                className="border-2 border-black py-6 px-8 rounded-xl focus-visible:border-green placeholder:text-xl placeholder:text-black text-xl font-light"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Buttons */}
                      <div className="flex justify-between items-center gap-4 mt-4">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsforgetPasswordClicked(false);
                          }}
                          className="h-10 rounded-xl"
                        >
                          <IoIosArrowRoundBack className="text-2xl mr-2" /> Go
                          back
                        </Button>

                        <Button
                          disabled={!isRecoveryPassword}
                          onClick={passRecovery}
                          className="bg-green text-white border border-green w-full h-10 rounded-xl hover:bg-white hover:text-black transition-all ease-in-out duration-500"
                        >
                          {isLoading ? "Loading..." : "Submit"}
                        </Button>
                      </div>

                      {error && (
                        <div className="mt-4 text-red-600">{error}</div>
                      )}
                      {isSuccess && <div className="mt-4">{isSuccess}</div>}
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
}
