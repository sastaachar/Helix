import * as WebSocket from "ws";
import fetch from "node-fetch";

const getDiscordWebSocket = (): WebSocket => {
  console.log("Connecting to webSocket");
  const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json");
  const op_2 = {
    op: 2,
    d: {
      token: "ODUxNzY4NzQ5ODgyNjA1NTg5.YL9Fdw.14HY8nohRifLLeNptBiGzlXdJj8",
      intents: 513,
      properties: {
        $os: "linux",
        $browser: "chrome",
        $device: "chrome",
      },
    },
  };
  const op_1 = {
    op: 1,
    d: "null",
  };

  const respond = async (interaction_id, interaction_token) => {
    const url = `https://discord.com/api/v8/interactions/${interaction_id}/${interaction_token}/callback`;

    const json = {
      type: 4,
      data: {
        content: "loda lele bsdk!",
      },
    };
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(json),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    console.log(res);
  };

  ws.on("open", () => {
    console.log("\tWebSocket connection is open");
  });
  ws.on("message", (data) => {
    if (typeof data !== "string") return;
    const payload = JSON.parse(data);
    const { op } = payload;
    switch (op) {
      case 0:
        switch (payload.t) {
          case "READY": {
            console.log("\tGateway is ready");
            break;
          }
          case "INTERACTION_CREATE": {
            respond(payload.d.id, payload.d.token);
            break;
          }
          default: {
            console.log("\t\tGot : ", payload.t);
            break;
          }
        }

      case 1:
        console.log(
          "\t**Recieved a heartbeat...\n\t\t<-Replying with a heartbeat..."
        );
        ws.send(JSON.stringify(op_1));
        break;
      case 9:
        console.log("Invalid Session");
        break;
      case 10:
        console.log(
          "\tGot hello from discord api...\n\t\tSending identification..."
        );

        ws.send(JSON.stringify(op_2));
        break;
      case 11:
        console.log("\t\t->HeartBeat ACK");
        break;
      default:
        console.log("Got op : ", op);
    }

    if (payload.t === "READY") {
      console.log("\tWebSocket connection is ready");
    }
  });

  return ws;
};

export { getDiscordWebSocket };
