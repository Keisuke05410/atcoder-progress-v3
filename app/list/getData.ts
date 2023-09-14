import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../../types/supabase";

export default async function getData(): Promise<{
  status: string;
  message: string;
  data: (Database["public"]["Tables"]["problems"]["Row"] | null)[] | null;
}> {
  const supabase = createServerComponentClient({ cookies });

  let { data: problems, error } = await supabase.from("problems").select("*");

  if (error) {
    return {
      status: "error",
      message: error.message,
      data: null,
    };
  } else {
    return {
      status: "success",
      message: "Success",
      data: problems ?? null,
    };
  }
}
