"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import extractInfo from "./extractInfo";

export default async function record(
  URL: string,
  language: string,
  isCorrect: boolean,
  isMarked: boolean,
  memo: string,
  code: string
): Promise<{ status: string; message: string }> {
  const info = extractInfo(URL);
  if (info.status === "success") {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { contestType, contestNumber, task: taskNumber } = info.data;
    const { data, error } = await supabase.rpc("add_problem_and_detail", {
      p_user_id: user?.id,
      p_contest_number: contestNumber,
      p_contest_type: contestType,
      p_correct: isCorrect,
      p_created_at: new Date().toISOString(),
      p_preview: isMarked,
      p_problem_number: taskNumber,
      p_problem_url: URL,
      p_updated_at: new Date().toISOString(),
      p_code: code,
      p_language: language,
      p_memo: memo,
    });

    if (error) {
      console.error(error);
      return {
        status: "error",
        message: error.message,
      };
    } else {
      if (data === "Success") {
        return {
          status: "success",
          message: "Success",
        };
      } else if (data === "Already exists") {
        return {
          status: "error",
          message: "Already exists",
        };
      } else {
        return {
          status: "error",
          message: "Unknown error",
        };
      }
    }
  } else {
    return {
      status: "error",
      message: "URLが正しくありません",
    };
  }
}
