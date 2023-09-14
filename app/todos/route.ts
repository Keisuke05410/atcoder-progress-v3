import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { data } from "autoprefixer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    const { id } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    const { data } = await supabase
        .from("todos")
        .update({ done: true })
        .match({ id });
    return NextResponse.json(data);
}
