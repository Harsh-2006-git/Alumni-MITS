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
  Smile,
  ArrowLeft,
  Edit2,
  Trash2,
  X,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import { useSocket } from "../context/SocketContext";

const ChatApp = ({ isDarkMode, toggleTheme }) => {
  const socket = useSocket(); // Socket.IO connection
  const [people, setPeople] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null); // ID of message being edited
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null); // ID of message value to delete
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mobileView, setMobileView] = useState("chats");
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Typing indicator
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji picker state
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const COMMON_EMOJIS = [
    "👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👏", "🙏", "💯",
    "😊", "🥰", "😎", "🤔", "😅", "😭", "😤", "👋", "🙌", "🤝",
    "💪", "👀", "✨", "🌟", "💡", "🎈", "🎂", "🎁", "🎵", "📷",
    "🎬", "🎓", "🏆", "🍕", "🍔", "☕", "🍺", "✈️", "🚀", "🌍",
    "💻", "📱", "💼", "💰", "📅", "✅", "❌", "❓", "❗", "💤"
  ];
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log("BASE_URL from env:", BASE_URL);

  // Update the helper function to ensure uniqueness
  const getPersonKey = (person, prefix = "") => {
    const baseKey = `${prefix}${person.userType}-${person.phone}-${person.email || "no-email"}`;

    if (person.id) {
      return `${baseKey}-${person.id}`;
    }

    const hash = `${person.name || ""}${person.phone}${person.email || ""}`;
    return `${baseKey}-${hash}`;
  };

  // Date formatting helper functions
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time part for comparison
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else if (date.getFullYear() === new Date().getFullYear()) {
      // Same year, show month and day
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } else {
      // Different year, show full date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

  // Function to group messages by date
  const groupMessagesByDate = (messages) => {
    if (!messages || messages.length === 0) return [];

    const grouped = [];
    let currentDate = null;
    let currentGroup = [];

    // Sort messages by date (oldest to newest)
    const sortedMessages = [...messages].sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    sortedMessages.forEach((msg, index) => {
      const messageDate = formatDate(msg.createdAt);

      if (messageDate !== currentDate) {
        // If we have a current group, add it to grouped array
        if (currentGroup.length > 0) {
          grouped.push({
            date: currentDate,
            messages: currentGroup
          });
        }

        // Start new group
        currentDate = messageDate;
        currentGroup = [msg];
      } else {
        // Add to current group
        currentGroup.push(msg);
      }

      // Add the last group
      if (index === sortedMessages.length - 1) {
        grouped.push({
          date: currentDate,
          messages: currentGroup
        });
      }
    });

    return grouped;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        let authData = localStorage.getItem("auth");

        if (authData) {
          const parsedAuth = JSON.parse(authData);
          console.log("Auth data found:", parsedAuth);

          try {
            const response = await fetch(
              `${BASE_URL}/message/people`,
              {
                headers: {
                  Authorization: `Bearer ${parsedAuth.accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();

              // Decoding token to get correct phone and other details
              // parsedAuth already contains most of these from the login/header logic
              setCurrentUser({
                phone: parsedAuth.phone || parsedAuth.userId, // Prefer phone if available
                userType: parsedAuth.userType || "student",
                name: parsedAuth.userName,
                email: parsedAuth.userEmail,
                id: parsedAuth.userId,
              });
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
  }, [BASE_URL]);

  useEffect(() => {
    if (currentUser && !isInitializing) {
      console.log("Fetching people for user:", currentUser);
      fetchPeople();
    }
  }, [currentUser, isInitializing]);

  // Socket.IO: Real-time message handling (replaces polling)
  useEffect(() => {
    if (!socket || !selectedUser || !currentUser) return;

    console.log("Setting up Socket.IO listeners for:", selectedUser.name);

    // Initial message load
    fetchMessages();

    // Listen for incoming messages
    const handleReceiveMessage = (newMessage) => {
      console.log("Received message via Socket:", newMessage);

      // Only add if it's relevant to current conversation
      const isRelevant =
        (newMessage.senderId === selectedUser.id && newMessage.receiverId === currentUser.id) ||
        (newMessage.senderId === currentUser.id && newMessage.receiverId === selectedUser.id);

      if (isRelevant) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some(m => m.id === newMessage._id || m._id === newMessage._id);
          if (exists) return prev;

          return [...prev, {
            ...newMessage,
            id: newMessage._id,
            sender: newMessage.sender || { id: newMessage.senderId },
            receiver: newMessage.receiver || { id: newMessage.receiverId },
          }];
        });
        setIsUserScrolling(false); // Auto-scroll on new message
      }
    };

    // Listen for message updates (edits)
    const handleMessageUpdated = (updatedMessage) => {
      console.log("Message updated via Socket:", updatedMessage);
      setMessages((prev) =>
        prev.map((m) =>
          (m.id === updatedMessage._id || m._id === updatedMessage._id)
            ? { ...m, ...updatedMessage, id: updatedMessage._id }
            : m
        )
      );
    };

    // Listen for message deletions
    const handleMessageDeleted = ({ messageId }) => {
      console.log("Message deleted via Socket:", messageId);
      setMessages((prev) =>
        prev.map((m) =>
          (m.id === messageId || m._id === messageId)
            ? { ...m, isDeleted: true, text: "This message was deleted" }
            : m
        )
      );
    };

    // Listen for typing indicators
    const handleUserTyping = ({ userId }) => {
      if (userId === selectedUser.id) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = ({ userId }) => {
      if (userId === selectedUser.id) {
        setIsTyping(false);
      }
    };

    // Attach listeners
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    // Cleanup on unmount or user change
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket, selectedUser, currentUser]);

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

      const response = await fetch(
        `${BASE_URL}/message/people`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
        const filteredPeople = data.data?.filter(
          (p) => p.phone !== currentUser.phone && p.email !== currentUser.email
        ) || [];
        setPeople(filteredPeople);

        const messagesResponse = await fetch(
          `${BASE_URL}/message/my`,
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
          const uniqueIds = new Set();

          messagesData.data?.forEach((msg) => {
            const senderId = msg.sender?.id || msg.sender?._id;
            const receiverId = msg.receiver?.id || msg.receiver?._id;

            if (senderId !== currentUser.id) {
              uniqueIds.add(senderId);
            }
            if (receiverId !== currentUser.id) {
              uniqueIds.add(receiverId);
            }
          });

          const recentChatUsers = filteredPeople.filter(
            (p) => uniqueIds.has(p.id) || uniqueIds.has(p._id)
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
    if (!selectedUser || !currentUser) return;
    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      console.log("Fetching messages for:", selectedUser.name);
      console.log("Current user phone:", currentUser.phone);
      console.log("Selected user phone:", selectedUser.phone);

      const response = await fetch(
        `${BASE_URL}/message/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      console.log("All messages received:", data.data);

      if (data.success) {
        const filtered = data.data?.filter(
          (msg) => {
            const senderId = msg.sender?.id || msg.sender?._id;
            const receiverId = msg.receiver?.id || msg.receiver?._id;
            const currentUserId = currentUser.id;
            const selectedUserId = selectedUser.id;

            return (
              (senderId === selectedUserId && receiverId === currentUserId) ||
              (senderId === currentUserId && receiverId === selectedUserId)
            );
          }
        ) || [];
        console.log("Filtered messages:", filtered);
        setMessages(filtered);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Socket.IO: Send OR Edit message
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser || !currentUser) return;

    // Stop typing indicator
    if (socket && selectedUser) {
      socket.emit("stop_typing", { receiverId: selectedUser.id });
    }

    if (!socket) {
      console.warn("Socket not available, using HTTP fallback");
      return sendMessageHTTP();
    }

    setLoading(true);
    setIsUserScrolling(false);

    try {
      if (editingMessageId) {
        // EDIT EXISTING MESSAGE
        socket.emit("edit_message", {
          messageId: editingMessageId,
          newText: messageText.trim()
        }, (response) => {
          if (response.success) {
            console.log("Message edited successfully");
            setMessages((prev) =>
              prev.map((m) =>
                (m.id === editingMessageId || m._id === editingMessageId)
                  ? { ...m, text: messageText.trim(), isEdited: true }
                  : m
              )
            );
            cancelEditing();
          } else {
            console.error("Failed to edit message:", response.error);
            alert("Failed to edit message");
          }
          setLoading(false);
        });
      } else {
        // SEND NEW MESSAGE
        const messageData = {
          receiverId: selectedUser.id,
          text: messageText.trim(),
        };

        socket.emit("send_message", messageData, (response) => {
          if (response.success) {
            console.log("Message sent successfully via Socket:", response.data);
            setMessageText("");

            // Update state with new message (check for duplicates)
            setMessages((prev) => {
              const newMessage = response.data;
              const exists = prev.some(m => m.id === newMessage._id || m._id === newMessage._id);
              if (exists) return prev;

              return [...prev, {
                ...newMessage,
                id: newMessage._id, // Ensure ID consistency
                sender: newMessage.sender || { id: newMessage.senderId },
                receiver: newMessage.receiver || { id: newMessage.receiverId },
              }];
            });

            if (!recentChats.find((rc) => rc.id === selectedUser.id)) {
              setRecentChats([selectedUser, ...recentChats]);
            }
          } else {
            console.error("Failed to send message:", response.error);
            alert("Failed to send message: " + response.error);
          }
          setLoading(false);
        });
      }
    } catch (error) {
      console.error("Error via Socket:", error);
      setLoading(false);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setDeleteConfirmationId(messageId);
  };

  const confirmDeleteMessage = () => {
    if (!socket || !deleteConfirmationId) return;

    socket.emit("delete_message", { messageId: deleteConfirmationId }, (response) => {
      if (response.success) {
        setMessages((prev) =>
          prev.map((m) =>
            (m.id === deleteConfirmationId || m._id === deleteConfirmationId)
              ? { ...m, isDeleted: true, text: "This message was deleted" }
              : m
          )
        );
      } else {
        console.error("Failed to delete message");
      }
      setDeleteConfirmationId(null);
    });
  };

  const startEditing = (msg) => {
    setEditingMessageId(msg.id || msg._id);
    setMessageText(msg.text);
    // Focus input (optional if ref used)
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setMessageText("");
  };

  // HTTP Fallback (for when Socket.IO is unavailable)
  const sendMessageHTTP = async () => {
    if (!messageText.trim() || !selectedUser || !currentUser) return;
    setLoading(true);
    setIsUserScrolling(false);

    try {
      const token = getAuthToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${BASE_URL}/message/send`, {
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

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !selectedUser) return;

    // Emit typing event
    socket.emit("typing", { receiverId: selectedUser.id });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { receiverId: selectedUser.id });
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
      person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = recentChats.filter(
    (person) =>
      person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isInitializing) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
          }`}
      >
        <div className="text-center">
          <Loader
            className={`w-12 h-12 mx-auto mb-4 animate-spin ${isDarkMode ? "text-purple-500" : "text-purple-600"
              }`}
          />
          <p
            className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
      className={`h-screen flex flex-col overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-gray-100"
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
                className={`flex border-b flex-shrink-0 ${isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <button
                  onClick={() => setMobileView("chats")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileView === "chats"
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
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileView === "people"
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
                className={`p-4 border-b flex-shrink-0 ${isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors focus:outline-none ${isDarkMode
                      ? "bg-slate-700 text-white placeholder-gray-500"
                      : "bg-gray-100 text-gray-900 placeholder-gray-400"
                      }`}
                  />
                </div>
              </div>

              {/* Chat List */}
              {mobileView === "chats" && (
                <div
                  className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
                    }`}
                >
                  {filteredChats.length === 0 ? (
                    <div
                      className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                    >
                      <p className="text-sm">No recent conversations</p>
                    </div>
                  ) : (
                    filteredChats.map((person) => (
                      <div
                        key={getPersonKey(person, "mobile-chat-")}
                        onClick={() => setSelectedUser(person)}
                        className={`px-4 py-2.5 flex items-center gap-3 border-b cursor-pointer transition-colors ${isDarkMode
                          ? "border-slate-800 hover:bg-slate-800"
                          : "border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${person.userType === "alumni"
                              ? "bg-gradient-to-br from-purple-500 to-pink-500"
                              : "bg-gradient-to-br from-blue-500 to-cyan-500"
                              }`}
                          >
                            {person.userType === "alumni" ? (
                              <GraduationCap className="w-5 h-5 text-white" />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold truncate text-[13px] ${isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                          >
                            {person.name}
                          </h3>
                          <p
                            className={`text-[11px] truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
                  className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
                    }`}
                >
                  {filteredPeople
                    .filter(
                      (p) => !recentChats.find((rc) => rc.phone === p.phone)
                    )
                    .map((person) => (
                      <div
                        key={getPersonKey(person, "mobile-person-")}
                        onClick={() => setSelectedUser(person)}
                        className={`px-4 py-2.5 flex items-center gap-3 border-b cursor-pointer transition-colors ${isDarkMode
                          ? "border-slate-800 hover:bg-slate-800"
                          : "border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${person.userType === "alumni"
                              ? "bg-gradient-to-br from-purple-500 to-pink-500"
                              : "bg-gradient-to-br from-blue-500 to-cyan-500"
                              }`}
                          >
                            {person.userType === "alumni" ? (
                              <GraduationCap className="w-5 h-5 text-white" />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-semibold truncate text-[13px] ${isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                          >
                            {person.name}
                          </h3>
                          <p
                            className={`text-[11px] truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
                className={`px-4 py-3 flex items-center justify-between border-b flex-shrink-0 ${isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className={`p-2 -ml-2 rounded-lg ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                      }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedUser.userType === "alumni"
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
                      className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {selectedUser.name}
                    </h3>
                    <p
                      className={`text-xs ${isTyping ? "text-purple-500 font-semibold animate-pulse" : isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      {isTyping ? "Typing..." : selectedUser.email}
                    </p>
                  </div>
                </div>

              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className={`flex-1 overflow-y-auto p-4 min-h-0 ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
                  }`}
              >
                {messages.length === 0 ? (
                  <div
                    className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                  >
                    <p className="text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  <>
                    {groupMessagesByDate(messages).map((group, groupIndex) => (
                      <div key={`group-${groupIndex}`}>
                        {/* Date Separator */}
                        <div className="flex items-center justify-center my-6">
                          <div className={`px-3 py-1 rounded-full text-xs ${isDarkMode
                            ? "bg-slate-800 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                            }`}>
                            {group.date}
                          </div>
                        </div>

                        {/* Messages for this date */}
                        {group.messages.map((msg) => {
                          const isSent = (msg.sender?.id || msg.sender?._id) === currentUser?.id;
                          return (
                            <div
                              key={msg.id || `${msg.createdAt}-${msg.text?.substring(0, 10)}`}
                              className={`mb-4 flex ${isSent ? "justify-end" : "justify-start"
                                }`}
                            >
                              <div className={`max-w-[85%] sm:max-w-[70%] lg:max-w-md group relative`}>
                                <div
                                  className={`rounded-2xl px-4 py-2.5 shadow-sm ${msg.isDeleted
                                    ? "bg-gray-200 text-gray-500 italic border border-gray-300"
                                    : isSent
                                      ? "bg-purple-600 text-white rounded-tr-none sm:rounded-tr-2xl sm:rounded-br-sm"
                                      : isDarkMode
                                        ? "bg-slate-800 text-white rounded-tl-none sm:rounded-tl-2xl sm:rounded-bl-sm"
                                        : "bg-white text-gray-900 rounded-tl-none sm:rounded-tl-2xl sm:rounded-bl-sm border border-gray-200"
                                    }`}
                                >
                                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {msg.text}
                                  </p>
                                </div>
                                <div className={`flex items-center gap-2 mt-1 ${isSent ? "justify-end" : "justify-start"}`}>
                                  {/* Edited Label */}
                                  {msg.isEdited && !msg.isDeleted && (
                                    <span className="text-[10px] text-gray-400 italic">Edited</span>
                                  )}

                                  <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                                    {formatTime(msg.createdAt)}
                                  </p>

                                  {/* Edit/Delete Options for Sender */}
                                  {isSent && !msg.isDeleted && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => startEditing(msg)}
                                        className="p-1.5 hover:bg-black/10 rounded"
                                        title="Edit"
                                      >
                                        <Edit2 className="w-4 h-4 text-gray-400" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMessage(msg.id || msg._id)}
                                        className="p-1.5 hover:bg-red-500/10 rounded"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="mb-4 flex justify-start">
                        <div className={`px-4 py-2.5 rounded-2xl rounded-tl-none ${isDarkMode ? "bg-slate-800" : "bg-white border border-gray-200"
                          }`}>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div
                className={`p-4 border-t flex-shrink-0 relative ${isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
                  }`}
              >
                {/* Editing Banner */}
                {editingMessageId && (
                  <div className={`absolute -top-10 left-0 right-0 px-4 py-2 flex justify-between items-center text-xs border-b ${isDarkMode ? "bg-slate-800 border-slate-700 text-purple-400" : "bg-white border-gray-200 text-purple-600"
                    }`}>
                    <span className="font-semibold">Editing message...</span>
                    <button onClick={cancelEditing} className="p-1 hover:bg-black/10 rounded-full">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    className={`flex-1 px-4 py-2.5 rounded-full focus:outline-none ${isDarkMode
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
            className={`w-80 border flex flex-col rounded-lg overflow-hidden ${isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
              }`}
          >
            <div
              className={`p-4 border-b flex-shrink-0 ${isDarkMode ? "border-slate-700" : "border-gray-200"
                }`}
            >
              <div className="relative">
                <Search
                  className={`absolute left-3 top-3 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg transition-colors focus:outline-none ${isDarkMode
                    ? "bg-slate-700 text-white placeholder-gray-500"
                    : "bg-gray-100 text-gray-900 placeholder-gray-400"
                    }`}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div
                  className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  <p className="text-sm">No recent conversations</p>
                </div>
              ) : (
                filteredChats.map((person) => (
                  <div
                    key={getPersonKey(person, "desktop-chat-")}
                    onClick={() => setSelectedUser(person)}
                    className={`px-4 py-4 flex items-center gap-3 border-b cursor-pointer transition-colors ${selectedUser?.phone === person.phone
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
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${person.userType === "alumni"
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
                        className={`font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {person.name}
                      </h3>
                      <p
                        className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
            className={`flex-1 flex flex-col rounded-lg overflow-hidden border max-h-full ${isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
          >
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div
                  className={`px-6 py-4 flex items-center justify-between border-b flex-shrink-0 ${isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedUser.userType === "alumni"
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
                        className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {selectedUser.name}
                      </h3>
                      <p
                        className={`text-sm ${isTyping ? "text-purple-500 font-semibold animate-pulse" : isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        {isTyping ? "Typing..." : selectedUser.email}
                      </p>
                    </div>
                  </div>
                  {/* Icons Removed */}

                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className={`flex-1 overflow-y-auto p-6 min-h-0 ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
                    }`}
                >
                  {messages.length === 0 ? (
                    <div
                      className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                    >
                      <p className="text-sm">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    <>
                      {groupMessagesByDate(messages).map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`}>
                          {/* Date Separator */}
                          <div className="flex items-center justify-center my-8">
                            <div className={`px-4 py-1.5 rounded-full text-sm ${isDarkMode
                              ? "bg-slate-800 text-gray-400"
                              : "bg-gray-200 text-gray-600"
                              }`}>
                              {group.date}
                            </div>
                          </div>

                          {/* Messages for this date */}
                          {group.messages.map((msg) => {
                            const isSent = (msg.sender?.id || msg.sender?._id) === currentUser?.id;
                            return (
                              <div
                                key={msg.id || `${msg.createdAt}-${msg.text?.substring(0, 10)}`}
                                className={`mb-4 flex ${isSent ? "justify-end" : "justify-start"
                                  }`}
                              >
                                <div className={`max-w-[75%] lg:max-w-md group relative`}>
                                  <div
                                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${msg.isDeleted
                                      ? "bg-gray-200 text-gray-500 italic border border-gray-300"
                                      : isSent
                                        ? "bg-purple-600 text-white rounded-br-sm"
                                        : isDarkMode
                                          ? "bg-slate-800 text-white rounded-bl-sm"
                                          : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
                                      }`}
                                  >
                                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                      {msg.text}
                                    </p>
                                  </div>
                                  <div className={`flex items-center gap-2 mt-1 ${isSent ? "justify-end" : "justify-start"}`}>
                                    {/* Edited Label */}
                                    {msg.isEdited && !msg.isDeleted && (
                                      <span className="text-[10px] text-gray-400 italic">Edited</span>
                                    )}

                                    <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                                      {formatTime(msg.createdAt)}
                                    </p>

                                    {/* Edit/Delete Options for Sender */}
                                    {isSent && !msg.isDeleted && (
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => startEditing(msg)}
                                          className="p-1 hover:bg-black/10 rounded"
                                          title="Edit"
                                        >
                                          <Edit2 className="w-3 h-3 text-gray-400" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteMessage(msg.id || msg._id)}
                                          className="p-1 hover:bg-red-500/10 rounded"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-3 h-3 text-red-400" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="mb-4 flex justify-start">
                          <div className={`px-4 py-2.5 rounded-2xl rounded-bl-none ${isDarkMode ? "bg-slate-800" : "bg-white border border-gray-200"
                            }`}>
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div
                  className={`px-6 py-4 border-t flex-shrink-0 relative ${isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-200"
                    }`}
                >
                  {/* Editing Banner */}
                  {editingMessageId && (
                    <div className={`absolute -top-10 left-0 right-0 px-6 py-2 flex justify-between items-center text-sm border-b ${isDarkMode ? "bg-slate-800 border-slate-700 text-purple-400" : "bg-white border-gray-200 text-purple-600"
                      }`}>
                      <span className="font-semibold">Editing message...</span>
                      <button onClick={cancelEditing} className="p-1 hover:bg-black/10 rounded-full">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Emoji Picker - Horizontal Scroll */}
                  {showEmojiPicker && (
                    <div className={`absolute bottom-20 left-4 z-50 max-w-[calc(100vw-4rem)] sm:max-w-md p-2 rounded-2xl shadow-xl border flex items-center gap-1 animate-fadeIn origin-bottom-left ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
                      }`}>
                      <div className="flex-1 flex gap-1 overflow-x-auto custom-scrollbar px-1 py-1">
                        {COMMON_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessageText((prev) => prev + emoji);
                              handleTyping();
                            }}
                            className={`flex-shrink-0 hover:scale-125 transition-transform text-xl p-2 rounded-lg flex items-center justify-center ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"
                              }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      <div className={`w-px h-8 mx-1 flex-shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-gray-200"}`}></div>

                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className={`flex-shrink-0 p-2 rounded-full hover:bg-black/10 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message"
                      className={`flex-1 px-4 py-2.5 rounded-full focus:outline-none ${isDarkMode
                        ? "bg-slate-700 text-white placeholder-gray-500"
                        : "bg-gray-100 text-gray-900 placeholder-gray-400"
                        }`}
                      disabled={loading}
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-2 rounded-lg transition-colors ${isDarkMode
                        ? "hover:bg-slate-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-600"
                        } ${showEmojiPicker ? "text-purple-500" : ""}`}
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
                className={`flex-1 flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
                  }`}
              >
                <div className="text-center py-12">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-white"
                      }`}
                  >
                    <Users
                      className={`w-8 h-8 ${isDarkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                    />
                  </div>
                  <p
                    className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"
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
            className={`w-80 border flex flex-col rounded-lg overflow-hidden ${isDarkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
              }`}
          >
            <div
              className={`p-4 border-b flex-shrink-0 ${isDarkMode ? "border-slate-700" : "border-gray-200"
                }`}
            >
              <h2
                className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
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
                    key={getPersonKey(person, "sidebar-person-")}
                    onClick={() => setSelectedUser(person)}
                    className={`px-4 py-4 flex items-center gap-3 border-b cursor-pointer transition-colors ${isDarkMode
                      ? "border-slate-700 hover:bg-slate-750"
                      : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${person.userType === "alumni"
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
                        className={`font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {person.name}
                      </h3>
                      <p
                        className={`text-sm truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl p-6 shadow-xl transform transition-all ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
            }`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Message?
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This action cannot be undone. The message content will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isDarkMode
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteMessage}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-shrink-0">
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default ChatApp;