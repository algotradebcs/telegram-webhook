import bot from "../helper/bot.ts";
import { GCTX, IssuesEvent } from "../deps.ts";

export default async (event: IssuesEvent, _context: GCTX) => {
  const { issue } = event;
  const action = event.action;

  let prefix = "⚠️ <b>Issue updated:</b>";

  if (action === "opened") {
    prefix = "⚠️ <b>New issue:</b>";
  } else if (action === "closed") {
    prefix = "✅ <b>Issue closed:</b>";
  } else if (action === "reopened") {
    prefix = "♻️ <b>Issue reopened:</b>";
  }

  await bot.push(
    `${prefix} ${issue.title}` +
      `\n` +
      `\n${issue.body}`,
    issue.html_url,
  );
};
