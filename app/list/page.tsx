import React from "react";
import {
  CheckCircleIcon,
  ArrowUpCircleIcon,
  DocumentChartBarIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

import Header from "../components/Header";
import getData from "./getData";
import Link from "next/link";

export default async function Page() {
  const { status, data } = await getData();
  return (
    <div className="">
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      <div className="overflow-x-auto w-1/2 m-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Contest</th>
              <th>Correct</th>
              <th>Solve Date</th>
              <th>Problem Detail</th>
              <th>Edit</th>
              <th>Problem Link</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {data?.map((data, index) => (
              <tr key={index}>
                <th>
                  {data?.preview && (
                    <div className="badge badge-info gap-2">Marked</div>
                  )}
                </th>
                <td>
                  {data?.contest_type}
                  {data?.contest_number}_{data?.problem_number}
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
                    href={{
                      pathname: `/list/${data?.contest_type}${data?.contest_number}_${data?.problem_number}`,
                      query: { id: data?.problem_id },
                    }}
                  >
                    <DocumentChartBarIcon className="h-5 w-5" />
                  </Link>
                </td>
                <td>
                  <button>
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
                <td>
                  <a href={data?.problem_url}>
                    <ArrowUpCircleIcon className="h-5 w-5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
