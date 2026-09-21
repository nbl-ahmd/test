import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.AUDIT_URL ?? "http://localhost:3000/";
const PORT = Number(process.env.AUDIT_PORT ?? 9230);

const axeSource = readFileSync("node_modules/axe-core/axe.min.js", "utf8");

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--hide-scrollbars",
    "--window-size=1440,900",
    `--remote-debugging-port=${PORT}`,
    "--remote-allow-origins=*",
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=/tmp/dw-axe-profile",
    URL,
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      const list = await res.json();
      const page = list.find(
        (t) => t.type === "page" && t.url.includes("localhost:3000"),
      );
      if (page) return page;
    } catch {}
    await sleep(400);
  }
  throw new Error("no page target");
}

const target = await getTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let id = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  }
};

function send(method, params = {}) {
  const msgId = ++id;
  return new Promise((resolve) => {
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

async function evaluate(expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res?.exceptionDetails) {
    throw new Error(res.exceptionDetails.text);
  }
  return res?.result?.value;
}

await send("Runtime.enable");
await send("Page.enable");
await sleep(3200);

await evaluate(axeSource);

async function runAxe(label) {
  const result = await evaluate(`(async () => {
    const res = await axe.run(document, {
      resultTypes: ["violations"],
      rules: { "color-contrast": { enabled: true } },
    });
    return res.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      count: v.nodes.length,
      targets: v.nodes.slice(0, 4).map((n) => n.target.join(" ")),
    }));
  })()`);

  console.log(`\n=== axe: ${label} ===`);
  if (!result.length) {
    console.log("0 violations");
    return 0;
  }
  for (const v of result) {
    console.log(`- [${v.impact}] ${v.id} (${v.count}) — ${v.help}`);
    v.targets.forEach((t) => console.log(`    ${t}`));
  }
  return result.length;
}

let violations = await runAxe("default page");

await evaluate(`(() => {
  const btn = document.querySelector('button[aria-controls="site-menu"]');
  if (btn) btn.click();
  return !!btn;
})()`);
await sleep(1400);
violations += await runAxe("menu overlay open");

ws.close();
chrome.kill();
process.exit(violations > 0 ? 1 : 0);