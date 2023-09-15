interface ExtractedInfo {
  contestType: string;
  contestNumber: string;
  task: string;
}

interface ExtractInfoResultSuccess {
  status: "success";
  data: ExtractedInfo;
}

interface ExtractInfoResultError {
  status: "error";
  data: {
    message: string;
  };
}

type ExtractInfoResult = ExtractInfoResultSuccess | ExtractInfoResultError;

export default function extractInfo(url: string): ExtractInfoResult {
  if (url === "") {
    return {
      status: "error",
      data: {
        message: "URL is empty.",
      },
    };
  }
  if (url.match(/atcoder\.jp\/contests\/.*\/tasks\/.*/)) {
    const parts = url.split("/");
    const taskIndex = parts.indexOf("tasks");
    const contest = parts[taskIndex - 1];
    const contestType = contest.substring(0, 3);
    const contestNumber = contest.substring(3);
    const taskParts = parts[taskIndex + 1].split("_");
    const taskNumber = taskParts[1];
    return {
      status: "success",
      data: {
        contestType,
        contestNumber,
        task: taskNumber,
      },
    };
  } else {
    return {
      status: "error",
      data: {
        message: "URL is invalid.",
      },
    };
  }
}
