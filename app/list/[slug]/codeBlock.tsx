import hljs from "highlight.js";
// githubスタイルを導入する
import "highlight.js/styles/github.css";

type Props = {
  code: string;
};

export default function CodeBlock(props: Props) {
  // コードから自動的に言語を識別してハイライトする
  const highlightedCode: string = hljs.highlightAuto(props.code).value;
  return (
    <pre className=" border-base-300 border-2 rounded-md">
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  );
}
