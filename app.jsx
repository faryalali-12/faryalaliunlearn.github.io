import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  "PAIzaSyCH84l_Oww4er4qqF9Lw3pdKx4QYLvRMZY"
);

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [jar, setJar] = useState([]);

  /* INTRO FLOW */
  useEffect(() => {
    const words = [
      "Too loud.",
      "Too much.",
      "Too ambitious.",
      "You were never too anything.",
    ];
    let i = 0;

    const interval = setInterval(() => {
      if (i < words.length) {
        document.getElementById("introText").innerText = words[i];
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setScreen("mood"), 1000);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  /* GEMINI RESPONSE */
  const getReply = async (text) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(
        `You are a warm emotional companion. Reply softly and supportively:\nUser: ${text}`
      );

      return result.response.text();
    } catch (e) {
      return "I'm here with you. Tell me more 🌸";
    }
  };

  /* SEND */
  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const replyText = await getReply(input);

    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "bot", content: replyText },
    ]);

    setJar((prev) => [...prev, {}]);
  };

  return (
    <>
      {/* INTRO */}
      <div className={`screen ${screen !== "intro" ? "hidden" : ""}`}>
        <div id="introText" className="introText">
          Too loud.
        </div>
      </div>

      {/* MOOD */}
      <div className={`screen ${screen !== "mood" ? "hidden" : ""}`}>
        <h2>How are you walking in?</h2>
        <div>
          <button onClick={() => setScreen("chat")}>🙂</button>
          <button onClick={() => setScreen("chat")}>🌿</button>
          <button onClick={() => setScreen("chat")}>🌙</button>
        </div>
      </div>

      {/* CHAT */}
      <div className={`screen ${screen !== "chat" ? "hidden" : ""}`}>
        <div className="chat">
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>

        <div className="inputBar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what you're feeling..."
          />
          <button className="send" onClick={send}>
            →
          </button>
        </div>

        <div className="jar">
          {jar.map((_, i) => (
            <div key={i} className="orb"></div>
          ))}
        </div>
      </div>
    </>
  );
}
