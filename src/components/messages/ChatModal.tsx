
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, X, Send, UserRound } from "lucide-react";
import { useApp } from "../../context/AppContext";

const ChatModal: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    activeChatRecipient,
    messages,
    sendMessage,
    currentUser,
  } = useApp();

  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const recipientName = activeChatRecipient?.name ?? "Kontak";
  const recipientId = activeChatRecipient?.id;

  const conversation = useMemo(() => {
    if (!currentUser) return [];

    return messages.filter((message) => {
      const isMine = message.senderId === currentUser.id;

      const isIncoming = recipientId
        ? message.senderId === recipientId
        : message.senderName === recipientName;

      const isOutgoingToRecipient = recipientId
        ? message.recipientId === recipientId
        : message.recipientName === recipientName;

      return isIncoming || (isMine && isOutgoingToRecipient);
    });
  }, [messages, currentUser, recipientId, recipientName]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.length, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = inputValue.trim();

    if (!text || !currentUser) return;

    sendMessage(recipientName, text);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex h-[min(620px,85vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <header className="flex items-center justify-between bg-blue-700 px-4 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <MessageSquare size={19} />
          </div>

          <div>
            <h2 className="text-sm font-bold">{recipientName}</h2>
            <p className="text-xs text-blue-100">
              Percakapan InternSpace
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Tutup chat"
          onClick={() => setIsChatOpen(false)}
          className="rounded-lg p-2 transition hover:bg-white/10"
        >
          <X size={19} />
        </button>
      </header>

      {/* Conversation */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {conversation.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageSquare size={25} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-800">
              Mulai percakapan
            </h3>

            <p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-500">
              Kirim pesan untuk berdiskusi tentang proyek atau lamaran.
            </p>
          </div>
        ) : (
          conversation.map((message) => {
            const isMine = message.senderId === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-3 ${
                    isMine
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {!isMine && (
                    <p className="mb-1 text-[10px] font-bold text-blue-700">
                      {message.senderName}
                    </p>
                  )}

                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.text}
                  </p>

                  <p
                    className={`mt-1.5 text-right text-[10px] ${
                      isMine ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString(
                      "id-ID",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSend}
        className="border-t border-slate-200 bg-white p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Tulis pesan..."
            className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || !currentUser}
            aria-label="Kirim pesan"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400">
          <UserRound size={11} />
          Pesan demo disimpan di sesi aplikasi ini.
        </p>
      </form>
    </div>
  );
};

export default ChatModal;
