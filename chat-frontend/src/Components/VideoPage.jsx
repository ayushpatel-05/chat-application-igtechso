import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
// import { useSelector } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { clearMediaStreams, setLocalMediaStream, setRemoteMediaStream } from "../slices/videoCallSlice";
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
  const dispatch = useDispatch();
  const {localMediaStream, remoteMediaStream} = useSelector((state) => state.videoCall);
  const conversationId = useSelector((state) => state.chat.selectedConversationID);
  const userId = useSelector((state) => state.auth.user.id);
  const [socket] = useOutletContext();
  
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const [callStatus, setCallStatus] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const pc = new RTCPeerConnection(servers, pcConstraints);
    setPeerConnection(pc);

    function handleUnload() {
      dispatch(clearMediaStreams);
      peerConnection && peerConnection.close();
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
    if (remoteStream.current && remoteMediaStream) {
      remoteStream.current.srcObject = remoteMediaStream;
    }
    if(localStream.current && localMediaStream) {
      localStream.current.srcObject = localMediaStream;
    }
  }, [remoteMediaStream, localMediaStream]);


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
        const stream = event.streams[0];
        dispatch(setRemoteMediaStream(stream))
      }
    }

    socket.on("offer", async ({sdp, senderId}) => {
      if(senderId == userId)return;
      localStream.current.srcObject.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream.current.srcObject);
      });
      const offer = new RTCSessionDescription({ type: 'offer', sdp: sdp });
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', {sdp:answer.sdp, conversationId});
    });
  
    socket.on("answer", async ({sdp, senderId}) => {
      if(senderId == userId)return;
      try {
        const answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
        await peerConnection.setRemoteDescription(answer);
      }
      catch(err) {
        console.log("Error while setting answer in remote description", err);
      }
    })
  
    socket.on("candidate", async ({candidate, senderId}) => {
      if(senderId == userId)return;
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
        dispatch(setLocalMediaStream(stream));
      } catch (err) {
        setError("Failed to access media devices: " + err.message);
      }
    };

    getMedia();

    return () => {
      
    };
  }, [socket, conversationId, peerConnection, userId]);



  const handelStartVideoCall = async () => {
    localStream.current.srcObject.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.current.srcObject);
    });
    
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await setCallStatus(true);
    socket.emit("offer", {sdp: offer.sdp, conversationId});
  };
  
  
  
  
  
  function handelStopVideoCall() {
    peerConnection.close();
    setCallStatus(false);
    dispatch(clearMediaStreams());
  }
  
  
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
      {callStatus
      ? <button
          onClick={handelStopVideoCall}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Stop
        </button>
      : <button
          onClick={handelStartVideoCall}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Start
        </button>}
        

    </>
  )}
</div>

  )
};

export default VideoPage;


