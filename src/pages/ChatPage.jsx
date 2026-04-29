import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { requestId } = useParams();
  const [user, setUser] = useState(auth.currentUser);

  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  // 🔥 Auth fix
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 Find chat
  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("requestId", "==", requestId)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setChatId(snap.docs[0].id);
      }
    });

    return () => unsub();
  }, [requestId]);

  // 🔥 Listen messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((doc) => doc.data());
      setMessages(list);
    });

    return () => unsub();
  }, [chatId]);

  // 🔥 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Send message (FIXED)
  const sendMessage = async () => {
    if (!text.trim()) return;
    if (!chatId) return alert("Chat not ready yet");
    if (!user) return alert("Login required");

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: user.uid,
        text,
        createdAt: serverTimestamp(),
      });

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 flex flex-col items-center">

      {/* Chat Box */}
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg flex flex-col h-[70vh]">

        {/* Header */}
        <div className="p-4 border-b border-gray-700 font-bold text-lg">
          💬 Chat
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.senderId === user?.uid
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${msg.senderId === user?.uid
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-700 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 rounded bg-white text-black outline-none"
            placeholder="Type message..."
          />

          <button
            onClick={sendMessage}
            className="bg-green-500 hover:bg-green-600 px-4 rounded text-white font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;