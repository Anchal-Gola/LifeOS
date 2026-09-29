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

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/conversations`, {
        withCredentials: true,
      });

      setConversations(response.data.data || []);
    } catch (error) {
      console.error("Conversation history error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const restoreCurrentConversation = async () => {
    const savedConversationId =
      sessionStorage.getItem(CURRENT_CHAT_KEY);

    if (!savedConversationId) return;

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

  const handleSend = async (customMessage = null) => {
    const text = (customMessage ?? message).trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          message: text,
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

      if (response.data.conversationId) {
        setCurrentConversationId(response.data.conversationId);

        sessionStorage.setItem(
          CURRENT_CHAT_KEY,
          response.data.conversationId
        );
      }

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

  const newChat = () => {
    setCurrentConversationId(null);
    sessionStorage.removeItem(CURRENT_CHAT_KEY);
    setMessages([initialMessage]);
    setMessage("");
  };

  const clearChat = () => {
    newChat();
  };

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

  const suggestions = [
    {
      icon: "✓",
      title: "Plan my day",
      text: "Help me plan my day based on my current tasks.",
    },
    {
      icon: "◈",
      title: "Review my goals",
      text: "Help me review my goals and decide what to focus on.",
    },
    {
      icon: "◷",
      title: "Study plan",
      text: "Create a focused study plan for today.",
    },
    {
      icon: "✦",
      title: "Be productive",
      text: "What should I work on right now?",
    },
  ];

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-80px)] min-h-[650px] overflow-hidden bg-[#f7f7ff] text-slate-900 dark:bg-[#0f1017] dark:text-white">

        {/* SIDEBAR */}
        <aside className="hidden w-[290px] shrink-0 flex-col border-r border-slate-200/80 bg-white/95 md:flex dark:border-white/[0.07] dark:bg-[#15161e]">

          {/* Brand */}
          <div className="border-b border-slate-100 px-5 py-5 dark:border-white/[0.06]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg text-white shadow-lg shadow-violet-500/20">
                ✦
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  LifeOS AI
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  Personal intelligence
                </p>
              </div>
            </div>

            <button
              onClick={newChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <span className="text-lg leading-none">+</span>
              New conversation
            </button>
          </div>

          {/* History */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="mb-3 flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Conversations
              </span>

              {conversations.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
                  {conversations.length}
                </span>
              )}
            </div>

            {historyLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[62px] animate-pulse rounded-xl bg-slate-100 dark:bg-white/[0.04]"
                  />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-9 text-center dark:border-white/[0.08]">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                  ✦
                </div>

                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No conversations yet
                </p>

                <p className="mt-1 text-[11px] leading-4 text-slate-400">
                  Start a conversation and it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {conversations.map((conversation) => {
                  const active =
                    currentConversationId === conversation._id;

                  return (
                    <div
                      key={conversation._id}
                      className={`group flex items-center rounded-xl border transition ${
                        active
                          ? "border-violet-100 bg-violet-50/80 dark:border-violet-500/20 dark:bg-violet-500/10"
                          : "border-transparent hover:border-slate-100 hover:bg-slate-50 dark:hover:border-white/[0.05] dark:hover:bg-white/[0.035]"
                      }`}
                    >
                      <button
                        onClick={() =>
                          handleSelectConversation(
                            conversation._id
                          )
                        }
                        className="min-w-0 flex-1 px-3 py-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs shadow-sm ${
                              active
                                ? "bg-violet-600 text-white shadow-violet-500/20"
                                : "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"
                            }`}
                          >
                            ✦
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`truncate text-[13px] font-semibold ${
                                active
                                  ? "text-violet-700 dark:text-violet-300"
                                  : "text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {conversation.title || "New Chat"}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-400">
                              {new Date(
                                conversation.updatedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteConversation(
                            conversation._id
                          )
                        }
                        title="Delete conversation"
                        className="mr-2 hidden rounded-lg p-1.5 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-500 group-hover:block dark:hover:bg-red-500/10"
                      >
                        🗑
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar bottom */}
          <div className="border-t border-slate-100 p-3 dark:border-white/[0.06]">
            <button
              onClick={clearChat}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <span className="text-base">⌫</span>
              Clear current chat
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur sm:px-8 dark:border-white/[0.07] dark:bg-[#15161e]/95">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg text-white shadow-lg shadow-violet-500/20">
                ✦
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#15161e]" />
              </div>

              <div>
                <h1 className="text-[15px] font-bold text-slate-900 dark:text-white">
                  LifeOS AI
                </h1>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                  <span className="text-[11px] text-slate-300">•</span>
                  <span className="text-[11px] text-slate-400">
                    Your personal productivity assistant
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-slate-400 dark:hover:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              Clear
            </button>
          </header>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto">
            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-500/[0.04]" />

            <div className="relative mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">

              {/* Welcome */}
              {messages.length === 1 &&
                messages[0].role === "assistant" && (
                  <div className="mb-12">
                    <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-9 dark:border-white/[0.07] dark:bg-[#171820]">
                      <div className="mb-6 flex items-start justify-between gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-2xl text-white shadow-xl shadow-violet-500/20">
                          ✦
                        </div>

                        <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                          Personal AI
                        </span>
                      </div>

                      <h2 className="max-w-2xl text-3xl font-bold tracking-[-0.03em] text-slate-900 dark:text-white sm:text-4xl">
                        What can I help you
                        <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                          accomplish today?
                        </span>
                      </h2>

                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                        Ask LifeOS to organize your day, manage your
                        goals, plan your studies, or help you stay
                        productive.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {["Tasks", "Goals", "Habits", "Study"].map(
                          (item) => (
                            <span
                              key={item}
                              className="rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:bg-white/[0.05] dark:text-slate-400"
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                          Quick actions
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Start with one of these prompts
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.title}
                          onClick={() =>
                            handleSend(suggestion.text)
                          }
                          className="group rounded-2xl border border-slate-200/80 bg-white p-4.5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_12px_30px_rgba(124,58,237,0.10)] dark:border-white/[0.08] dark:bg-[#171820] dark:hover:border-violet-500/30"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-sm font-semibold text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-500/10 dark:text-violet-300">
                              {suggestion.icon}
                            </span>

                            <span className="text-slate-300 transition duration-200 group-hover:translate-x-1 group-hover:text-violet-500">
                              →
                            </span>
                          </div>

                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {suggestion.title}
                          </p>

                          <p className="mt-1.5 text-xs leading-5 text-slate-400">
                            {suggestion.text}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Conversation */}
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={index}
                    className={`mb-8 flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[92%] gap-3 sm:max-w-[80%] ${
                        isUser ? "flex-row-reverse" : ""
                      }`}
                    >
                      {!isUser && (
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs text-white shadow-md shadow-violet-500/15">
                          ✦
                        </div>
                      )}

                      <div>
                        {!isUser && (
                          <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300">
                            LifeOS AI
                          </p>
                        )}

                        <div
                          className={`whitespace-pre-wrap break-words text-[14px] leading-7 ${
                            isUser
                              ? "rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-600 to-violet-700 px-5 py-3.5 text-white shadow-lg shadow-violet-500/10"
                              : "rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-5 py-4 text-slate-700 shadow-sm dark:border-white/[0.08] dark:bg-[#171820] dark:text-slate-300"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading */}
              {loading && (
                <div className="mb-8 flex gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs text-white shadow-md shadow-violet-500/15">
                    ✦
                  </div>

                  <div>
                    <p className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-300">
                      LifeOS AI
                    </p>

                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-5 py-4 shadow-sm dark:border-white/[0.08] dark:bg-[#171820]">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-slate-200/80 bg-white/95 px-4 pb-5 pt-4 backdrop-blur dark:border-white/[0.07] dark:bg-[#15161e]/95 sm:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-[22px] border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.07)] transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-white/[0.1] dark:bg-[#1b1c26]">
                <div className="flex items-end">
                  <button
                    type="button"
                    title="Attachments coming soon"
                    className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-slate-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-white/[0.06] dark:hover:text-violet-300"
                  >
                    +
                  </button>

                  <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask LifeOS anything..."
                    className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                  />

                  <button
                    onClick={handleSend}
                    disabled={loading || !message.trim()}
                    title="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                  >
                    ↑
                  </button>
                </div>
              </div>

              <p className="mt-2.5 text-center text-[10px] text-slate-400 dark:text-slate-600">
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