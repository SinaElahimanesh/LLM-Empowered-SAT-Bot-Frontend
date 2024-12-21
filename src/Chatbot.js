import React, { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { TbMessageChatbotFilled } from "react-icons/tb";
import axios from 'axios';


const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "سلام! چطور میتونم کمکتون کنم؟", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const chatAreaRef = useRef(null);

    // const sendMessage = () => {
    //     if (input.trim() !== "") {
    //         setMessages([...messages, { text: input, sender: "user" }]);
    //         setInput("");

    //         // Show placeholder dots for the bot's response
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             { text: "...", sender: "bot-placeholder" },
    //         ]);

    //         setIsTyping(true);

    //         // Simulate bot's response after 2 seconds
    //         setTimeout(() => {
    //             setIsTyping(false);
    //             setMessages((prevMessages) =>
    //                 prevMessages.map((message, index) =>
    //                     index === prevMessages.length - 1 && message.sender === "bot-placeholder"
    //                         ? { text: "ممنونم از پیامتون!", sender: "bot" }
    //                         : message
    //                 )
    //             );
    //         }, 2000);

    //         setTimeout(() => {
    //             if (chatAreaRef.current) {
    //                 chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    //             }
    //         }, 100);
    //     }
    // };

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add the user's message to the chat
        const userMessage = { text: input, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            // Send the message to the backend
            const response = await axios.post(
                'http://localhost:8000/api/message/',
                { text: input },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access')}`,
                    },
                }
            );

            // Add the chatbot's response to the chat

            const botMessage = { text: response.data.response, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.log("auth: ", localStorage.getItem('access'));
            console.error('Error sending message:', error);
            const errorMessage = { text: 'Error: Unable to fetch response.', sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setInput(''); // Clear the input field
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-blue-50">
            {/* Chatbot Container */}
            <div className="flex flex-col w-full max-w-3xl h-full bg-white shadow-2xl rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
                    <button className="hover:text-red-400 transition duration-200">
                        <AiOutlineClose size={24} />
                    </button>
                    <h2 className="text-xl font-bold">بات دلبستگی به خود</h2>
                    <div className="rounded-full bg-indigo-800 p-2 shadow-md">
                        <span role="img" aria-label="bot" className="text-2xl">
                            <TbMessageChatbotFilled />
                        </span>
                    </div>
                </div>

                <div ref={chatAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                dir="rtl"
                                className={`max-w-xs px-4 py-2 ${msg.sender === "user"
                                    ? "bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl"
                                    : "bg-gray-200 text-blue-700 rounded-r-2xl rounded-tl-2xl"
                                    }`}
                            >
                                {msg.text}
                            </div>

                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div dir="rtl" className="flex items-center text-sm justify-center px-4 py-3 bg-gradient-to-r from-grey-900 to-indigo-500 text-white">
                    <button className="bg-white text-blue-500 mx-2 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-200">
                        سلام!
                    </button>
                    <button className="bg-white text-blue-500 mx-2 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-200">
                        حالم خوبه.
                    </button>
                    <button className="bg-white text-blue-500 mx-2 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition duration-200">
                        نیاز به کمک دارم.
                    </button>
                </div>

                {/* Input Area */}
                <div className="flex items-center px-4 py-3 bg-white shadow-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full text-blue-700 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        dir="rtl"
                        placeholder="پیام خود را وارد کنید..."
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition duration-200"
                    >
                        <FiSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
