"use client";

import { useState, useEffect, useRef } from "react";
import { useAgent } from "./hooks/useAgent"; // agent messaging from server.
import { useStrategies } from "./hooks/useStrategies" // load strategies from server.
import { useLivePrices } from "./hooks/useLivePrices"; // price feed
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { Strategy } from "@/app/types/strategy";

/**
 * Home page for the AgentKit Quickstart
 *
 * @returns {React.ReactNode} The home page
 */
export default function Home() {

    const [input, setInput] = useState("");
    const { messages, sendMessage, isThinking } = useAgent();
    const { strategies, isLoading, loadStrategies, setStrategies } = useStrategies();
    const prices = useLivePrices();

    // Ref for the messages container
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the bottom
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      const es = new EventSource("/api/strategy-stream");

      es.onmessage = async (event) => {
        const fullList: Strategy[] = JSON.parse(event.data); 
        setStrategies(fullList);
      };
      return () => es.close();
    }, []);

    useEffect(() => {
      const es = new EventSource("/api/prices-stream");

      es.onmessage = async (event) => {
        console.log("pricesEvent",event)
        //const fullList: Strategy[] = JSON.parse(event.data); 
        //setStrategies(fullList);
      };
      return () => es.close();
    }, []);

    // load strategies on page load
    useEffect(() => {
      loadStrategies();
    }, []);

    useEffect(() => {
        console.log("Updated strategies:", strategies);
    }, [strategies]);

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const onSendMessage = async () => {
      if (!input.trim() || isThinking) return;
      const message = input;
      setInput("");
      await sendMessage(message);
    };

    return (
      <div className="flex flex-row w-full h-full w-full h-full">
        <div className="flex flex-row flex-grow items-center justify-center text-black dark:text-white w-full h-full">
          <div className="w-full max-w-2xl h-[70vh] bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto space-y-3 p-2">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">Start chatting with AgentKit...</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-2xl shadow ${
                      msg.sender === "user"
                        ? "bg-[#0052FF] text-white self-end"
                        : "bg-gray-100 dark:bg-gray-700 self-start"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        a: props => (
                          <a
                            {...props}
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ))
              )}

              {/* Thinking Indicator */}
              {isThinking && <div className="text-right mr-2 text-gray-500 italic">🤖 Thinking...</div>}

              {/* Invisible div to track the bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                className="flex-grow p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
                placeholder={"Type a message..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onSendMessage()}
                disabled={isThinking}
              />
              <button
                onClick={onSendMessage}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  isThinking
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-[#0052FF] hover:bg-[#003ECF] text-white shadow-md"
                }`}
                disabled={isThinking}
              >
                Send
              </button>
            </div>
          </div>
          <div className="w-[400px] h-[70vh] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto shadow-inner p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              💡 Active Strategies
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 animate-pulse">
                Loading strategies...
              </div>
            ) : strategies.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 italic text-center">
                No strategies found.
              </div>
            ) : (
              <ul className="space-y-4">
                {strategies.map((s) => (
                  <li
                    key={s.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Symbol:{" "}
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {s.symbol}
                      </span>
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Contract:{" "}
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {s.contract}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Frequency:{" "}
                      <span className="font-semibold text-gray-800 dark:text-gray-300">
                        {s.frequency}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Risk:{" "}
                      <span className="font-semibold text-gray-800 dark:text-gray-300">
                        {s.risk}
                      </span>
                    </p>
<div className="text-right">
          {/* Directly reference the priceMap */}
          <p className="text-lg font-mono">
            {prices[s.id]?.price
              ? `${prices[s.id].price} ${prices[s.id].quoteCurrency}`
              : "—"}
          </p>
        </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    );
}
