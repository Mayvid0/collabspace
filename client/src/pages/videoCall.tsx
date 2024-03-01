import AgoraRTM from 'agora-rtm';
import { useEffect, useRef, useState } from "react";

export const VideoCallPage = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  let peerConnection: RTCPeerConnection | null = null;



  const { RTM } = AgoraRTM;
  let uid = String(Math.floor(Math.random() * 1000000));
  const App_id = "2d599024015b4a20bd105d4db5c227ab"

  const localVideoRef1 = useRef<HTMLVideoElement>(null);
  const localVideoRef2 = useRef<HTMLVideoElement>(null);

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun2.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
        ],
      },
    ],
  };

  const init = async () => {
    try {
      const client = new RTM(App_id, uid );
      console.log("AgoraRTM client created", client);

      try {
        const result = await client.login();
        console.log(result);
      } catch (status) {
        console.log(status);
      }

     
      

      // channel = client.createChannel("channel1") 

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing local media:", error);
    }
  };

  const createOffer = async () => {
    if (!localStream) {
      console.error("Local stream is not available.");
      return;
    }

    try {
      peerConnection = new RTCPeerConnection(servers);

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // console.log("New ICE candidate:", event.candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        const stream = event.streams[0];
        setRemoteStream(stream);
      };

      localStream
        .getTracks()
        .forEach((track) => peerConnection!.addTrack(track, localStream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      // console.log("Offer created:", offer);
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (localStream) {
      createOffer();
    }
  }, [localStream]);

  useEffect(() => {
    if (localVideoRef1.current && localStream) {
      localVideoRef1.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (localVideoRef2.current && remoteStream) {
      localVideoRef2.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex justify-center h-full">
      <video
        ref={localVideoRef1}
        className="bg-black w-1/2 h-full m-2"
        autoPlay
        playsInline
        style={{ transform: "scaleX(-1)" }}
      ></video>
      <video
        ref={localVideoRef2}
        className="bg-black w-1/2 h-full m-2"
        autoPlay
        playsInline
        style={{ transform: "scaleX(-1)" }}
      ></video>
    </div>
  );
};
