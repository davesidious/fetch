import { createFetch, Plugin } from "fetch";

const interceptPlugin: Plugin = {
  onEarlyResponse: (req) => {
    if (req.url !== "http://wat.invalid/yeh") return;

    const reqHeaders = Object.fromEntries(req.headers.entries());

    return req
      .blob()
      .then((b) => b.text())
      .then((reqBody) => new Response(JSON.stringify({ reqBody, reqHeaders })));
  },
};

void createFetch(interceptPlugin)("http://wat.invalid/yeh", {
  method: "post",
  body: JSON.stringify({ wat: "yeh" }),
})
  .then((res) => res.json())
  .then((json) => console.log(json));
