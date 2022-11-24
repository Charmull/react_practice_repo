import "./App.css";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import uuid from "react-uuid";

const localId = uuid();
const roomId = uuid();

function Test() {
  const [sock, setSock] = useState(null);
  const [stomp, setStomp] = useState(null);

  useEffect(() => {
    if (sock === null) {
      setSock(new SockJS("/api/ws-connection"));
    } else if (sock !== null && sock.readyState === 0) {
      setSock((prev) => {
        prev.onopen = () => {
          console.log("success");
          console.log(sock);
          setStomp(
            // 원래는 여기서 매개변수로 WebSocket말고 sock를 넣어줘야 함 (sockJS를 사용해야 WebSocket을 지원하지 않는 브라우저에서의 동작이나 소켓 재연결을 지원해줌)
            Stomp.over(new WebSocket("ws://163.180.146.59/api/ws-connection"), {
              debug: true,
            })
          );
        };
        prev.onerror = () => {
          console.log("err");
        };
        prev.onclose = (event) => {
          console.log("close");
        };
        return prev;
      });
    } else if (stomp !== null) {
      stomp.connect(
        {},
        () => {
          console.log("connect!");
          stomp.subscribe("/sub/video/joined-room-info", (data) => {
            console.log(data);
            console.log(JSON.parse(data.body));
          });

          stomp.send(
            "/pub/video/joined-room-info",
            JSON.stringify({
              // 여기는 지금 하드코딩 되어있어서 메세지는 가는데 동작은 안함!
              roomId: "2f642e2a-1a80-4955-89f0-a3cd63d7ff64",
              userId: "a54b53d9-7726-4db6-83de-9fc4cc317d2b",
            })
          );
        },
        () => {
          console.log("Err");
        }
      );
    }
  }, [sock, stomp]);

  return <div className="App"></div>;
}

export default Test;
