"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Editor } from "@monaco-editor/react";
import extractInfo from "../../record/extractInfo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import parseContestInfo from "../../list/[slug]/parseContestInfo";
import { problem_data_type } from "../../list/[slug]/detail";

interface Props {
  searchParams: {
    id: string;
  };
}

const Page = (props: { params: { slug: string } }) => {
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [existError, setExistError] = useState(false);
  const [exitURL, setExitURL] = useState<string>("");
  const [problemData, setProblemData] = useState<problem_data_type>();
  const editorRef = useRef<any>();

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  const supabase = createClientComponentClient();

  useEffect(() => {
    const getData = async () => {
      const contestInfo = parseContestInfo(props.params.slug);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      supabase
        .rpc("get_related_data", {
          user_id_param: user?.id,
          contest_type_param: contestInfo.contestType,
          contest_number_param: contestInfo.contestNumber,
          problem_number_param: contestInfo.task,
        })
        .then((res) => {
          setProblemData(res.data[0]);
        });
    };
    getData();
  }, [props.params.slug, supabase]);

  if (!problemData) return;

  const handleClick = async () => {
    setShowError(false);
    setShowSuccess(false);
    setExistError(false);
    setShowSaving(true);
    if (!problemData) return;
    const info = extractInfo(problemData.problem_url);

    if (info.status === "success") {
      const { status, data, error } = await supabase.rpc(
        "update_problem_and_detail",
        {
          p_problem_id: problemData.problem_id,
          p_contest_number: info.data.contestNumber,
          p_contest_type: info.data.contestType,
          p_correct: problemData.correct,
          p_created_at: problemData.created_at,
          p_preview: problemData.preview,
          p_problem_number: info.data.task,
          p_problem_url: problemData.problem_url,
          p_updated_at: new Date().toISOString(),
          p_user_id: problemData.user_id,
          p_code: editorRef.current.getValue(),
          p_language: problemData.language,
          p_memo: problemData.memo,
        }
      );

      if (status === 200) {
        if (data === "Success") {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 3000);
        } else if (
          data ===
          "Error: The new URL and user_id combination already exists in the database."
        ) {
          setExistError(true);
          setExitURL(
            `/list/${info.data.contestType}${info.data.contestNumber}_${info.data.task}`
          );
        }
      } else {
        setShowError(true);
        setErrorMessage(error?.message || "エラーが発生しました");
      }
    } else {
      setShowError(true);
      setErrorMessage(info.data.message);
    }
    setShowSaving(false);
  };

  return (
    <>
      <Header />
      <div className="divider m-0 p-0 mb-10"></div>
      {problemData ? (
        <div className="flex flex-col h-full w-1/2 m-auto gap-5 justify-center">
          <div className="form-control w-full">
            <label className="flex items-center">
              <span className="mr-3">問題のURL</span>
              <div className="badge badge-primary badge-outline">required</div>
            </label>
            <input
              type="text"
              placeholder="Type here"
              value={problemData.problem_url}
              onChange={(e) =>
                setProblemData({
                  ...problemData,
                  problem_url: e.target.value,
                })
              }
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex gap-3 mb-3">
            <input
              type="checkbox"
              checked={problemData.preview}
              onChange={() => {
                setProblemData({
                  ...problemData,
                  preview: !problemData.preview,
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
              checked={problemData.correct}
              onChange={() => {
                setProblemData({
                  ...problemData,
                  correct: !problemData.correct,
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
                value={problemData.language}
                onChange={(e) =>
                  setProblemData({ ...problemData, language: e.target.value })
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
                  language={problemData.language}
                  defaultValue={problemData.code}
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
                value={problemData.memo}
                onChange={(e) =>
                  setProblemData({ ...problemData, memo: e.target.value })
                }
                placeholder="メモ"
              ></textarea>
            </div>
          </div>
          {/* 保存中のメッセージ */}
          {showSaving && (
            <div className="alert">
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
              <span>保存中。。。</span>
            </div>
          )}
          {/* 編集が成功したときのメッセージ */}
          {showSuccess && (
            <div className="alert alert-success">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>編集が完了しました!</span>
            </div>
          )}
          {/* エラーが発生したときのメッセージ */}
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
          {/* すでにこの問題を解いているときのメッセージ */}
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
              <Link href={exitURL} className="btn btn-sm">
                See
              </Link>
            </div>
          )}
          <button onClick={handleClick} className="btn btn-info">
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
