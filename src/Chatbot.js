// // import React, { useState, useRef, useEffect } from "react";
// // import { FiSend } from "react-icons/fi";
// // import { AiOutlineClose } from "react-icons/ai";
// // import { TbMessageChatbotFilled } from "react-icons/tb";
// // import axios from "axios";
// // import EXIMG from "./assets/test.jpeg";
// // import ExerciseMessage from "./ExerciseMessage";

// // const Chatbot = () => {
// //     const [messages, setMessages] = useState([
// //         { text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }
// //     ]);
// //     const [input, setInput] = useState("");
// //     const [isTyping, setIsTyping] = useState(false);
// //     const [recommendations, setRecommendations] = useState(["سلام", "به کمک نیاز دارم"]);
// //     const [dots, setDots] = useState(".");
// //     const [chatState, setChatState] = useState(null);

// //     const chatAreaRef = useRef(null);

// //     const restartChat = () => {
// //         setRecommendations(["سلام", "به کمک نیاز دارم"])
// //         setChatState(null);
// //         setMessages([{ text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }])
// //     }

// //     // Function to animate waiting dots
// //     useEffect(() => {
// //         if (recommendations.length === 0 && isTyping) {
// //             const interval = setInterval(() => {
// //                 setDots((prev) => (prev.length < 3 ? prev + "." : "."));
// //             }, 500);

// //             return () => clearInterval(interval); // Cleanup
// //         }
// //     }, [recommendations, isTyping]);

// //     // const sendMessage = async (text = input) => {
// //     //     if (!text.trim()) return;

// //     //     // Add the user's message to the chat
// //     //     const userMessage = { text, sender: "user" };
// //     //     setMessages((prevMessages) => [...prevMessages, userMessage]);
// //     //     setInput("");
// //     //     setRecommendations([]);
// //     //     setIsTyping(true); // Show typing animation

// //     //     try {
// //     //         // Send the message to the backend
// //     //         const response = await axios.post(
// //     //             "http://localhost:8000/api/message/",
// //     //             { text },
// //     //             {
// //     //                 headers: {
// //     //                     Authorization: `Bearer ${localStorage.getItem("access")}`
// //     //                 }
// //     //             }
// //     //         );

// //     //         console.log("msg res: ", response);

// //     //         // Add bot's message and recommendations to the chat
// //     //         const botMessage = { text: response.data.response, sender: "bot" };
// //     //         setChatState(response.data.state);
// //     //         setMessages((prevMessages) => [...prevMessages, botMessage]);
// //     //         setRecommendations(response.data.recommendations || []);
// //     //     } catch (error) {
// //     //         console.error("Error sending message:", error);
// //     //         const errorMessage = { text: "Error: Unable to fetch response.", sender: "bot" };
// //     //         setMessages((prevMessages) => [...prevMessages, errorMessage]);
// //     //     } finally {
// //     //         setIsTyping(false);
// //     //     }
// //     // };

// //     const sendMessage = async (text = input) => {
// //         if (!text.trim()) return;

// //         const userMessage = { text, sender: "user" };
// //         setMessages((prevMessages) => [...prevMessages, userMessage]);
// //         setInput("");
// //         setRecommendations([]);
// //         setIsTyping(true);

// //         try {
// //             const response = await axios.post(
// //                 "http://localhost:8000/api/message/",
// //                 { text },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${localStorage.getItem("access")}`
// //                     }
// //                 }
// //             );

// //             console.log("msg res: ", response);

// //             // Store state inside the message itself
// //             const botMessage = {
// //                 text: response.data.response,
// //                 sender: "bot",
// //                 state: response.data.state // Store the state inside the message
// //             };

// //             setMessages((prevMessages) => [...prevMessages, botMessage]);
// //             setRecommendations(response.data.recommendations || []);
// //         } catch (error) {
// //             console.error("Error sending message:", error);
// //             const errorMessage = { text: "Error: Unable to fetch response.", sender: "bot" };
// //             setMessages((prevMessages) => [...prevMessages, errorMessage]);
// //         } finally {
// //             setIsTyping(false);
// //         }
// //     };


