import "./App.css";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import * as StompJS from "@stomp/stompjs";
import uuid from "react-uuid";

const localId = uuid();

function App() {
  let socket;
  const [sock, setSock] = useState(null);
  const [stomp, setStomp] = useState(null);
  const [stomp2, setStomp2] = useState(null);

  // const handler = () => {
  //   if (stomp2 != null) {
  //     console.log(stomp2.connected);
  //     stomp2.publish({
  //       destination: "/pub/video/joined-room-info",
  //       body: JSON.stringify({
  //         id: localId,
  //         name: localId,
  //         sessionId: localId,
  //       }),
  //     });
  //   }
  // };

  const checkSockJSHandler = () => {
    console.log(sock.readyState);
  };

  useEffect(() => {
    if (sock === null) {
      setSock(new SockJS("/api/ws-connection"));
    } else if (sock !== null && sock.readyState === 0) {
      setSock((prev) => {
        prev.onopen = () => {
          console.log("success");
          console.log(sock);
          setStomp(
            Stomp.over(new WebSocket("ws://163.180.146.59/api/ws-connection"), {
              debug: true,
            })
          );
          // setStomp2(
          //   new StompJS.Client({
          //     brokerURL: "ws://163.180.146.59/api/ws-connection",
          //     // webSocketFactory: () => new SockJS("/api/ws-connection"),
          //     // webSocketFactory: () => sock,
          //     connectHeaders: {
          //       login: "user",
          //       passcode: "password",
          //     },
          //     debug: function (str) {
          //       console.log(str);
          //     },
          //     reconnectDelay: 5000,
          //     heartbeatIncoming: 4000,
          //     heartbeatOutgoing: 4000,
          //   })
          // );
        };
        prev.onerror = () => {
          console.log("err");
        };
        prev.onclose = (event) => {
          console.log("close");
          console.log(event);
          console.log(sock);
        };
        return prev;
      });
    } else if (stomp !== null) {
      console.log("stomp is not null");
      console.log(stomp);
      stomp.connect(
        {},
        () => {
          console.log("connect!");
          stomp.subscribe("/sub/video/joined-room-info", (data) => {
            console.log(JSON.parse(data.body));
          });

          stomp.send(
            "/pub/video/joined-room-info",
            JSON.stringify({
              id: localId,
              name: localId,
              sessionId: localId,
            })
          );
        },
        () => {
          console.log("Err");
        }
      );
    }
    // else if (stomp2 != null) {
    //   console.log(stomp2);
    //   stomp2.onConnect = function (frame) {
    //     stomp2.subscribe("/sub/video/joined-room-info", (msg) => {
    //       console.log(JSON.parse(msg.body));
    //     });
    //   };
    //   stomp2.onStompError = function (frame) {
    //     console.log("error남: ", frame.headers["message"]);
    //   };
    //   stomp2.activate();
    // }
  }, [sock, stomp]);

  return (
    <div className="App">
      {/* <button onClick={handler}>click</button> */}
      <button onClick={checkSockJSHandler}>sockjs 확인</button>
    </div>
  );
}

export default App;
