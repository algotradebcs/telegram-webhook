import bot from "../helper/bot.ts";
import { escapeHtml, formatCountLine, truncate } from "../helper/format.ts";
import { PushEvent } from "../deps.ts";

export default async (event: PushEvent) => {
  const { ref, commits, repository, pusher, compare, created, deleted, forced } = event;
  const branch = ref.split("/").pop();
  const headCommit = event.head_commit ?? commits.at(-1) ?? null;
  const author = headCommit?.author?.name || pusher.name || "unknown";
  const repoName = repository.full_name;
  const firstLine = escapeHtml(
    truncate(headCommit?.message?.split("\n")[0] || "", 160) || "No commit message",
  );
  const description = escapeHtml(
    truncate(headCommit?.message?.split("\n").slice(1).join("\n"), 500),
  );
  const changedFiles = new Set<string>();

  for (const commit of commits) {
    for (const file of commit.added) {
      changedFiles.add(file);
    }
    for (const file of commit.modified) {
      changedFiles.add(file);
    }
    for (const file of commit.removed) {
      changedFiles.add(file);
    }
  }

  const commitLines = commits.slice(0, 5).map((commit) => {
    const summary = escapeHtml(truncate(commit.message.split("\n")[0], 120) || "No message");
    const commitAuthor = commit.author?.name || "unknown";
    return `• <code>${commit.id.slice(0, 7)}</code> ${summary} - ${escapeHtml(commitAuthor)}`;
  });

  const extraCommits = commits.length > 5
    ? `\n…and ${commits.length - 5} more commits`
    : "";

  const pushKind = deleted
    ? "Deleted branch"
    : created
    ? "Created branch"
    : forced
    ? "Force-pushed"
    : "Push";

  const text =
    `📦 <b>${pushKind}</b>` +
    `\nRepository: <b>${repoName}</b>` +
    `\nBranch: <b>${branch ?? "unknown"}</b>` +
    `\nAuthor: <b>${escapeHtml(author)}</b>` +
    `\n${formatCountLine("Commits", commits.length, "commit")}` +
    `\n${formatCountLine("Files touched", changedFiles.size, "file")}` +
    `\n` +
    `\n<b>Head commit</b>` +
    `\n${firstLine}` +
    (description ? `\n\n${description}` : "") +
    (commitLines.length ? `\n\n<b>Commit list</b>\n${commitLines.join("\n")}${extraCommits}` : "");

  return await bot.push(text, headCommit?.url || compare);
};