// //     const handleKeyDown = (e) => {
// //         if (e.key === "Enter") {
// //             e.preventDefault();
// //             sendMessage();
// //         }
// //     };

// //     useEffect(() => {
// //         if (chatAreaRef.current) {
// //             chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
// //         }
// //     }, [messages]);

// //     return (
// //         <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-50">
// //             {/* Chatbot Container */}
// //             <div className="flex flex-col w-full max-w-3xl h-full bg-white shadow-2xl rounded-lg overflow-hidden">
// //                 {/* Header */}
// //                 <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
// //                     <button className="hover:text-red-400 transition duration-200">
// //                         <AiOutlineClose size={24} />
// //                     </button>
// //                     <h2 className="text-xl font-bold">بات دلبستگی به خود</h2>
// //                     <div className="rounded-full bg-indigo-800 p-2 shadow-md">
// //                         <span role="img" aria-label="bot" className="text-2xl">
// //                             <TbMessageChatbotFilled />
// //                         </span>
// //                     </div>
// //                 </div>

// //                 <div ref={chatAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
// //                     {messages.map((msg, index) => (
// //                         <div
// //                             key={index}
// //                             className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
// //                         >
// //                             <div
// //                                 dir="rtl"
// //                                 className={`max-w-xs px-4 py-2 ${msg.sender === "user"
// //                                     ? "bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl"
// //                                     : "bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl"
// //                                     }`}
// //                             >
// //                                 {msg.state === "INVITE_TO_ATTEMPT_EXC" ? (
// //                                     <ExerciseMessage msg={msg.text} img={EXIMG} />
// //                                 ) : (
// //                                     msg.text
// //                                 )}
// //                             </div>
// //                         </div>
// //                     ))}


// //                     {/* Typing Indicator */}
// //                     {isTyping && (
// //                         <div className="flex justify-start">
// //                             <div
// //                                 className="bg-gray-200 text-blue-700 px-4 py-2 rounded-r-2xl rounded-tl-2xl animate-pulse"
// //                                 dir="rtl"
// //                             >
// //                                 {dots}
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>

// //                 {/* Action Buttons or Animated Waiting */}
// //                 {chatState !== "END" && <div
// //                     dir="rtl"
// //                     className="flex items-center text-sm justify-center px-4 py-3 bg-gradient-to-r from-grey-900 to-indigo-500 text-grey100"
// //                 >
// //                     {recommendations.length > 0 ? (
// //                         recommendations.map((recommendation, index) => (
// //                             <button
// //                                 key={index}
// //                                 className="bg-white text-blue-500 mx-2 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-200"
// //                                 onClick={() => sendMessage(recommendation)}
// //                             >
// //                                 {recommendation}
// //                             </button>
// //                         ))
// //                     ) : (
// //                         <p className="text-grey100"></p>
// //                     )}
// //                 </div>}

// //                 {/* Input Area */}
// //                 <div className="flex items-center px-4 py-3 bg-white shadow-lg">
// //                     {chatState !== "END" ? <>
// //                         <input
// //                             type="text"
// //                             value={input}
// //                             onChange={(e) => setInput(e.target.value)}
// //                             onKeyDown={handleKeyDown}
// //                             className="flex-grow px-4 py-2 border border-gray-300 rounded-full text-blue-700 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
// //                             dir="rtl"
// //                             placeholder="پیام خود را وارد کنید..."
// //                         />
// //                         <button
// //                             onClick={() => sendMessage()}
// //                             className="ml-2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition duration-200"
// //                         >
// //                             <FiSend size={20} />
// //                         </button>
// //                     </> : <><button
// //                         className="bg-purple-500 text-white mx-auto px-4 py-2 rounded-full shadow-md hover:bg-purple-400 transition duration-200"
// //                         onClick={() => restartChat()}
// //                     >
// //                         شروع مجدد
// //                     </button></>

// //                     }

// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Chatbot;


