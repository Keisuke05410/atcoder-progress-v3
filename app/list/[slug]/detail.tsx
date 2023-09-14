import React from "react";
import Header from "../../components/Header";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import HighlightedCodeBlock from "./codeBlock";
import CodeBlock from "./codeBlock";

type DetailProps = {
  problem_id: string;
};

const Detail = async ({ problem_id }: DetailProps) => {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("problems")
    .select("*")
    .eq("problem_id", problem_id);
  if (error) {
    console.log(error);
  } else {
    console.log(data);
  }

  return (
    <div>
      <CodeBlock code="print(aaaa)" />
      {problem_id}
    </div>
  );
};

export default Detail;
