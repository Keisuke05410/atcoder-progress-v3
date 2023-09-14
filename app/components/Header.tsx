"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
      console.log("ログアウトに失敗しました");
    } else {
      console.log("ログアウトしました");
      router.push("/");
    }
  };

  return (
    <div className="navbar bg-base-100 pb-0">
      <div className="flex-1">
        <h1 className=" font-black text-2xl">AtPro</h1>
      </div>
      <div className="flex-1 justify-center">
        <ul className="menu menu-horizontal px-1">
          <li className="ml-auto">
            <a href="/list" className=" text-base">
              一覧
            </a>
          </li>
          <li>
            <a href="/record" className=" text-base">
              記録
            </a>
          </li>
          <li>
            <a href="dashboard" className=" text-base">
              DashBoard
            </a>
          </li>
        </ul>
      </div>
      <div className="flex-1 text-right justify-end">
        <button onClick={handleSignOut} className="btn btn-active btn-neutral">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
