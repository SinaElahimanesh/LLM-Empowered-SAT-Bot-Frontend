import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMic, FiStopCircle } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { TbMessageChatbot, TbMessageChatbotFilled } from "react-icons/tb";
import axios from "axios";
import { ExcImage } from "./Images";
import { message, Typography } from "antd";
import clsx from "clsx";
import "./App.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "سلام! خوشحالم میبینمت.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([
    "سلام",
    "به کمک نیاز دارم",
  ]);
  const [dots, setDots] = useState(".");
  const [chatState, setChatState] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const lastMessageRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [excImage, setExcImage] = useState(null);
  const [isThisExc, setIsThisExc] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const chatAreaRef = useRef(null);

  const splitBotMessage = (text) => {
    if (!text) return;
    const words = text?.split(" ");
    if (words?.length <= 20) return [text];

    let messages = [];
    let tempMessage = [];

    for (let i = 0; i < words.length; i++) {
      tempMessage.push(words[i]);

      if (tempMessage.length >= 20 && /[.!?]$/.test(words[i])) {
        messages.push(tempMessage.join(" "));
        tempMessage = [];
      }
    }

    if (tempMessage.length) messages.push(tempMessage.join(" "));
    return messages;
  };

  useEffect(() => {
    localStorage.setItem(
      "chat_recommendations",
      JSON.stringify(recommendations)
    );
  }, [recommendations]);

  useEffect(() => {
    const savedRecs = localStorage.getItem("chat_recommendations");
    if (savedRecs) {
      setRecommendations(JSON.parse(savedRecs));
    }
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;

    const interval = setInterval(() => {
      setMessages((prev) => [...prev, queue[0]]);
      setQueue((prevQueue) => prevQueue.slice(1));
    }, 0);

    return () => clearInterval(interval);
  }, [queue]);

  const restartChat = () => {
    setRecommendations(["سلام", "به کمک نیاز دارم"]);
    setChatState(null);
    const welcomeMessage = [{ text: "سلام! خوشحالم میبینمت.", sender: "bot" }];
    setMessages(welcomeMessage);
    localStorage.setItem("chat_messages", JSON.stringify(welcomeMessage));
  };

  useEffect(() => {
    if (recommendations.length === 0 && isTyping) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : "."));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [recommendations, isTyping]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      const botResponses = splitBotMessage(response.data.response).map(
        (msg) => ({
          text: msg,
          sender: "bot",
        })
      );

      console.log("bot", botResponses);

      let randomNumber = getRandomInt(8);

      if (response.data.state === "INVITE_TO_ATTEMPT_EXC") {
        setExcImage(ExcImage[randomNumber]);
      }

      setQueue(botResponses);
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error("Error sending message:", error);
      setQueue([{ text: "Error: Unable to fetch response.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      setRecording(true);
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setRecording(false);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        sendAudioMessage(audioBlob);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Microphone access error:", error);
      messageApi.open({
        type: "error",
        content:
          "نمیتوان به میکروفن دسترسی پیدا کرد. لطفاً تنظیمات مرورگر را بررسی کنید.",
      });
      setRecording(false);
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
      const response = await axios.post(
        "http://localhost:8000/api/send-audio/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("RESPONSE: ", response.data.transcription);

      const botMessage = { text: response.data.transcription, sender: "user" };
      // setMessages((prevMessages) => [...prevMessages, botMessage]);
      setInput(botMessage.text);
      sendMessage();
    } catch (error) {
      console.error(
        "Error sending audio message:",
        error.response?.data || error.message
      );
      setMessages((prev) => [
        ...prev,
        { text: "خطا در ارسال پیام صوتی.", sender: "user" },
      ]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  console.log(messages);

  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-50">
        <div className="flex flex-col w-full max-w-3xl h-full bg-grey-50 shadow-2xl rounded-lg overflow-hidden">
          <HeaderComponent handleLogout={handleLogout} />

          <div
            ref={chatAreaRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 app-background"
          >
            {messages.flatMap((msg, index) =>
              msg.sender === "bot" ? (
                splitBotMessage(msg.text).map((splitMsg, subIndex) => (
                  //   <div
                  //     dir="rtl"
                  //     key={`${index}-${subIndex}`}
                  //     className="flex justify-end"
                  //   >
                  //     <div className="max-w-sm px-4 py-2 bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl">
                  //       {splitMsg}
                  //     </div>
                  //   </div>
                  <MessageComponent text={msg.text} sender="bot" />
                ))
              ) : (
                // <div dir="rtl" key={index} className="flex justify-start">
                //   <div className="max-w-xs px-4 py-2 bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl">
                //     {msg.text}
                //   </div>
                // </div>
                <MessageComponent text={msg.text} sender="me" />
              )
            )}
            <div ref={messagesEndRef} />

            {isTyping && (
              <div className="flex bg-grey-600 justify-start">
                <div className="px-4 py-2 bg-gray-200 rounded-r-2xl rounded-tl-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center px-4 py-3 bg- shadow-lg">
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
              dir="rtl"
            />
            {recording && (
              <div dir="rtl" className="flex justify-start">
                <div className="px-4 py-2 bg-gray-200 rounded-r-2xl rounded-tl-2xl flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                  <span className="text-sm text-red-600">
                    در حال ضبط صدا...
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={recording ? stopRecording : startRecording}
              className="ml-2 p-3 rounded-full bg-red-500 text-white"
            >
              {recording ? <FiStopCircle size={20} /> : <FiMic size={20} />}
            </button>
            <button
              onClick={sendMessage}
              className="ml-2 p-3 rounded-full bg-blue-500 text-white"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const HeaderComponent = ({ handleLogout }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
      <button
        className="hover:text-red-400 transition duration-200"
        onClick={handleLogout}
      >
        <CiLogout size={24} />
      </button>
      <h2 className="text-xl font-bold">بات دلبستگی به خود</h2>
      <div className="rounded-full bg-indigo-800 p-2 shadow-md">
        <TbMessageChatbotFilled className="text-2xl" />
      </div>
    </div>
  );
};

const MessageComponent = ({ text, timestamp, sender, avatarUrl, name }) => {
  const { Paragraph, Text } = Typography;

  const isMe = sender === "me";

  return (
    <div
      className={clsx(
        "flex w-full items-end space-x-2 my-2",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {!isMe && (
        // <img
        //   src={avatarUrl}
        //   alt="avatar"
        //   className="w-8 h-8 rounded-full object-cover shadow"
        // />
        <TbMessageChatbot className="w-8 h-8 mb-8" />
      )}

      <div
        className={clsx(
          "max-w-xs sm:max-w-md",
          isMe ? "text-right" : "text-left"
        )}
        dir="rtl"
      >
        {name && !isMe && (
          <div className="text-xs text-gray-500 font-medium mb-1 ml-1">
            {name}
          </div>
        )}
        {/* <div
          className={clsx(
            "rounded-2xl px-4 py-2 shadow-md text-sm break-words",
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : //   : "bg-gray-100 text-gray-800 rounded-bl-none"
                "bg-slate-200 text-slate-800 rounded-r-2xl rounded-tl-2xl max-w-m px-4 py-2"
          )}
        >
          {text}
        </div> */}

        <Paragraph
          className={clsx(
            "rounded-2xl px-4 py-2 shadow-md text-sm break-words paragraph",
            isMe
              ? "bg-blue-500 text-white rounded-br-none"
              : //   : "bg-gray-100 text-gray-800 rounded-bl-none"
                "bg-slate-200 text-slate-800 rounded-r-2xl rounded-tl-2xl max-w-m px-4 py-2"
          )}
          copyable={!isMe}
        >
          {text}
        </Paragraph>

        <div className="text-[10px] text-gray-400 mt-1 ml-1" dir="ltr">
          {`${new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
