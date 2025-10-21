import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Search,
  User,
  GraduationCap,
  Users,
  Moon,
  Sun,
  Loader,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

const ChatApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [people, setPeople] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mobileView, setMobileView] = useState("chats");
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    const initAuth = async () => {
      try {
        let authData = localStorage.getItem("auth");

        if (authData) {
          const parsedAuth = JSON.parse(authData);
          console.log("Auth data found:", parsedAuth);

          try {
            const response = await fetch(
              "http://localhost:3001/message/people",
              {
                headers: {
                  Authorization: `Bearer ${parsedAuth.accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const currentUserData = data.data.find(
                (p) => p.email === parsedAuth.userEmail
              );

              if (currentUserData) {
                console.log("Found current user data:", currentUserData);
                setCurrentUser({
                  phone: currentUserData.phone,
                  userType: currentUserData.userType,
                  name: parsedAuth.userName,
                  email: parsedAuth.userEmail,
                  id: parsedAuth.userId,
                });
              } else {
                setCurrentUser({
                  phone: parsedAuth.userId,
                  userType: "student",
                  name: parsedAuth.userName,
                  email: parsedAuth.userEmail,
                  id: parsedAuth.userId,
                });
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }

          setIsInitializing(false);
        } else {
          console.log("No auth data found, redirecting to login");
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        window.location.href = "/login";
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (currentUser && !isInitializing) {
      console.log("Fetching people for user:", currentUser);
      fetchPeople();
    }
  }, [currentUser, isInitializing]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      fetchMessages();

      // Auto-refresh messages every second
      const interval = setInterval(() => {
        fetchMessages();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        return parsedAuth.accessToken;
      } catch (error) {
        console.error("Error getting auth token:", error);
        return null;
      }
    }
    return null;
  };

  const handleUnauthorized = () => {
    console.log("Unauthorized - clearing auth and redirecting");
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  const fetchPeople = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No token available");
        handleUnauthorized();
        return;
      }

      console.log("Fetching people...");

      const response = await fetch("http://localhost:3001/message/people", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("People API response status:", response.status);

      if (response.status === 401) {
        console.error("401 Unauthorized - token may be expired");
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        console.error("Failed to fetch people:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("People data received:", data);

      if (data.success && currentUser) {
        const filteredPeople = data.data.filter(
          (p) => p.phone !== currentUser.phone && p.email !== currentUser.email
        );
        setPeople(filteredPeople);

        const messagesResponse = await fetch(
          "http://localhost:3001/message/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (messagesResponse.status === 401) {
          handleUnauthorized();
          return;
        }

        const messagesData = await messagesResponse.json();
        console.log("Messages data received:", messagesData);

        if (messagesData.success) {
          const uniquePhones = new Set();

          messagesData.data.forEach((msg) => {
            if (
              msg.sender.phone !== currentUser.phone &&
              msg.sender.email !== currentUser.email
            ) {
              uniquePhones.add(msg.sender.phone);
            }
            if (
              msg.receiver.phone !== currentUser.phone &&
              msg.receiver.email !== currentUser.email
            ) {
              uniquePhones.add(msg.receiver.phone);
            }
          });

          const recentChatUsers = filteredPeople.filter(
            (p) =>
              uniquePhones.has(p.phone) &&
              p.phone !== currentUser.phone &&
              p.email !== currentUser.email
          );

          setRecentChats(recentChatUsers);
          console.log("Recent chats set:", recentChatUsers.length);
        }
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      console.log("Fetching messages for:", selectedUser.name);
      console.log("Current user phone:", currentUser.phone);
      console.log("Selected user phone:", selectedUser.phone);

      const response = await fetch("http://localhost:3001/message/my", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      console.log("All messages received:", data.data);

      if (data.success) {
        const filtered = data.data.filter(
          (msg) =>
            (msg.sender.phone === selectedUser.phone &&
              msg.receiver.phone === currentUser.phone) ||
            (msg.receiver.phone === selectedUser.phone &&
              msg.sender.phone === currentUser.phone)
        );
        console.log("Filtered messages:", filtered);
        setMessages(filtered);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser || !currentUser) return;
    setLoading(true);
    setIsUserScrolling(false); // Auto-scroll when sending message
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch("http://localhost:3001/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderPhone: currentUser.phone,
          senderType: currentUser.userType,
          receiverPhone: selectedUser.phone,
          receiverType: selectedUser.userType,
          text: messageText,
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        setMessageText("");
        await fetchMessages();

        if (!recentChats.find((rc) => rc.phone === selectedUser.phone)) {
          setRecentChats([selectedUser, ...recentChats]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (!isUserScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsUserScrolling(!isAtBottom);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = recentChats.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isInitializing) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <Loader
            className={`w-12 h-12 mx-auto mb-4 animate-spin ${
              isDarkMode ? "text-purple-500" : "text-purple-600"
            }`}
          />
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden ${
        isDarkMode ? "bg-slate-900" : "bg-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      <div className="flex-1 flex overflow-hidden mt-4 mx-4 gap-4 min-h-0">
        {/* Mobile View */}
        <div className="flex-1 flex flex-col lg:hidden min-h-0 overflow-hidden">
          {!selectedUser ? (
            <>
              {/* Mobile Toggle */}
              <div
                className={`flex border-b flex-shrink-0 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => setMobileView("chats")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mobileView === "chats"
                      ? isDarkMode
                        ? "text-purple-400 border-b-2 border-purple-400"
                        : "text-purple-600 border-b-2 border-purple-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Recent Chats
                </button>
                <button
                  onClick={() => setMobileView("people")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mobileView === "people"
                      ? isDarkMode
                        ? "text-purple-400 border-b-2 border-purple-400"
                        : "text-purple-600 border-b-2 border-purple-600"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  People You May Know
                </button>
              </div>

              {/* Search Bar */}
              <div
                className={`p-4 border-b flex-shrink-0 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-3 w-4 h-4 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors focus:outline-none ${
                      isDarkMode
                        ? "bg-slate-700 text-white placeholder-gray-500"
                        : "bg-gray-100 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Chat List */}
              {mobileView === "chats" && (
                <div
                  className={`flex-1 overflow-y-auto ${
                    isDarkMode ? "bg-slate-900" : "bg-gray-50"
                  }`}
                >
                  {filteredChats.length === 0 ? (
                    <div
                      className={`text-center py-12 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <p className="text-sm">No recent conversations</p>
                    </div>
                  ) : (
                    filteredChats.map((person) => (
                      <div
                        key={`${person.userType}-${person.phone}-${person.id}`}
                        onClick={() => setSelectedUser(person)}
                        className={`px-4 py-4 flex items-center gap-3 border-b cursor-pointer transition-colors ${
                          isDarkMode
                            ? "border-slate-800 hover:bg-slate-800"
                            : "border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              person.userType === "alumni"
                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                : "bg-gradient-to-br from-blue-500 to-cyan-500"
                            }`}
                          >
                            {person.userType === "alumni" ? (
                              <GraduationCap className="w-6 h-6 text-white" />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold truncate ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {person.name}
                          </h3>
                          <p
                            className={`text-sm truncate ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {person.email}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* People List */}
              {mobileView === "people" && (
                <div
                  className={`flex-1 overflow-y-auto ${
                    isDarkMode ? "bg-slate-900" : "bg-gray-50"
                  }`}
                >
                  {filteredPeople
                    .filter(
                      (p) => !recentChats.find((rc) => rc.phone === p.phone)
                    )
                    .map((person) => (
                      <div
                        key={`${person.userType}-${person.phone}-${person.id}`}
                        onClick={() => setSelectedUser(person)}
                        className={`px-4 py-4 flex items-center gap-3 border-b cursor-pointer transition-colors ${
                          isDarkMode
                            ? "border-slate-800 hover:bg-slate-800"
                            : "border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              person.userType === "alumni"
                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                : "bg-gradient-to-br from-blue-500 to-cyan-500"
                            }`}
                          >
                            {person.userType === "alumni" ? (
                              <GraduationCap className="w-6 h-6 text-white" />
                            ) : (
                              <User className="w-6 h-6 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold truncate ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {person.name}
                          </h3>
                          <p
                            className={`text-sm truncate ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {person.email}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          ) : (
            /* Mobile Chat Window */
            <div className="flex-1 flex flex-col overflow-hidden min-h-0 max-h-full">
              {/* Chat Header */}
              <div
                className={`px-4 py-3 flex items-center justify-between border-b flex-shrink-0 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className={`p-2 -ml-2 rounded-lg ${
                      isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedUser.userType === "alumni"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500"
                          : "bg-gradient-to-br from-blue-500 to-cyan-500"
                      }`}
                    >
                      {selectedUser.userType === "alumni" ? (
                        <GraduationCap className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedUser.name}
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? "hover:bg-slate-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? "hover:bg-slate-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className={`flex-1 overflow-y-auto p-4 min-h-0 ${
                  isDarkMode ? "bg-slate-900" : "bg-gray-50"
                }`}
              >
                {messages.length === 0 ? (
                  <div
                    className={`text-center py-12 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <p className="text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isSent = msg.sender.phone === currentUser?.phone;
                      return (
                        <div
                          key={msg.id}
                          className={`mb-4 flex ${
                            isSent ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="max-w-xs">
                            <div
                              className={`rounded-2xl px-4 py-2.5 ${
                                isSent
                                  ? "bg-purple-500 text-white rounded-br-sm"
                                  : isDarkMode
                                  ? "bg-slate-800 text-white rounded-bl-sm"
                                  : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.text}
                              </p>
                            </div>
                            <p
                              className={`text-xs mt-1 ${
                                isSent ? "text-right" : "text-left"
                              } ${
                                isDarkMode ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div
                className={`p-4 border-t flex-shrink-0 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    className={`flex-1 px-4 py-2.5 rounded-full focus:outline-none ${
                      isDarkMode
                        ? "bg-slate-700 text-white placeholder-gray-500"
                        : "bg-gray-100 text-gray-900 placeholder-gray-400"
                    }`}
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!messageText.trim() || loading}
                    className="p-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View - All 3 Sections */}
        <div className="hidden lg:flex flex-1 gap-4 min-h-0 overflow-hidden">
          {/* Left Sidebar - Recent Chats */}
          <div
            className={`w-80 border flex flex-col rounded-lg overflow-hidden ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-4 border-b flex-shrink-0 ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <div className="relative">
                <Search
                  className={`absolute left-3 top-3 w-4 h-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-700 text-white placeholder-gray-500"
                      : "bg-gray-100 text-gray-900 placeholder-gray-400"
                  }`}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div
                  className={`text-center py-12 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <p className="text-sm">No recent conversations</p>
                </div>
              ) : (
                filteredChats.map((person) => (
                  <div
                    key={`${person.userType}-${person.phone}-${person.id}`}
                    onClick={() => setSelectedUser(person)}
                    className={`px-4 py-4 flex items-center gap-3 border-b cursor-pointer transition-colors ${
                      selectedUser?.phone === person.phone
                        ? isDarkMode
                          ? "bg-slate-700"
                          : "bg-gray-100"
                        : isDarkMode
                        ? "border-slate-700 hover:bg-slate-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          person.userType === "alumni"
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        }`}
                      >
                        {person.userType === "alumni" ? (
                          <GraduationCap className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold truncate ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {person.name}
                      </h3>
                      <p
                        className={`text-sm truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {person.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Center - Chat Window */}
          <div
            className={`flex-1 flex flex-col rounded-lg overflow-hidden border max-h-full ${
              isDarkMode ? "border-slate-700" : "border-gray-200"
            }`}
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div
                  className={`px-6 py-4 flex items-center justify-between border-b flex-shrink-0 ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selectedUser.userType === "alumni"
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        }`}
                      >
                        {selectedUser.userType === "alumni" ? (
                          <GraduationCap className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedUser.name}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "hover:bg-slate-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "hover:bg-slate-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <button
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "hover:bg-slate-700 text-gray-300"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className={`flex-1 overflow-y-auto p-6 min-h-0 ${
                    isDarkMode ? "bg-slate-900" : "bg-gray-50"
                  }`}
                >
                  {messages.length === 0 ? (
                    <div
                      className={`text-center py-12 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <p className="text-sm">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => {
                        const isSent = msg.sender.phone === currentUser?.phone;
                        return (
                          <div
                            key={msg.id}
                            className={`mb-4 flex ${
                              isSent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div className="max-w-md">
                              <div
                                className={`rounded-2xl px-4 py-2.5 ${
                                  isSent
                                    ? "bg-purple-500 text-white rounded-br-sm"
                                    : isDarkMode
                                    ? "bg-slate-800 text-white rounded-bl-sm"
                                    : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">
                                  {msg.text}
                                </p>
                              </div>
                              <p
                                className={`text-xs mt-1 ${
                                  isSent ? "text-right" : "text-left"
                                } ${
                                  isDarkMode ? "text-gray-500" : "text-gray-500"
                                }`}
                              >
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div
                  className={`px-6 py-4 border-t flex-shrink-0 ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "hover:bg-slate-700 text-gray-400"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message"
                      className={`flex-1 px-4 py-2.5 rounded-full focus:outline-none ${
                        isDarkMode
                          ? "bg-slate-700 text-white placeholder-gray-500"
                          : "bg-gray-100 text-gray-900 placeholder-gray-400"
                      }`}
                      disabled={loading}
                    />
                    <button
                      className={`p-2 rounded-lg ${
                        isDarkMode
                          ? "hover:bg-slate-700 text-gray-400"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      onClick={sendMessage}
                      disabled={!messageText.trim() || loading}
                      className="p-2.5 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`flex-1 flex items-center justify-center ${
                  isDarkMode ? "bg-slate-900" : "bg-gray-50"
                }`}
              >
                <div className="text-center py-12">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    <Users
                      className={`w-8 h-8 ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - People You May Know */}
          <div
            className={`w-80 border flex flex-col rounded-lg overflow-hidden ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`p-4 border-b flex-shrink-0 ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                People You May Know
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredPeople
                .filter((p) => !recentChats.find((rc) => rc.phone === p.phone))
                .map((person) => (
                  <div
                    key={`${person.userType}-${person.phone}-${person.id}`}
                    onClick={() => setSelectedUser(person)}
                    className={`px-4 py-4 flex items-center gap-3 border-b cursor-pointer transition-colors ${
                      isDarkMode
                        ? "border-slate-700 hover:bg-slate-750"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          person.userType === "alumni"
                            ? "bg-gradient-to-br from-purple-500 to-pink-500"
                            : "bg-gradient-to-br from-blue-500 to-cyan-500"
                        }`}
                      >
                        {person.userType === "alumni" ? (
                          <GraduationCap className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold truncate ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {person.name}
                      </h3>
                      <p
                        className={`text-sm truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {person.email}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default ChatApp;
