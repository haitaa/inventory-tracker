"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  LuSend,
  LuX,
  LuMessageSquare,
  LuBot,
  LuUser,
  LuMinimize,
  LuMaximize,
  LuTrash2,
  LuFileText,
  LuListTodo,
  LuLanguages,
  LuRepeat,
  LuChevronUp,
  LuLink,
  LuAtSign,
  LuSparkles,
  LuSendHorizontal,
  LuHeart,
  LuUnderline,
  LuPackage,
} from "react-icons/lu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const STORAGE_KEY = "ai_chat_messages";

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // LocalStorage'den mesajları yükle
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Timestamp'leri düzelt
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Mesaj geçmişi yüklenirken hata:", error);
      }
    }
  }, []);

  // Mesajları LocalStorage'e kaydet
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Widget açıldığında veya yeni mesaj geldiğinde aşağı kaydır
  useEffect(() => {
    if (scrollAreaRef.current && messages.length > 0) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, messages]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // API isteği
      const response = await axios.post("/api/chat", {
        message: userMessage.content,
      });

      // API yanıtını al
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        role: "assistant",
        timestamp: new Date(response.data.timestamp || Date.now()),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Önerilen sorular
  const suggestions = [
    "Stok durumu nasıl görüntülenir?",
    "Düşük stok bildirimleri nasıl ayarlanır?",
    "Yeni müşteri kaydı nasıl yapılır?",
    "Aylık satış raporu nasıl alınır?",
    "E-fatura kesme işlemi nasıl yapılır?",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <motion.button
        onClick={handleToggleChat}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg ${
          isOpen
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
            : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
        } transition-colors duration-300`}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <LuX className="h-6 w-6" />
        ) : (
          <LuSparkles className="h-6 w-6" />
        )}
      </motion.button>

      {/* Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : "550px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-16 right-0 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm"
            style={{
              width: "380px",
              height: isMinimized ? "auto" : "550px",
              minHeight: isMinimized ? "0" : "350px",
              background: "rgba(255, 255, 255, 0.97)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Header */}
            <div className="relative p-5 border-b border-gray-100">
              <div className="absolute -top-28 -left-28 w-56 h-56 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -top-28 -right-28 w-56 h-56 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center mr-3 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <LuSparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base text-gray-900">
                      Envanter Asistanı
                    </h3>
                    <p className="text-xs text-gray-500">
                      Nasıl yardımcı olabilirim?
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleMinimize}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    {isMinimized ? (
                      <LuMaximize className="h-4 w-4" />
                    ) : (
                      <LuMinimize className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={handleToggleChat}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <LuX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <ScrollArea
                  className="flex-1 p-4 h-[390px]"
                  ref={scrollAreaRef}
                  scrollHideDelay={0}
                  type="always"
                  style={{ overflowX: "hidden" }}
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-6">
                      <div className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <LuPackage className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium mb-2 text-gray-800">
                        Merhaba, Dijital Asistanınız!
                      </h3>
                      <p className="text-sm text-gray-500 text-center mb-6 max-w-[85%]">
                        Envanter ve müşteri yönetim sisteminde size nasıl
                        yardımcı olabilirim?
                      </p>

                      <div className="w-full space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            className={`w-full py-2.5 px-4 text-sm text-left rounded-xl border transition-all ${
                              activeSuggestion === index
                                ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                                : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                            }`}
                            onClick={() => {
                              setMessage(suggestion);
                              inputRef.current?.focus();
                              setActiveSuggestion(index);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          className={`flex ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div
                            className={`relative max-w-[85%] p-3.5 ${
                              msg.role === "user"
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-none"
                                : "bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none"
                            }`}
                          >
                            {msg.role === "user" && (
                              <div className="absolute -right-1 -top-1 w-4 h-4 rounded-br-md bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                            )}
                            {msg.role === "assistant" && (
                              <div className="absolute -left-1 -top-1 w-4 h-4 rounded-bl-md bg-gray-100"></div>
                            )}
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            <span className="text-xs opacity-70 mt-1.5 block text-right">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="relative max-w-[85%] p-3.5 bg-gray-100 rounded-2xl rounded-tl-none">
                            <div className="absolute -left-1 -top-1 w-4 h-4 rounded-bl-md bg-gray-100"></div>
                            <div className="flex space-x-1.5">
                              <motion.div
                                className="w-2 h-2 bg-indigo-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  delay: 0,
                                }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-indigo-500 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  delay: 0.2,
                                }}
                              />
                              <motion.div
                                className="w-2 h-2 bg-indigo-600 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  delay: 0.4,
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="relative p-4 border-t border-gray-100">
                  <motion.div
                    className="relative flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
                    whileFocus={{ borderColor: "#818cf8" }}
                  >
                    {messages.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        className="ml-2.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Sohbeti temizle"
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    )}
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 border-none shadow-none pl-2 focus-visible:ring-0"
                      disabled={isLoading}
                      ref={inputRef}
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className="relative flex items-center justify-center w-9 h-9 rounded-lg mr-1 overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          !message.trim() || isLoading
                            ? "opacity-0"
                            : "opacity-100"
                        } bg-gradient-to-r from-indigo-500 to-purple-600`}
                      ></div>
                      <LuSendHorizontal
                        className={`h-4 w-4 z-10 transition-colors ${
                          !message.trim() || isLoading
                            ? "text-gray-400"
                            : "text-white"
                        }`}
                      />
                    </motion.button>
                  </motion.div>

                  <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                    <span className="flex items-center justify-end">
                      <LuHeart className="h-3 w-3 mr-1 text-rose-400" />
                      <span>Envanter Asistanı</span>
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatWidget;
