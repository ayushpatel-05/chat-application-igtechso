import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
// import 

const pcConstraints = {
  optional: [{ DtlsSrtpKeyAgreement: true }],
};
const servers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" }
    ]
};

const VideoPage = () => {
  const conversationId = useSelector((state) => state.chat.selectedConversationID);
  const userId = useSelector((state) => state.auth.user.id);
  console.log("The conversation id is: ", conversationId);
  const [socket] = useOutletContext();
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  // const localPeerConnection = useRef(null);
  const [error, setError] = useState(null);
  // const [answerButton, setAnswerButton] = useState(false);
  // const peerConnection = new RTCPeerConnection(servers, pcConstraints);
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
  useEffect(() => {
    const pc = new RTCPeerConnection(servers, pcConstraints);
    setPeerConnection(pc);

    function handleUnload() {
      console.log("Handel Unload fired");
      if (localStream.current && localStream.current.srcObject) {
        console.log("Cleaning localStream");
        localStream.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      peerConnection && peerConnection.close();
      console.log("PeerClosed");
    }

    window.addEventListener("beforeunload", handleUnload);
    // window.addEventListener('popstate', handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
      // window.removeEventListener('popstate', handleUnload);
    }
  }, []);


  useEffect(() => {
    if(!socket)return;

    if(!peerConnection)return;
    
    if(peerConnection)
    {
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", {candidate: event.candidate, conversationId});
        }
      };
    
      peerConnection.ontrack = (event) => {
        // console.log("OnTrack running: ",event);
        const stream = event.streams[0];
        // const remoteVideoElement = document.getElementById('remoteVideo');
        remoteStream.current.srcObject = stream;
      }
    }

    socket.on("offer", async ({sdp, senderId}) => {
      if(senderId == userId)return;
      // console.log("Offer recieved in frontend: ", senderId);
      localStream.current.srcObject.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current.srcObject);
      });
      const offer = new RTCSessionDescription({ type: 'offer', sdp: sdp });
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      // socket.send(JSON.stringify({ type: 'answer', sdp: answer.sdp }));
      socket.emit('answer', {sdp:answer.sdp, conversationId});
    });
  
    socket.on("answer", async ({sdp, senderId}) => {
      if(senderId == userId)return;
      // console.log("Answer recieved in frontend: ", senderId);
      console.log(sdp);
      try {
        const answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
        // console.log("Answer SDP Generate: ", answer.sdp);
        await peerConnection.setRemoteDescription(answer);
      }
      catch(err) {
        console.log("Error while setting answer in remote description", err);
      }
    })
  
    socket.on("candidate", async ({candidate, senderId}) => {
      if(senderId == userId)return;
      // console.log("Candidate recieved in frontend: ", senderId);
      const candidateObject = new RTCIceCandidate(candidate);
      await peerConnection.addIceCandidate(candidateObject);
    });
    

    const getMedia = async () => {
      try {
        // Request video and audio stream from the user's device
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStream.current.srcObject = stream;
      } catch (err) {
        setError("Failed to access media devices: " + err.message);
      }
    };

    getMedia();

    return () => {
      
    };
  }, [socket, conversationId, peerConnection, userId]);





  // When user clicks call button, we will create the p2p connection with RTCPeerConnection
  const startLocalStream = async () => {
    // console.log("Video Call attempt started");
    localStream.current.srcObject.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.current.srcObject);
    });

    const offer = await peerConnection.createOffer();
    // console.log("Offer created from frontend: ", offer);
    // console.log("Offer sdp is: ", offer.sdp);
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", {sdp: offer.sdp, conversationId});
  };




  return (
    <div className="flex flex-col items-center justify-center min-h-screen grow bg-gray-100">
  {error ? (
    <p className="text-red-500">{error}</p>
  ) : (
    <>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <video
            ref={localStream}
            autoPlay
            playsInline
            controls
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="w-1/2">
          <video
            ref={remoteStream}
            autoPlay
            playsInline
            controls
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
      <button
        onClick={startLocalStream}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Start
      </button>
      {/* <button onClick={onAnswer} className="mt-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Accept</button> */}
    </>
  )}
</div>

  )
};

export default VideoPage;


