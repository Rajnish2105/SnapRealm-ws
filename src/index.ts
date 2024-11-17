import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { InboxManager } from "./inboxManager";

const server = http.createServer(function (request: any, response: any) {
  console.log(new Date() + " Received request for " + request.url);
  response.end("hi there");
});

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(raw) {
    const { type, data } = JSON.parse(raw.toString()) || {};
    if (type === "join-inbox") {
      InboxManager.getInstance().joinInbox(data.userId, data.inboxId, ws);
    }
    if (type === "send-msg-to") {
      InboxManager.getInstance().sendMessage(
        data.inboxId,
        data.message,
        data.senderId
      );
    }
  });

  //   ws.send("Hello! Message From Server!!");
});

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});
