import bot from "../helper/bot.ts";
import { escapeHtml, truncate } from "../helper/format.ts";
import { PullRequestEvent } from "../deps.ts";

export default async (event: PullRequestEvent) => {
  const { action, pull_request, repository, sender } = event;
  const { title, html_url } = pull_request;
  const body = escapeHtml(truncate(pull_request.body, 700) || "No description provided.");
  const status = action === "closed" && pull_request.merged
    ? "merged"
    : action;
  const text =
    `🔀 <b>PR ${status}</b>: ${escapeHtml(title)}` +
    `\nRepository: <b>${repository.full_name}</b>` +
    `\nAuthor: <b>${pull_request.user.login}</b>` +
    `\nAction by: <b>${sender.login}</b>` +
    `\nBranch: <b>${pull_request.head.ref}</b> → <b>${pull_request.base.ref}</b>` +
    `\nState: <b>${pull_request.state}</b>` +
    `\nDraft: <b>${pull_request.draft ? "yes" : "no"}</b>` +
    `\nCommits: <b>${pull_request.commits}</b>` +
    `\nFiles changed: <b>${pull_request.changed_files}</b>` +
    `\nLines: <b>+${pull_request.additions} / -${pull_request.deletions}</b>` +
    `\nReviews: <b>${pull_request.review_comments}</b>` +
    `\nComments: <b>${pull_request.comments}</b>` +
    `\n` +
    `\n<b>Description</b>` +
    `\n${body}`;
  await bot.push(text, html_url);
};
