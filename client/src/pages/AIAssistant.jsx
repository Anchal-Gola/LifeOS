import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

const API_URL = "http://localhost:5000";

const CURRENT_CHAT_KEY = "lifeos_current_conversation";

const initialMessage = {
  role: "assistant",
  content:
    "Hello! I'm your LifeOS AI Assistant. I can help you manage tasks, goals, habits, study plans, and your daily productivity. What would you like to work on?",
};

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Used to automatically scroll to the latest message
  const messagesEndRef = useRef(null);

  // Auto-scroll whenever messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  // Load chat history
  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/conversations`,
        {
          withCredentials: true,
        }
      );

      setConversations(response.data.data || []);
    } catch (error) {
      console.error("Conversation history error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load the conversation that was open before refresh
  const restoreCurrentConversation = async () => {
    const savedConversationId = sessionStorage.getItem(
      CURRENT_CHAT_KEY
    );

    if (!savedConversationId) {
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/conversations/${savedConversationId}`,
        {
          withCredentials: true,
        }
      );

      const conversation = response.data.data;

      setCurrentConversationId(conversation._id);

      if (conversation.messages?.length) {
        setMessages(conversation.messages);
      } else {
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error("Restore conversation error:", error);

      sessionStorage.removeItem(CURRENT_CHAT_KEY);
      setCurrentConversationId(null);
      setMessages([initialMessage]);
    }
  };

  useEffect(() => {
    const loadChat = async () => {
      await fetchConversations();
      await restoreCurrentConversation();
    };

    loadChat();
  }, []);

  // Send message
  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const currentMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: currentMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          message: currentMessage,
          conversationId: currentConversationId,
        },
        {
          withCredentials: true,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply,
        },
      ]);

      // Save conversation ID
      if (response.data.conversationId) {
        setCurrentConversationId(response.data.conversationId);

        sessionStorage.setItem(
          CURRENT_CHAT_KEY,
          response.data.conversationId
        );
      }

      // Refresh sidebar history
      await fetchConversations();
    } catch (error) {
      console.error("AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Load selected conversation
  const handleSelectConversation = async (id) => {
    if (loading) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/conversations/${id}`,
        {
          withCredentials: true,
        }
      );

      const conversation = response.data.data;

      setCurrentConversationId(conversation._id);

      sessionStorage.setItem(
        CURRENT_CHAT_KEY,
        conversation._id
      );

      if (conversation.messages?.length) {
        setMessages(conversation.messages);
      } else {
        setMessages([initialMessage]);
      }

      setMessage("");
    } catch (error) {
      console.error("Load conversation error:", error);
    }
  };

  // Start completely new chat
  const newChat = () => {
    setCurrentConversationId(null);

    sessionStorage.removeItem(CURRENT_CHAT_KEY);

    setMessages([initialMessage]);
    setMessage("");
  };

  // Clear current chat
  const clearChat = () => {
    newChat();
  };

  // Delete conversation
  const handleDeleteConversation = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/conversations/${id}`,
        {
          withCredentials: true,
        }
      );

      if (currentConversationId === id) {
        newChat();
      }

      await fetchConversations();
    } catch (error) {
      console.error("Delete conversation error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-80px)] min-h-[650px] bg-white">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-50/70 md:flex md:flex-col">

          {/* New Chat */}
          <div className="p-4">
            <button
              onClick={newChat}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span className="text-lg">＋</span>
              New chat
            </button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-3">

            <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent
            </p>

            {historyLoading ? (
              <p className="px-3 py-3 text-xs text-slate-400">
                Loading chats...
              </p>
            ) : conversations.length === 0 ? (
              <p className="px-3 py-3 text-xs leading-5 text-slate-400">
                No previous conversations
              </p>
            ) : (
              <div className="space-y-1">

                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`group flex items-center gap-1 rounded-xl transition ${
                      currentConversationId === conversation._id
                        ? "bg-purple-100"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <button
                      onClick={() =>
                        handleSelectConversation(conversation._id)
                      }
                      className="min-w-0 flex-1 px-3 py-3 text-left"
                    >
                      <p className="truncate text-sm font-medium text-slate-800">
                        {conversation.title || "New Chat"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          conversation.updatedAt
                        ).toLocaleDateString()}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteConversation(conversation._id)
                      }
                      className="mr-2 hidden rounded-lg p-1.5 text-xs text-slate-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                      title="Delete conversation"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* Sidebar Bottom */}
          <div className="border-t border-slate-200 p-3">

            <button
              onClick={clearChat}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <span>🗑️</span>
              Clear chat
            </button>

          </div>
        </aside>

        {/* MAIN CHAT */}
        <main className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-lg shadow-sm">
                ✨
              </div>

              <div>
                <h1 className="text-base font-semibold text-slate-900">
                  LifeOS AI
                </h1>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs text-slate-400">
                    LifeOS Intelligence
                  </span>
                </div>
              </div>

            </div>

            <button
              onClick={clearChat}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            >
              Clear chat
            </button>

          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-white">

            <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">

              {messages.map((msg, index) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={index}
                    className={`mb-8 flex gap-4 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >

                    {!isUser && (
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-sm text-white shadow-sm sm:flex">
                        ✨
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[75%] ${
                        isUser ? "order-first" : ""
                      }`}
                    >

                      {!isUser && (
                        <p className="mb-2 text-xs font-semibold text-slate-500">
                          LifeOS AI
                        </p>
                      )}

                      <div
                        className={
                          isUser
                            ? "rounded-2xl rounded-br-md bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3.5 text-[15px] leading-7 text-white shadow-sm"
                            : "px-1 py-1 text-[15px] leading-8 text-slate-700"
                        }
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}

              {loading && (
                <div className="mb-8 flex gap-4">

                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 text-sm text-white shadow-sm sm:flex">
                    ✨
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-500">
                      LifeOS AI
                    </p>

                    <div className="flex items-center gap-1 px-1 py-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: "150ms" }}
                      />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* Invisible element used for automatic scrolling */}
              <div ref={messagesEndRef} />

            </div>

          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 pb-5 pt-4 sm:px-8">

            <div className="mx-auto max-w-4xl">

              <div className="relative flex items-end rounded-2xl border border-slate-300 bg-white shadow-sm transition focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-50">

                <button
                  type="button"
                  className="mb-1 ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  title="Attachments coming soon"
                >
                  ＋
                </button>

                <textarea
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message LifeOS AI..."
                  className="max-h-32 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-4 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
                />

                <button
                  onClick={handleSend}
                  disabled={loading || !message.trim()}
                  className="m-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                  title="Send"
                >
                  ↑
                </button>

              </div>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                LifeOS AI can make mistakes. Check important information.
              </p>

            </div>

          </div>

        </main>
      </div>
    </MainLayout>
  );
}

export default AIAssistant;