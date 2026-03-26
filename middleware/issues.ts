import bot from "../helper/bot.ts";
import { escapeHtml, truncate } from "../helper/format.ts";
import { GCTX, IssuesEvent } from "../deps.ts";

export default async (event: IssuesEvent, _context: GCTX) => {
  const { issue, repository, sender } = event;
  const action = event.action;
  const description = escapeHtml(truncate(issue.body, 600) || "No description provided.");

  let prefix = "⚠️ <b>Issue updated:</b>";

  if (action === "opened") {
    prefix = "⚠️ <b>New issue:</b>";
  } else if (action === "closed") {
    prefix = "✅ <b>Issue closed:</b>";
  } else if (action === "reopened") {
    prefix = "♻️ <b>Issue reopened:</b>";
  }

  await bot.push(
    `${prefix} ${escapeHtml(issue.title)}` +
      `\nRepository: <b>${repository.full_name}</b>` +
      `\nAuthor: <b>${issue.user.login}</b>` +
      `\nAction by: <b>${sender.login}</b>` +
      `\nState: <b>${issue.state ?? "unknown"}</b>` +
      `\nComments: <b>${issue.comments}</b>` +
      `\n` +
      `\n<b>Description</b>` +
      `\n${description}`,
    issue.html_url,
  );
};
