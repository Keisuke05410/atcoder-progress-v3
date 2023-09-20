export default function parseContestInfo(info: string) {
  const parts = info.split("_");
  const contest = parts[0];
  const task = parts[1];
  const contestType = contest.substring(0, 3);
  const contestNumber = contest.substring(3);
  return {
    contestType,
    contestNumber,
    task: "_" + task,
  };
}
