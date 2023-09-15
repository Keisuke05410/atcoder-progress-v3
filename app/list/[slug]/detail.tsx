import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import CodeBlock from "./codeBlock";
import { Database } from "../../../types/supabase";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

type DetailProps = {
  problem_id: string;
};

const Detail = async ({ problem_id }: DetailProps) => {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase.rpc("get_related_data", {
    problem_id_param: problem_id,
  });

  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  let problem_data: Database["public"]["Functions"]["get_related_data"]["Returns"] =
    data[0];

  return (
    <div className="w-1/2 m-auto flex flex-col gap-5">
      {problem_data.preview && (
        <div className="badge badge-info m-2">Marked</div>
      )}
      {problem_data.correct ? (
        <div className="flex items-center">
          <CheckCircleIcon className="w-8 h-8 text-success mr-2" />
          <div className="text-4xl font-bold">
            {problem_data.contest_type}
            {problem_data.contest_number}_{problem_data.problem_number}
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <CheckCircleIcon className="h-8 w-8 text-error mr-2" />
          <div className="text-4xl font-bold">
            {problem_data.contest_type}
            {problem_data.contest_number}_{problem_data.problem_number}
          </div>
        </div>
      )}
      <div>最後に解いた日：{problem_data.updated_at}</div>
      <h1 className="text-2xl font-bold">Code</h1>
      {problem_data.code === "" ? (
        <div className="text-2xl">No Code</div>
      ) : (
        <CodeBlock code={problem_data.code} />
      )}
      <h1 className="text-2xl font-bold">Memo</h1>
      {problem_data.memo === "" ? (
        <div className="text-2xl">No Memo</div>
      ) : (
        <div className="border-base-300 border-2 rounded-md">
          {problem_data.memo}
        </div>
      )}
    </div>
  );
};

export default Detail;
