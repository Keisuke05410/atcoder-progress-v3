"use server";

import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function VisiterHeader() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <h1 className=" font-black text-2xl m-auto">AtPro</h1>
      </div>
      <div className="flex-none">
        {user ? (
          <a href="/dashboard" className="btn btn-active btn-neutral m-auto">
            DashBoard
          </a>
        ) : (
          <a href="/login" className="btn btn-active btn-neutral m-auto">
            Login
          </a>
        )}
      </div>
    </div>
  );
}
