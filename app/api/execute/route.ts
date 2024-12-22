import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { writeFileSync, unlinkSync } from "fs";

type RequestBody = {
  code: string;
};

type ResponseBody = {
  error?: string;
  output?: { type: "output" | "plotly"; output: string }[];
};

export async function POST(req: Request) {
  const response: ResponseBody = {};
  let body: RequestBody;

  try {
    body = (await req.json()) as RequestBody;
  } catch {
    response.error = "invalid body";
    return NextResponse.json<ResponseBody>(response);
  }

  const { code } = body;

  const fileRouter = path.join(process.cwd(), `${new Date().getTime()}.py`);
  const venv = path.join(process.cwd(), "venv", "Scripts", "python.exe");

  writeFileSync(
    fileRouter,
    `
import plotly.graph_objects as go
import plotly.io as pio
import plotly.express as px
pio.renderers.default = "plotly_mimetype"
${code}
`
  );

  await execute(`${venv} ${fileRouter}`)
    .then((output) => {
      const outputArray = output.split("\r\n");

      response.output = [];
      outputArray.forEach((outputString) => {
        if (outputString.includes("application/vnd.plotly.v1+json")) {
          // Response building if output is a plot
          const plotlyData = outputString.replaceAll(
            /'|(?<=\b)(True|False)(?=\b)/g,
            (match) => {
              if (match === "'") return '"';
              if (match === "True") return "true";
              return "false";
            }
          );
          response.output!.push({
            output: JSON.stringify(
              JSON.parse(plotlyData)["application/vnd.plotly.v1+json"]
            ),
            type: "plotly",
          });
          return;
        }

        // Response building if output is not a plot
        response.output!.push({ output: outputString, type: "output" });
        return;
      });
    })
    .catch((err) => {
      response.error = err;
    });

  unlinkSync(fileRouter);
  return NextResponse.json<ResponseBody>(response);
}

function execute(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (err, output) => {
      if (err) {
        const msg = err.message.split("\r\n").at(-2);
        if (msg?.includes("Command failed")) {
          // This is usually because the venv is not found.
          return reject("venv not found, execute npm run venv");
        }
        return reject(err.message.split("\r\n").at(-2));
      }
      return resolve(output);
    });
  });
}
