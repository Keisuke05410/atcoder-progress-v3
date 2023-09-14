"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showInputError, setShowInputError] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      }
    };
    getUser();
  }, [router, supabase.auth]);

  const handleSignIn = async () => {
    setShowInputError(false);
    setShowLoginError(false);

    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        setShowLoginError(true);
        console.log(error);
        alert(error.message);
      } else {
        router.push("/dashboard");
      }
    } else {
      setShowInputError(true);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col text-center w-1/2 justify-center items-center bg-base-300 p-10">
        <h1 className="font-black text-2xl mb-5">Login</h1>
        <p>
          登録がまだの方は
          <a href="/signup" className="link">
            こちら
          </a>
        </p>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Email address</span>
          </label>
          <input
            type="text"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full max-w-xs mb-5"
          />
        </div>
        <button onClick={handleSignIn} className="btn btn-info w-full max-w-xs">
          Login
        </button>
        {showInputError && (
          <div className="alert alert-warning w-full max-w-xs mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>両方入力してください</span>
          </div>
        )}
        {showLoginError && (
          <div className="alert alert-error w-full max-w-xs mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>emailかパスワードが間違っています</span>
          </div>
        )}
      </div>
    </div>
  );
}
