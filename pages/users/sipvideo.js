"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function Sipvideo() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  //const [sipStack, setSipStack] = useState(null);
  //const [sipSession, setSipSession] = useState(null);
  const [loaded, setLoaded] = useState(false);
  var sipStack;
  var sipSession;

  // Called once SIPml-api.js is loaded
  const initSIPML = () => {
    console.log("sipStack", window.SIPml);
    if (!window.SIPml) {
      console.error("SIPml not found");
      return;
    }

    window.SIPml.init(() => {
      const stack = new window.SIPml.Stack({
        realm: "yourdomain.com",
        impi: "webrtc1_client",
        impu: "sip:webrtc1_client@143.244.140.123:5066",
        password: "webrtc1_client",
        display_name: "Ravi",
        websocket_proxy_url: "wss://143.244.140.123:8089/ws",
        enable_rtcweb_breaker: false,
        events_listener: { events: "*", listener: onSipStackEvent },
        sip_headers: [{ name: "User-Agent", value: "SIPML5-v1.0.0" }],
      });

      //setSipStack(stack);
      sipStack = stack;
      stack.start();
    });
  };

  const onSipStackEvent = (e) => {
    console.log(sipStack);

    if (e.type === "started") {
      const session = sipStack.newSession("call-audiovideo", {
        video_local: localVideoRef.current,
        video_remote: remoteVideoRef.current,
        audio_remote: remoteVideoRef.current,
        events_listener: { events: "*", listener: onSipSessionEvent },
        sip_caps: [
          { name: "+g.oma.sip-im" },
          { name: "language", value: '"en,fr"' },
        ],
      });
      //setSipSession(session);
      sipSession = session;
      session.call("sip:175349832@143.244.140.123:5066");
    } else if (e.type === "failed_to_start") {
      console.error("Failed to start SIP stack");
    }
  };

  const onSipSessionEvent = (e) => {
    console.log("Session event:", e.type);
  };

  const hangUp = () => {
    if (sipSession) {
      sipSession = "";
      sipStack = "";
      sipSession.hangup();
    }
  };

  const muteAudio = () => {
    const tracks = sipSession?.connection
      ?.getLocalStreams?.()?.[0]
      ?.getAudioTracks?.();
    if (tracks) {
      tracks.forEach((track) => (track.enabled = false));
    }
  };

  const unmuteAudio = () => {
    const tracks = sipSession?.connection
      ?.getLocalStreams?.()?.[0]
      ?.getAudioTracks?.();
    if (tracks) {
      tracks.forEach((track) => (track.enabled = true));
    }
  };

  const disableVideo = () => {
    const tracks = sipSession?.connection
      ?.getLocalStreams?.()?.[0]
      ?.getVideoTracks?.();
    if (tracks) {
      tracks.forEach((track) => (track.enabled = false));
    }
  };

  const enableVideo = () => {
    const tracks = sipSession?.connection
      ?.getLocalStreams?.()?.[0]
      ?.getVideoTracks?.();
    if (tracks) {
      tracks.forEach((track) => (track.enabled = true));
    }
  };

  return (
    <>
      {/* Load SIPml-api.js only on client */}
      <Script
        src="https://www.doubango.org/sipml5/SIPml-api.js"
        strategy="afterInteractive"
        onLoad={() => {
          setLoaded(true);
          initSIPML();
        }}
      />

      <h2>SIPML5 Video Call - Next.js</h2>
      <video ref={localVideoRef} autoPlay muted style={{ width: 200 }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: 200 }} />
      <br />
      <button onClick={hangUp} disabled={!sipSession}>
        Hang Up
      </button>
      <div className="mt-3">
        <button
          className="btn btn-warning me-2"
          onClick={muteAudio}
          disabled={!sipSession}
        >
          Mute Audio
        </button>
        <button
          className="btn btn-primary me-2"
          onClick={unmuteAudio}
          disabled={!sipSession}
        >
          Unmute Audio
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={disableVideo}
          disabled={!sipSession}
        >
          Disable Video
        </button>
        <button
          className="btn btn-success"
          onClick={enableVideo}
          disabled={!sipSession}
        >
          Enable Video
        </button>
      </div>
    </>
  );
}
