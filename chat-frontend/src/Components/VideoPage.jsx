import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import Peer from "simple-peer";
// import 

// const pcConstraints = {
//   optional: [{ DtlsSrtpKeyAgreement: true }],
// };
// const servers = {
//     iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun.l.google.com:5349" },
//         { urls: "stun:stun1.l.google.com:3478" },
//         { urls: "stun:stun1.l.google.com:5349" },
//         { urls: "stun:stun2.l.google.com:19302" },
//         { urls: "stun:stun2.l.google.com:5349" },
//         { urls: "stun:stun3.l.google.com:3478" },
//         { urls: "stun:stun3.l.google.com:5349" },
//         { urls: "stun:stun4.l.google.com:19302" },
//         { urls: "stun:stun4.l.google.com:5349" }
//     ]
// };

// const VideoPage = () => {
//   const conversationId = useSelector((state) => state.chat.selectedConversationID);
//   const userId = useSelector((state) => state.auth.user.id);
//   console.log("The conversation id is: ", conversationId);
//   const [socket] = useOutletContext();
//   const localStream = useRef(null);
//   const remoteStream = useRef(null);
//   const localPeerConnection = useRef(null);
//   const [error, setError] = useState(null);
//   const [answerButton, setAnswerButton] = useState(false);
// //   const [localStream, setLocalStream] = useState(null);
// //   const [remoteStream, setRemoteStream] = useState(null);

//   useEffect(() => {
//     const getMedia = async () => {
//       try {
//         // Request video and audio stream from the user's device
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStream.current.srcObject = stream;
//       } catch (err) {
//         setError("Failed to access media devices: " + err.message);
//       }
//     };

//     getMedia();

//     // Clean up the stream when the component is unmounted
//     return () => {
//         localStream.current = null;
//         remoteStream.current = null;
//     };
//   }, []);





//   // When user clicks call button, we will create the p2p connection with RTCPeerConnection
//   const callOnClick = () => {
//     console.log("callOnClick invoked");
//     if (localStream.getVideoTracks().length > 0) {
//       console.log(
//         `Using video device: ${localStream.getVideoTracks()[0].label}`
//       );
//     }
//     if (localStream.getAudioTracks().length > 0) {
//       console.log(
//         `Using audio device: ${localStream.getAudioTracks()[0].label}`
//       );
//     }
//     localPeerConnection.current = new RTCPeerConnection(servers, pcConstraints);
//     localPeerConnection.current.onicecandidate = gotLocalIceCandidateOffer;
//     localPeerConnection.current.onaddstream = gotRemoteStream;
//     localPeerConnection.current.addStream(localStream);
//     localPeerConnection.current.createOffer().then(gotLocalDescription);
//   };
//   // async function to handle offer sdp
//   const onAnswer = (offer) => {
//     console.log('onAnswer invoked');
//     setAnswerButton(false);
//     // setHangupButtonDisabled(false);

//     if (localStream.getVideoTracks().length > 0) {
//             console.log(`Using video device: ${localStream.getVideoTracks()[0].label}`);
//         }
//         if (localStream.getAudioTracks().length > 0) {
//             console.log(`Using audio device: ${localStream.getAudioTracks()[0].label}`);
//         }
//         localPeerConnection.current = new RTCPeerConnection(servers, pcConstraints);
//         localPeerConnection.current.onicecandidate = gotLocalIceCandidateAnswer;
//         localPeerConnection.current.onaddstream = gotRemoteStream;
//         localPeerConnection.current.addStream(localStream);
//         localPeerConnection.current.setRemoteDescription(offer);
//         localPeerConnection.current.createAnswer().then(gotAnswerDescription);
//     };



//   const gotLocalDescription = (offer) => {
//     console.log("gotLocalDescription invoked:", offer);
//     localPeerConnection.setLocalDescription(offer);
//   };
//   const gotAnswerDescription = (answer) => {
//       console.log('gotAnswerDescription invoked:', answer);
//       localPeerConnection.setLocalDescription(answer);
//   };

  
//   // async function to handle received remote stream
//   const gotRemoteStream = (event) => {
//     console.log("gotRemoteStream invoked");

//     remoteStream.current.srcObject = event.stream;
//   };
//   // async function to handle ice candidates
//   const gotLocalIceCandidateOffer = (event) => {
//     console.log(
//       "gotLocalIceCandidateOffer invoked",
//       event.candidate,
//       localPeerConnection.localDescription
//     );
//     // when gathering candidate finished, send complete sdp
//     if (!event.candidate) {
//       const offer = localPeerConnection.localDescription;
//       // send offer sdp to signaling server via websocket
//       socket.emit("send_offer", {
//         conversationId,
//         userId,
//         sdp: offer,
//       });
//     }
//   };

//   const gotLocalIceCandidateAnswer = (event) => {
//       console.log('gotLocalIceCandidateAnswer invoked', event.candidate, localPeerConnection.localDescription);
//       // gathering candidate finished, send complete sdp
//       if (!event.candidate) {
//           const answer = localPeerConnection.localDescription;
//           socket.emit('send_answer', {
//             conversationId,
//             userId,
//             sdp: answer,
//           });
//        }
//    };



//    return (
//     <div className="video-container">
//       {error ? (
//         <p>{error}</p>
//       ) : (
//         <>
//           <video ref={localStream} autoPlay playsInline controls />
//           <button onClick={callOnClick}>Start</button>
//           <video ref={remoteStream} autoPlay playsInline controls />
//           <button onClick={onAnswer}>Accept</button>
//         </>
//       )}
//     </div>
//   );

// };

// export default VideoPage;


export default function VideoPage() {
  const [socket] = useOutletContext();
  // const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	// const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()
  const conversationId = useSelector((state) => state.chat.selectedConversationID);

  useEffect(() => {
    if(!socket)return
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})

	// socket.on("me", (id) => {
	// 		setMe(id)
	// 	})

		socket.on("callUser", (data) => {
			setReceivingCall(true)
			// setCaller(data.from)
			// setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [socket])


  const callUser = () => {
    console.log(stream);
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				signalData: data,
        conversationId
			})
		})
		peer.on("stream", (stream) => {
				userVideo.current.srcObject = stream
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

	const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, conversationId })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}

	return (
		<>
			<h1 style={{ textAlign: "center", color: '#fff' }}>Zoomish</h1>
		<div className="container">
			<div className="video-container">
				<div className="video">
					<video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
				</div>
				<div className="video">
					{callAccepted && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
				</div>
			</div>
			<div className="myId">
				<input
          type="text"
					id="filled-basic"
					label="Name"
					// variant="filled"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ marginBottom: "20px" }}
				/>

				<input
          type="text"
					id="filled-basic"
					label="ID to call"
					// variant="filled"
					value={idToCall}
					onChange={(e) => setIdToCall(e.target.value)}
				/>
				<div className="call-button">
					{callAccepted && !callEnded ? (
						<button color="secondary" onClick={leaveCall}>
							End Call
						</button>
					) : (
						<button color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
							{/* <PhoneIcon fontSize="large" /> */}
              Call
						</button>
					)}
					{idToCall}
				</div>
			</div>
			<div>
				{receivingCall && !callAccepted ? (
						<div className="caller">
						<h1 >{name} is calling...</h1>
						<button color="primary" onClick={answerCall}>
							Answer
						</button>
					</div>
				) : null}
			</div>
		</div>
		</>
	)
}