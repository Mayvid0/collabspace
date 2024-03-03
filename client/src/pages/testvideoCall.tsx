import AgoraRTM, { RtmClient } from "agora-rtm-sdk";

import React, { useEffect, useRef } from "react";
import { FaCamera, FaMicrophone, FaPhone } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";



const VideoChat: React.FC = () => {
  let token = "";
  let uid = String(Math.floor(Math.random() * 1000000000));

  let client: RtmClient | null;
  let channel: any;
  const params = useParams();
  const roomId = params.room;
  const navigate = useNavigate();

  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  let localStream: MediaStream;

  // const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  let peerConnection: any;

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  const constraints: MediaStreamConstraints = {
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: true,
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localStream = stream;
      localStreamRef.current!.srcObject = stream;
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!roomId) {
        navigate("/");
      }

      try {
        if (!client) {
          client = await AgoraRTM.createInstance(APP_ID);
          await client.login({ token, uid });
        }

        // Create and join the channel
        if (!channel) {
          // Create the channel if it hasn't been created
          channel = client.createChannel(String(roomId));
        }
        await channel.join();

        // Set up event listeners or any other necessary logic
        channel.on("MemberJoined", handleUserJoined);
        channel.on("MemberLeft", handleUserLeft);
        client?.on("MessageFromPeer", handleMessageFromPeer);
      } catch (error) {
        console.error("Error initializing:", error);
        // Handle initialization error, such as displaying an error message
      }
    };

    // Call the init function
    init();
  }, [roomId]); // Include roomId in the dependency array

  const createPeerConnection = async (memberId: string) => {
    peerConnection = new RTCPeerConnection(servers);
    console.log("peerConnection", peerConnection);

    localStream?.getTracks().forEach((track: any) => {
      console.log("adding track to local", track);
      peerConnection.addTrack(track, localStream);
    });

    // Set up event to receive tracks
    peerConnection.ontrack = (event: RTCTrackEvent) => {
      // Check if remote stream is already initialized
      const remoteStream = event.streams[0];
      if (remoteStream) {
        remoteStreamRef.current!.srcObject = remoteStream;
      } else {
        console.error("Remote stream is null.");
      }
    };

    //create ICE candidates
    peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        client?.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          memberId
        );
      }
    };
  };

  const createOffer = async (memberId: string) => {
    await createPeerConnection(memberId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer); //triggers the onicecandidate event

    console.log("sending offer to the peer");
    //send the offer to the peer
    client?.sendMessageToPeer(
      { text: JSON.stringify({ type: "offer", offer: offer }) },
      memberId
    );
  };

  const handleUserJoined = async (memberId: string) => {
    console.log("a new User joined the channel: ", memberId);
    createOffer(memberId);
  };

  const handleUserLeft = (memberId: string) => {
        const videoElement = document.getElementById('user-2');
        if (videoElement) {
            videoElement.style.display = 'none'; 
        }
  };

  const createAnswer = async (memberId: string, offer: any) => {
    await createPeerConnection(memberId);

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer); //triggers the onicecandidate event

    console.log("sending answer back to the peer");
    client?.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer: answer }) },
      memberId
    );
  };

  const addAnswer = async (answer: any) => {
    if (!peerConnection.currentRemoteDescription) {
      try {
        console.log(
          "setting remote description using answer received from the peer"
        );
        peerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }
  };

  const handleMessageFromPeer = async (message: any, memberId: string) => {
    message = JSON.parse(message.text);
    if (message.type === "offer") {
      console.log("received offer from the peer and creating answer now");
      await createAnswer(memberId, message.offer);
    }
    if (message.type === "answer") {
      console.log("received answer back from the peer");
      await addAnswer(message.answer);
    }

    if (message.type === "candidate") {
      if (peerConnection) {
        peerConnection.addIceCandidate(message.candidate);
      }
    }
  };

  const leaveChannel = async () => {  
    await channel.leave()
      await client?.logout()
  }

  const toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

    if(videoTrack?.enabled){
        videoTrack.enabled = false
        const camera= document.getElementById('camera-btn')
        if(camera) camera.style.backgroundColor = 'rgb(255, 80, 80)'    
    }else{
        videoTrack!.enabled = true
        const camera= document.getElementById('camera-btn')
        if(camera) camera.style.backgroundColor = 'rgb(179, 102, 249, .9)'
    }
}

const toggleMic = async () => {
  let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

  if(audioTrack?.enabled){
      audioTrack.enabled = false
      const mic = document.getElementById('mic-btn')
      if(mic) mic.style.backgroundColor = 'rgb(255, 80, 80)'
  }else{
      audioTrack!.enabled = true
      const mic = document.getElementById('mic-btn')
      if(mic) mic.style.backgroundColor = 'rgb(179, 102, 249, .9)'
  }
}

const leaveChannelHandler = () => {
  // console.log('leaving channel')
    leaveChannel()
}

  return (
    <>
      <div className="flex justify-center h-full flex-col md:flex-row">
        <video
          ref={localStreamRef}
          className="bg-black w-full md:w-1/2 h-full m-2"
          autoPlay
          playsInline
          style={{ transform: "scaleX(-1)" }}
        ></video>
        <video
          id="user-2"
          ref={remoteStreamRef}
          className="bg-black w-full md:w-1/2 h-full m-2"
          autoPlay
          playsInline
          style={{ transform: "scaleX(-1)" }}
        ></video>
      </div>
      <div className="flex items-center justify-center bg-gray-900 bg-opacity-50">
        <button id="camera-btn" className="text-white p-2" onClick={toggleCamera}>
          <FaCamera />
        </button>
        <button onClick={toggleMic} className="text-white p-2">
          <FaMicrophone />
        </button>
        <button onClick={leaveChannelHandler} className="text-white p-2">
          <FaPhone />
        </button>
      </div>
    </>
  );
};

export default VideoChat;
