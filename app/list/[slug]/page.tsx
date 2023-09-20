import React from "react";
import axios from "axios";
import useSWR from "swr";
import Detail from "./detail";
import Header from "../../components/Header";

// TODO 削除、編集ボタン追加
const Page = (props: { params: { slug: string } }) => {
  return (
    <div>
      <Header />
      <div className=" divider m-0 p-0 mb-10"></div>
      <Detail contestInfo={props.params.slug} />
    </div>
  );
};

export default Page;
