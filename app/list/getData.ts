"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "../../types/supabase";
import { options } from "./page";
import { data } from "autoprefixer";

export default async function getData(options_param: options): Promise<{
  status: string;
  message: string;
  data: (Database["public"]["Tables"]["problems"]["Row"] | null)[] | null;
}> {
  const supabase = createServerComponentClient({ cookies });

  let { data: problems, error } = await supabase.rpc("search_problems", {
    optionmarked: options_param.optionMarked,
    optioncorrect: options_param.optionCorrect,
    optiontoday: options_param.optionToday,
    optionsearch: options_param.optionSearch,
    optionsort: options_param.optionSort,
  });

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