// import React, { useState, useRef, useEffect } from "react";
// import { FiSend, FiMic } from "react-icons/fi";
// import { AiOutlineClose } from "react-icons/ai";
// import { TbMessageChatbotFilled } from "react-icons/tb";
// import axios from "axios";
// import EXIMG from "./assets/test.jpeg";
// import ExerciseMessage from "./ExerciseMessage";

// const Chatbot = () => {
//     const [messages, setMessages] = useState([
//         { text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }
//     ]);
//     const [input, setInput] = useState("");
//     const [isTyping, setIsTyping] = useState(false);
//     const [recommendations, setRecommendations] = useState(["سلام", "به کمک نیاز دارم"]);
//     const [dots, setDots] = useState(".");
//     const [chatState, setChatState] = useState(null);
//     const [recording, setRecording] = useState(false);
//     const mediaRecorderRef = useRef(null);
//     const audioChunksRef = useRef([]);

//     const chatAreaRef = useRef(null);

//     const restartChat = () => {
//         setRecommendations(["سلام", "به کمک نیاز دارم"]);
//         setChatState(null);
//         setMessages([{ text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }]);
//     };

//     useEffect(() => {
//         if (recommendations.length === 0 && isTyping) {
//             const interval = setInterval(() => {
//                 setDots((prev) => (prev.length < 3 ? prev + "." : "."));
//             }, 500);

//             return () => clearInterval(interval);
//         }
//     }, [recommendations, isTyping]);

//     const sendMessage = async (text = input) => {
//         if (!text.trim()) return;

//         const userMessage = { text, sender: "user" };
//         setMessages((prevMessages) => [...prevMessages, userMessage]);
//         setInput("");
//         setRecommendations([]);
//         setIsTyping(true);

//         try {
//             const response = await axios.post(
//                 "http://localhost:8000/api/message/",
//                 { text },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("access")}`
//                     }
//                 }
//             );

//             const botMessage = {
//                 text: response.data.response,
//                 sender: "bot",
//                 state: response.data.state
//             };

//             setMessages((prevMessages) => [...prevMessages, botMessage]);
//             setRecommendations(response.data.recommendations || []);
//         } catch (error) {
//             console.error("Error sending message:", error);
//             const errorMessage = { text: "Error: Unable to fetch response.", sender: "bot" };
//             setMessages((prevMessages) => [...prevMessages, errorMessage]);
//         } finally {
//             setIsTyping(false);
//         }
//     };

//     const startRecording = async () => {
//         setRecording(true);
//         audioChunksRef.current = [];
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const mediaRecorder = new MediaRecorder(stream);
//             mediaRecorderRef.current = mediaRecorder;

//             mediaRecorder.ondataavailable = (event) => {
//                 if (event.data.size > 0) {
//                     audioChunksRef.current.push(event.data);
//                 }
//             };

//             mediaRecorder.onstop = async () => {
//                 setRecording(false);
//                 const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
//                 sendAudioMessage(audioBlob);
//             };

//             mediaRecorder.start();
//         } catch (error) {
//             console.error("Error accessing microphone:", error);
//         }
//     };

//     const stopRecording = () => {
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//         }
//     };

//     const sendAudioMessage = async (audioBlob) => {
//         const formData = new FormData();
//         formData.append("audio", audioBlob, "voice_message.wav");

//         try {
//             const response = await axios.post("http://localhost:8000/api/audio-message/", formData, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("access")}`,
//                     "Content-Type": "multipart/form-data"
//                 }
//             });

//             const botMessage = { text: response.data.response, sender: "bot" };
//             setMessages((prevMessages) => [...prevMessages, botMessage]);
//         } catch (error) {
//             console.error("Error sending audio message:", error);
//         }
//     };
//     return (
//         <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-50">
//             <div className="flex flex-col w-full max-w-3xl h-full bg-white shadow-2xl rounded-lg overflow-hidden">
//                 <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
//                     <button className="hover:text-red-400 transition duration-200">
//                         <AiOutlineClose size={24} />
//                     </button>
//                     <h2 className="text-xl font-bold">بات دلبستگی به خود</h2>
//                     <div className="rounded-full bg-indigo-800 p-2 shadow-md">
//                         <TbMessageChatbotFilled className="text-2xl" />
//                     </div>
//                 </div>

