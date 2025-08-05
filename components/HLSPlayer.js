import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = streamUrl;
    }
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      muted
      style={{ width: "100%" }}
      height={350}
      width={350}
    />
  );
};

export default HLSPlayer;
