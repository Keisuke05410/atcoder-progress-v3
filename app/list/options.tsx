import React from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface OptionsProps {
  optionMarked: boolean | null;
  setOptionMarked: (value: boolean | null) => void;
  optionCorrect: boolean | null;
  setOptionCorrect: (value: boolean | null) => void;
  optionToday: boolean | null;
  setOptionToday: (value: boolean | null) => void;
  optionSearch: string | null;
  setOptionSearch: (value: string) => void;
  optionSort: boolean | null;
  setOptionSort: (value: boolean | null) => void;
  handleData: any;
}

const Options = (props: OptionsProps) => {
  const {
    optionMarked,
    setOptionMarked,
    optionCorrect,
    setOptionCorrect,
    optionToday,
    setOptionToday,
    optionSearch,
    setOptionSearch,
    optionSort,
    setOptionSort,
    handleData,
  } = props;
  const [onOptionMarked, setOnOptionMarked] = React.useState<boolean>(false);
  const [onOptionCorrect, setOnOptionCorrect] = React.useState<boolean>(false);
  const [onOptionToday, setOnOptionToday] = React.useState<boolean>(false);
  const [onOptionSearch, setOnOptionSearch] = React.useState<boolean>(false);
  const [onOptionSort, setOnOptionSort] = React.useState<boolean>(false);

  return (
    <div>
      <div className="flex gap-2 justify-center">
        <div className="form-control">
          <label className="label cursor-pointer ">
            <span
              className="tooltip tooltip-right"
              data-tip="markが付いた問題で絞り込み"
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            </span>
            <span className="label-text mr-1">Marked?</span>
            <input
              type="checkbox"
              checked={onOptionMarked}
              onChange={() => {
                if (optionMarked == null) setOptionMarked(true);
                setOnOptionMarked(!onOptionMarked);
              }}
              className="checkbox"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="tooltip" data-tip="問題の正誤で絞り込み">
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            </span>
            <span className="label-text mr-1">Correct?</span>
            <input
              type="checkbox"
              checked={onOptionCorrect}
              onChange={() => {
                if (optionCorrect == null) setOptionCorrect(false);
                setOnOptionCorrect(!onOptionCorrect);
              }}
              className="checkbox"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="tooltip" data-tip="今日解いたかどうかで絞り込み">
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            </span>
            <span className="label-text mr-1">Today?</span>
            <input
              type="checkbox"
              checked={onOptionToday}
              onChange={() => {
                if (optionToday == null) setOptionToday(false);
                setOnOptionToday(!onOptionToday);
              }}
              className="checkbox"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="tooltip" data-tip="日付で並び替え">
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            </span>
            <span className="label-text mr-1">DateSort?</span>
            <input
              type="checkbox"
              checked={onOptionSort}
              onChange={() => {
                if (optionSort == null) setOptionSort(true);
                setOnOptionSort(!onOptionSort);
              }}
              className="checkbox"
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="tooltip" data-tip="コンテスト名や問題名で検索">
              <InformationCircleIcon className="w-5 h-5 text-gray-500" />
            </span>
            <span className="label-text mr-1">ContestSearch?</span>
            <input
              type="checkbox"
              checked={onOptionSearch}
              onChange={() => setOnOptionSearch(!onOptionSearch)}
              className="checkbox"
            />
          </label>
        </div>
      </div>
      {onOptionMarked && (
        <div className="form-control">
          <label className="label cursor-pointer justify-start">
            <input
              type="checkbox"
              className="toggle toggle-info mr-5"
              checked={optionMarked != null ? optionMarked : true}
              onChange={() => {
                setOptionMarked(!optionMarked);
              }}
            />
            <span className="label-text mr-5">
              {optionMarked
                ? "マークのついてる問題のみ表示"
                : "マークがついていない問題のみ表示"}
            </span>
          </label>
        </div>
      )}
      {onOptionCorrect && (
        <div className="form-control">
          <label className="label cursor-pointer justify-start">
            <input
              type="checkbox"
              className="toggle toggle-info mr-5"
              checked={optionCorrect != null ? optionCorrect : false}
              onChange={() => {
                setOptionCorrect(!optionCorrect);
              }}
            />
            <span className="label-text mr-5">
              {optionCorrect ? "正解の問題のみ表示" : "不正解の問題のみ表示"}
            </span>
          </label>
        </div>
      )}
      {onOptionToday && (
        <div className="form-control">
          <label className="label cursor-pointer justify-start">
            <input
              type="checkbox"
              className="toggle toggle-info mr-5"
              checked={optionToday != null ? optionToday : false}
              onChange={() => {
                setOptionToday(!optionToday);
              }}
            />
            <span className="label-text mr-5">
              {optionToday
                ? "今日解いた問題のみ表示"
                : "今日解いていない問題のみ表示"}
            </span>
          </label>
        </div>
      )}
      {onOptionSort && (
        <div className="form-control">
          <label className="label cursor-pointer justify-start">
            <input
              type="checkbox"
              className="toggle toggle-info mr-5"
              checked={optionSort != null ? optionSort : true}
              onChange={() => {
                setOptionSort(!optionSort);
              }}
            />
            <span className="label-text mr-5">
              {optionSort ? "新しい順に並び替え" : "古い順に並び替え"}
            </span>
          </label>
        </div>
      )}
      {onOptionSearch && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              検索ワード : 問題番号は前に_をつけて! → _a, _b, _c, ...
            </span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            value={optionSearch || ""}
            onChange={(e) => setOptionSearch(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
        </div>
      )}
      <div>
        <button
          onClick={() =>
            handleData({
              optionMarked: onOptionMarked === true ? optionMarked : null,
              optionCorrect: onOptionCorrect === true ? optionCorrect : null,
              optionToday: onOptionToday === true ? optionToday : null,
              optionSearch,
              optionSort: onOptionSort === true ? optionSort : null,
            })
          }
          className="btn btn-info"
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default Options;
