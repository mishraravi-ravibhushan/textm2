import React, { useEffect, useRef } from "react";
import JsSIP from "jssip";

const Sip = () => {
  const uaRef = useRef(null);
  const sessionRef = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {
    // Configure the SIP user agent
    const socket = new JsSIP.WebSocketInterface(
      "wss://143.244.140.123:8089/ws"
    );
    const configuration = {
      sockets: [socket],
      uri: "sip:webrtc_client@143.244.140.123:5066",
      password: "webrtc_client",
      session_timers: false,
    };

    const ua = new JsSIP.UA(configuration);
    uaRef.current = ua;

    ua.on("connected", () => console.log("Connected"));
    ua.on("disconnected", () => console.log("Disconnected"));
    ua.on("registered", () => console.log("Registered"));
    ua.on("registrationFailed", (e) => console.error("Registration failed", e));
    ua.on("newRTCSession", (e) => {
      console.log("New RTC Session", e);
      const session = e.session;
      sessionRef.current = session;

      if (session.direction === "incoming") {
        session.answer({
          mediaConstraints: { audio: true, video: false },
        });
      }

      session.on("ended", () => console.log("Call ended"));
      session.on("failed", () => console.log("Call failed"));
      session.on("accepted", () => console.log("Call accepted"));
      session.on("confirmed", () => console.log("Call confirmed"));

      session.connection.addEventListener("addstream", (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.stream;
        }
      });
    });

    ua.start();

    return () => {
      ua.stop();
    };
  }, []);

  const makeCall = () => {
    const eventHandlers = {
      progress: () => console.log("Call in progress"),
      failed: (e) => console.log("Call failed", e),
      ended: () => console.log("Call ended"),
      confirmed: () => console.log("Call confirmed"),
    };

    const options = {
      eventHandlers,
      mediaConstraints: { audio: true, video: false },
    };

    const session = uaRef.current.call(
      "sip:1753498324@143.244.140.123:5066",
      options
    );
    sessionRef.current = session;
  };

  const hangUp = () => {
    if (sessionRef.current) {
      uaRef.current?.stop();
    }
  };

  return (
    <div>
      <h3>SIP Call (JsSIP + React)</h3>
      <button onClick={makeCall}>Call</button>
      <button onClick={hangUp}>Hang Up</button>
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default Sip;
