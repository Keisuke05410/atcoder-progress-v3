import React from "react";
import axios from "axios";
import useSWR from "swr";
import Detail from "./detail";
import Header from "../../components/Header";

const Page = (props: { params: { slug: string } }) => {
  console.log(props.params.slug);

  // TODO param受け取る必要ある？
  return (
    <div>
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      <Detail contestInfo={props.params.slug} />
    </div>
  );
};

export default Page;
