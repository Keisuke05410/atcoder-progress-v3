import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServer } from "http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Unauthenticated() {
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        redirect("/");
    }

    return <div>Please sign in!!</div>;
}
