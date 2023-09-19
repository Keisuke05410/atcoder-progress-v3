"use client";

import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Editor from "@monaco-editor/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import record from "./record";
import { useRouter } from "next/navigation";
import extractInfo from "./extractInfo";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

const Page = () => {
  // TODO 問題情報の一括化
  const router = useRouter();
  const [language, setLanguage] = useState("");
  const [URL, setURL] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [isMarked, setIsMarked] = useState(false);
  const [memo, setMemo] = useState("");
  const editorRef = useRef<any>();
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSaving, setShowSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [existError, setExistError] = useState(false);
  const [exitURL, setExitURL] = useState("");

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  // TODO エラーメッセージ関係修正
  async function handleClick() {
    setShowError(false);
    setShowSuccess(false);
    setExistError(false);
    setShowSaving(true);
    const info = extractInfo(URL);
    if (info.status === "success") {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { status, data, error } = await supabase.rpc(
        "add_problem_and_detail",
        {
          p_user_id: user?.id,
          p_contest_number: info.data.contestNumber,
          p_contest_type: info.data.contestType,
          p_correct: isCorrect,
          p_created_at: new Date().toISOString(),
          p_preview: isMarked,
          p_problem_number: info.data.task,
          p_problem_url: URL,
          p_updated_at: new Date().toISOString(),
          p_code: editorRef.current.getValue(),
          p_language: language,
          p_memo: memo,
        }
      );
      if (status === 200) {
        if (data === "Success") {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            setURL("");
            setIsCorrect(true);
            setIsMarked(false);
            setMemo("");
            editorRef.current.setValue("");
          }, 2000);
        } else if (data === "Already exists") {
          setExistError(true);
          setExitURL(
            `/list/${info.data.contestType}${info.data.contestNumber}_${info.data.task}`
          );
        } else {
          setShowError(true);
          setErrorMessage(error?.message || "Unknown error");
        }
      } else {
        setShowError(true);
        setErrorMessage(error?.message || "Unknown error");
      }
    } else {
      setShowError(true);
      setErrorMessage(info.data.message);
    }
    setShowSaving(false);
  }

  return (
    <div>
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      <div className=" flex flex-col h-full w-1/2 m-auto gap-5 justify-center">
        <div className="form-control w-full">
          <label className="flex items-center">
            <span className=" mr-3">問題のURL</span>
            <div className="badge badge-primary badge-outline">required</div>
          </label>
          <input
            type="text"
            value={URL}
            placeholder="Type here"
            onChange={(e) => setURL(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="flex gap-3 mb-3">
          <input
            type="checkbox"
            checked={isMarked}
            onChange={() => {
              setIsMarked(!isMarked);
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
            checked={isCorrect}
            onChange={() => {
              setIsCorrect(!isCorrect);
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option disabled value="">
                使用した言語
              </option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <div className="w-full h-80">
              <Editor language={language} onMount={handleEditorDidMount} />
            </div>
          </div>
        </div>
        <div className="collapse bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">Memo</div>
          <div className="collapse-content">
            <textarea
              className="textarea textarea-bordered w-full h-full"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
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
        {/* 保存が成功したときのメッセージ */}
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
            <span>保存が完了しました!</span>
          </div>
        )}
        {/* エラーが発生したとき */}
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
        {/* すでに問題を解いている場合 */}
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
        <button
          onClick={() => {
            handleClick();
          }}
          className="btn btn-info"
        >
          記録
        </button>
      </div>
    </div>
  );
};

export default Page;
