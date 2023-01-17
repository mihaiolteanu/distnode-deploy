// npm install --save-dev tape@5 node-fetch@2.6

import { spawn } from "child_process";
import { cwd } from "process";
import test from "tape";
import fetch from "node-fetch";

const serverStart = () => {
  return new Promise((resolve, _reject) => {
    const server = spawn("node", ["./server.js"], {
      env: Object.assign({}, process.env, { PORT: 5555 }),
      cwd: cwd(),
    });
    server.stdout.on("data", async (data) => {
      const message = data.toString().trim();
      const url = /Server running at (.+)$/.exec(message)[1];
      resolve({ server, url });
    });
  });
};

test("GET /", async (t) => {
  const { server, url } = await serverStart();
  const result = await fetch(`${url}/`);
  const body = await result.text();
  t.equal(body, "Hello from Distributed Node.js!\n");
  server.kill();
});

test("GET /recipes/42", async (t) => {
  const { server, url } = await serverStart();
  const result = await fetch(`${url}/recipes/42`);
  const body = await result.json();
  t.equal(body.id, 42);
  server.kill();
});
