"use client";

import React, { use, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ArrowUpCircleIcon,
  DocumentChartBarIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import Header from "../components/Header";
import getData from "./getData";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Options from "./options";

export type options = {
  optionMarked: boolean | null;
  optionCorrect: boolean | null;
  optionToday: boolean | null;
  optionSearch: string;
  optionSort: boolean | null;
};

export default function Page() {
  const router = useRouter();
  const [optionMarked, setOptionMarked] = useState<boolean | null>(null);
  const [optionCorrect, setOptionCorrect] = useState<boolean | null>(null);
  const [optionToday, setOptionToday] = useState<boolean | null>(null);
  const [optionSearch, setOptionSearch] = useState<string>("");
  const [optionSort, setOptionSort] = useState<boolean | null>(null);
  const [data, setData] = useState<
    (Database["public"]["Tables"]["problems"]["Row"] | null)[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(true);
  const handleData = async (options_params: options) => {
    setLoading(true);
    const { status, data } = await getData(options_params);
    if (status === "success") {
      setData(data ?? []);
      setLoading(false);
    }
  };
  useEffect(() => {
    handleData({
      optionMarked,
      optionCorrect,
      optionToday,
      optionSearch,
      optionSort,
    });
  }, []);

  const handleDelete = async (id: string) => {
    const supabase = createClientComponentClient();
    const { error } = await supabase
      .from("problems")
      .delete()
      .eq("problem_id", id);
    setShowConfirm(false);

    if (error) {
      setShowError(true);
    } else {
      handleData({
        optionMarked,
        optionCorrect,
        optionToday,
        optionSearch,
        optionSort,
      });
    }
  };
  return (
    <div className="">
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      <div className="overflow-x-auto w-1/2 m-auto">
        <div className="collapse bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            絞り込み・検索
          </div>
          <div className="collapse-content">
            <Options
              optionMarked={optionMarked}
              setOptionMarked={setOptionMarked}
              optionCorrect={optionCorrect}
              setOptionCorrect={setOptionCorrect}
              optionToday={optionToday}
              setOptionToday={setOptionToday}
              optionSearch={optionSearch}
              setOptionSearch={setOptionSearch}
              optionSort={optionSort}
              setOptionSort={setOptionSort}
              handleData={handleData}
            />
          </div>
        </div>
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Contest</th>
              <th>Correct</th>
              <th>Solve Date</th>
              <th>Detail</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data.map((data, index) => (
              <tr key={index}>
                <th>
                  {data?.preview && (
                    <div className="badge badge-info gap-2">Marked</div>
                  )}
                </th>
                <td>
                  {data?.contest_type}
                  {data?.contest_number}
                  {data?.problem_number}
                </td>
                <td>
                  {data?.correct ? (
                    <CheckCircleIcon className="h-5 w-5 text-success" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-error" />
                  )}
                </td>
                <td>{data?.updated_at}</td>
                <td>
                  <Link
                    className="btn btn-sm btn-circle"
                    href={{
                      pathname: `/list/${data?.contest_type}${data?.contest_number}${data?.problem_number}`,
                    }}
                  >
                    <DocumentChartBarIcon className="h-5 w-5" />
                  </Link>
                </td>
                <td>
                  <Link
                    className="btn btn-sm btn-circle"
                    href={{
                      pathname: "/edit",
                      query: { id: data?.problem_id },
                    }}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                </td>
                <td>
                  {/* The button to open modal */}
                  <label htmlFor="my_modal_7" className="btn btn-sm btn-circle">
                    <TrashIcon className="h-5 w-5" />
                  </label>
                  {/* Put this part before </body> tag */}
                  <input
                    type="checkbox"
                    id="my_modal_7"
                    className="modal-toggle"
                  />
                  <div onClick={() => setShowConfirm(true)} className="modal">
                    <div className="modal-box">
                      {showConfirm ? (
                        <>
                          <h3 className="text-lg font-bold">削除</h3>
                          <p className="py-4">
                            本当に削除しますか？
                            <br />
                            戻る場合は外側をクリックしてください。
                          </p>
                          <div className="flex justify-end">
                            <button
                              className="btn btn-error"
                              onClick={() =>
                                handleDelete(data?.problem_id || "")
                              }
                            >
                              削除
                            </button>
                          </div>
                        </>
                      ) : showError ? (
                        <h3 className="text-lg font-bold">
                          エラーが発生しました。
                        </h3>
                      ) : (
                        <h3 className="text-lg font-bold">
                          正常に削除されました。
                        </h3>
                      )}
                    </div>
                    <label className="modal-backdrop" htmlFor="my_modal_7">
                      Close
                    </label>
                  </div>
                </td>
                <td>
                  <a href={data?.problem_url} className="btn btn-sm btn-circle">
                    <ArrowUpCircleIcon className="h-5 w-5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="flex h-full justify-center mt-10">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
        {!loading && data.length === 0 && (
          <div className="flex h-full justify-center mt-10">
            <span>No data found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
