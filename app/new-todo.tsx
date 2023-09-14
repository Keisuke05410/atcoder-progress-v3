"use client";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function NewTodo() {
    const addTodo = async (formData: FormData) => {
        "use server";
        const title = formData.get("title");
        const supabase = createServerComponentClient({ cookies });
        await supabase.from("todos").insert({ title });
        revalidatePath("/");
    };

    return (
        <form className=" border-2" action={addTodo}>
            <input name="title" />
        </form>
    );
}
