import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewTodo from "./new-todo";
import VisiterHeader from "./components/visiterHeader";

export default async function Home() {
  return (
    <>
      <VisiterHeader />
      <div className=" divider m-0 p-0"></div>
    </>
  );
}
