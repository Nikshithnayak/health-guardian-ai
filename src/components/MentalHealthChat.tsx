import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MentalHealthChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there 💙 I'm your mental wellness companion. How are you feeling today? I'm here to listen, support, and suggest strategies to help you feel your best.\n\n*Remember: I'm an AI assistant. For serious concerns, please reach out to a mental health professional.*",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-health-analysis", {
        body: { type: "mental_health", data: { message: input } },
      });

      if (error) throw error;
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${e.message || "Something went wrong. Please try again."}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl flex flex-col h-[600px]"
    >
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <motion.div
          className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Mental Wellness AI</h3>
          <p className="text-xs text-muted-foreground">Your empathetic companion</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user" ? "bg-primary/20 text-foreground" : "bg-secondary text-secondary-foreground"
              }`}>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-secondary rounded-xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="How are you feeling?"
          disabled={loading}
          className="flex-1 bg-secondary rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
        />
        <Button onClick={handleSend} size="icon" disabled={loading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default MentalHealthChat;