//                 <div ref={chatAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
//                     {messages.map((msg, index) => (
//                         <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                             <div className={`max-w-xs px-4 py-2 ${msg.sender === "user" ? "bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl" : "bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl"}`}>
//                                 {msg.state === "INVITE_TO_ATTEMPT_EXC" ? (
//                                     <ExerciseMessage msg={msg.text} img={EXIMG} />
//                                 ) : (
//                                     msg.text
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex items-center px-4 py-3 bg-white shadow-lg">
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         className="flex-grow px-4 py-2 border border-gray-300 rounded-full"
//                         placeholder="پیام خود را وارد کنید..."
//                     />
//                     <button onClick={recording ? stopRecording : startRecording} className="ml-2 p-3 rounded-full bg-red-500 text-white">
//                         <FiMic size={20} />
//                     </button>
//                     <button onClick={sendMessage} className="ml-2 p-3 rounded-full bg-blue-500 text-white">
//                         <FiSend size={20} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Chatbot;



import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMic } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { TbMessageChatbotFilled } from "react-icons/tb";
import axios from "axios";
import EXIMG from "./assets/test.jpeg";
import ExerciseMessage from "./ExerciseMessage";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [recommendations, setRecommendations] = useState(["سلام", "به کمک نیاز دارم"]);
    const [dots, setDots] = useState(".");
    const [chatState, setChatState] = useState(null);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const chatAreaRef = useRef(null);

    const restartChat = () => {
        setRecommendations(["سلام", "به کمک نیاز دارم"]);
        setChatState(null);
        setMessages([{ text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }]);
    };

    useEffect(() => {
        if (recommendations.length === 0 && isTyping) {
            const interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : "."));
            }, 500);

            return () => clearInterval(interval);
        }
    }, [recommendations, isTyping]);

    const sendMessage = async (text = input) => {
        text = typeof text === "string" ? text.trim() : "";
        if (!text) return;

        const userMessage = { text, sender: "user" };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
        setRecommendations([]);
        setIsTyping(true);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/message/",
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            const botMessage = {
                text: response.data.response,
                sender: "bot",
                state: response.data.state
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
            setRecommendations(response.data.recommendations || []);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { text: "Error: Unable to fetch response.", sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const startRecording = async () => {
        setRecording(true);
        audioChunksRef.current = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                setRecording(false);
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                sendAudioMessage(audioBlob);
            };

            mediaRecorder.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const sendAudioMessage = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice_message.wav");

        try {
            const response = await axios.post("http://localhost:8000/api/audio-message/", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const botMessage = { text: response.data.response, sender: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending audio message:", error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-50">
            <div className="flex flex-col w-full max-w-3xl h-full bg-white shadow-2xl rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
                    <button className="hover:text-red-400 transition duration-200">
                        <AiOutlineClose size={24} />
                    </button>
                    <h2 className="text-xl font-bold">بات دلبستگی به خود</h2>
                    <div className="rounded-full bg-indigo-800 p-2 shadow-md">
                        <TbMessageChatbotFilled className="text-2xl" />
                    </div>
                </div>

                <div ref={chatAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs px-4 py-2 ${msg.sender === "user" ? "bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl" : "bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl"}`}>
                                {msg.state === "INVITE_TO_ATTEMPT_EXC" ? (
                                    <ExerciseMessage msg={msg.text} img={EXIMG} />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center px-4 py-3 bg-white shadow-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full"
                        placeholder="پیام خود را وارد کنید..."
                    />
                    <button onClick={recording ? stopRecording : startRecording} className="ml-2 p-3 rounded-full bg-red-500 text-white">
                        <FiMic size={20} />
                    </button>
                    <button onClick={sendMessage} className="ml-2 p-3 rounded-full bg-blue-500 text-white">
                        <FiSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
