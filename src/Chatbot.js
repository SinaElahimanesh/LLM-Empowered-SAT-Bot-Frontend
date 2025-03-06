

import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMic } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { TbMessageChatbotFilled } from "react-icons/tb";
import axios from "axios";
import EXIMG from "./assets/test.jpeg";
import ExerciseMessage from "./ExerciseMessage";

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "سلام! خوشحالم میبینمت.", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [recommendations, setRecommendations] = useState(["سلام", "به کمک نیاز دارم"]);
    const [dots, setDots] = useState(".");
    const [chatState, setChatState] = useState(null);
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const lastMessageRef = useRef(null);
    const [queue, setQueue] = useState([]); // Queue to hold split messages

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const chatAreaRef = useRef(null);

    const splitBotMessage = (text) => {
        const words = text.split(" ");
        if (words.length <= 20) return [text]; // No need to split if short
    
        let messages = [];
        let tempMessage = [];
    
        for (let i = 0; i < words.length; i++) {
            tempMessage.push(words[i]);
    
            // Check if word ends in punctuation and we have at least 20 words
            if (tempMessage.length >= 20 && /[.!?]$/.test(words[i])) {
                messages.push(tempMessage.join(" "));
                tempMessage = [];
            }
        }
    
        // Push remaining words if any
        if (tempMessage.length) messages.push(tempMessage.join(" "));
        return messages;
    };
    

    useEffect(() => {
        if (queue.length === 0) return;
    
        const interval = setInterval(() => {
            setMessages((prev) => [...prev, queue[0]]);
            setQueue((prevQueue) => prevQueue.slice(1));
        }, 2000); // Show each message with 1-second delay
    
        return () => clearInterval(interval);
    }, [queue]);    

    const restartChat = () => {
        setRecommendations(["سلام", "به کمک نیاز دارم"]);
        setChatState(null);
        setMessages([{ text: "سلام! خوشحالم میبینمت.", sender: "bot" }]);
    };

    useEffect(() => {
        if (recommendations.length === 0 && isTyping) {
            const interval = setInterval(() => {
                setDots((prev) => (prev.length < 3 ? prev + "." : "."));
            }, 500);

            return () => clearInterval(interval);
        }
    }, [recommendations, isTyping]);

    const sendMessage = async () => {
        const text = input.trim();
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
                    headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
                }
            );
    
            const botResponses = splitBotMessage(response.data.response).map((msg) => ({
                text: msg,
                sender: "bot"
            }));

            console.log("bot", botResponses)
    
            setQueue(botResponses); // Add split messages to queue for sequential display
            setRecommendations(response.data.recommendations || []);
        } catch (error) {
            console.error("Error sending message:", error);
            setQueue([{ text: "Error: Unable to fetch response.", sender: "bot" }]);
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
                    {messages.flatMap((msg, index) => 
                        msg.sender === "bot"
                            ? splitBotMessage(msg.text).map((splitMsg, subIndex) => (
                                <div key={`${index}-${subIndex}`} className="flex justify-start">
                                    <div className="max-w-xs px-4 py-2 bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl">
                                        {splitMsg}
                                    </div>
                                </div>
                            ))
                            : (
                                <div key={index} className="flex justify-end">
                                    <div className="max-w-xs px-4 py-2 bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl">
                                        {msg.text}
                                    </div>
                                </div>
                            )
                    )}
                </div>

                <div className="flex items-center px-4 py-3 bg-white shadow-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full"
                        placeholder="پیام خود را وارد کنید..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
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
