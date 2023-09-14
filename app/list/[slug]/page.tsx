import React from "react";
import axios from "axios";
import useSWR from "swr";
import Detail from "./detail";
import Header from "../../components/Header";

const Page = (props: { searchParams: { id: string } }) => {
  return (
    <div>
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      <Detail problem_id={props.searchParams.id} />
    </div>
  );
};

export default Page;
