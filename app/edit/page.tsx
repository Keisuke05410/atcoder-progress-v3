"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Editor } from "@monaco-editor/react";
import extractInfo from "../record/extractInfo";

const Page = (props: { searchParams: { id: string } }) => {
  // データを問題のデータを管理する変数
  const [problem_data, setProblemData] =
    useState<Database["public"]["Functions"]["get_related_data"]["Returns"]>();

  // code用。ほかの変数については、useStateで管理する
  // code editorの使用上。
  const editorRef = useRef<any>();
  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  // データ取得
  const supabase = createClientComponentClient();
  useEffect(() => {
    const problem_id = props.searchParams.id;
    supabase
      .rpc("get_related_data", {
        problem_id_param: problem_id,
      })
      .then((res) => {
        setProblemData(res.data[0]);
        console.log(problem_data);
      });
  }, [supabase, props.searchParams.id]);

  const handleClick = async () => {
    if (!problem_data) return;
    const info = extractInfo(problem_data.problem_url);
    if (info.status === "success") {
      const { status, error } = await supabase.rpc(
        "update_problem_and_detail",
        {
          p_problem_id: problem_data.problem_id,
          p_contest_number: info.data.contestNumber,
          p_contest_type: info.data.contestType,
          p_correct: problem_data.correct,
          p_created_at: problem_data.created_at,
          p_preview: problem_data.preview,
          p_problem_number: info.data.task,
          p_problem_url: problem_data.problem_url,
          p_updated_at: new Date().toISOString(),
          p_user_id: problem_data.user_id,
          p_code: editorRef.current.getValue(),
          p_language: problem_data.language,
          p_memo: problem_data.memo,
        }
      );
      console.log(status);
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      {problem_data ? (
        <div className=" flex flex-col h-full w-1/2 m-auto gap-5 justify-center">
          <div className="form-control w-full">
            <label className="flex items-center">
              <span className=" mr-3">問題のURL</span>
              <div className="badge badge-primary badge-outline">required</div>
            </label>
            <input
              type="text"
              placeholder="Type here"
              value={problem_data.problem_url}
              onChange={(e) =>
                setProblemData({ ...problem_data, problem_url: e.target.value })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex gap-3 mb-3">
            <input
              type="checkbox"
              checked={problem_data.preview}
              onChange={() => {
                setProblemData({
                  ...problem_data,
                  preview: !problem_data.preview,
                });
              }}
              className="checkbox"
            />
            <p className="">後で見返したい場合はチェック！</p>
            <div
              className="tooltip flex items-center"
              data-tip="問題一覧で強調して表示されるよ"
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <input
              type="checkbox"
              checked={problem_data.correct}
              onChange={() => {
                setProblemData({
                  ...problem_data,
                  correct: !problem_data.correct,
                });
              }}
              className="checkbox checkbox-info"
            />
            <p className="">正解の場合はチェック！</p>
          </div>
          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">Code</div>
            <div className="collapse-content">
              <select
                className="select select-sm select-bordered w-full max-w-xs mb-3"
                value={problem_data.language}
                onChange={(e) =>
                  setProblemData({ ...problem_data, language: e.target.value })
                }
              >
                <option disabled value="">
                  使用した言語
                </option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
              <div className="w-full h-80">
                <Editor
                  language={problem_data.language}
                  defaultValue={problem_data.code}
                  onMount={handleEditorDidMount}
                />
              </div>
            </div>
          </div>
          <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">Memo</div>
            <div className="collapse-content">
              <textarea
                className="textarea textarea-bordered w-full h-full"
                value={problem_data.memo}
                onChange={(e) =>
                  setProblemData({ ...problem_data, memo: e.target.value })
                }
                placeholder="メモ"
              ></textarea>
            </div>
          </div>
          {/*
          {showError && (
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Warning: {errorMessage}!</span>
            </div>
          )}
          {existError && (
            <div className="alert shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-info shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <h3 className="font-bold">すでにこの問題は解いています!</h3>
              </div>
              <button className="btn btn-sm">See</button>
            </div>
          )}*/}
          <button
            onClick={() => {
              handleClick();
            }}
            className="btn btn-info"
          >
            記録
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
    </>
  );
};

export default Page;
