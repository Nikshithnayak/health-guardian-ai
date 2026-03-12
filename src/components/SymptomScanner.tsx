import { useState } from "react";
import { Brain, Send, Mic, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "ai";
  content: string;
}

const SymptomScanner = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello! I'm your AI Symptom Scanner. Describe your symptoms and I'll analyze potential conditions. Please note: this is not a substitute for professional medical advice.",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    
    // Simulated AI response
    const aiResponse: Message = {
      role: "ai",
      content: `Based on your symptoms "${input}", I've identified the following possibilities:\n\n• **Common Cold** — Risk: 45% — Mild severity\n• **Seasonal Allergies** — Risk: 30% — Low severity\n• **Viral Infection** — Risk: 15% — Moderate severity\n\n⚕️ **Recommendation:** Rest, stay hydrated, and monitor symptoms for 48 hours. Consult a doctor if symptoms worsen.`,
    };

    setMessages((prev) => [...prev, userMsg, aiResponse]);
    setInput("");
  };

  return (
    <div className="glass-card rounded-xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Symptom Scanner</h3>
          <p className="text-xs text-muted-foreground">Powered by MedGuardian AI</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success pulse-ring" />
          <span className="text-xs text-success">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-primary/20 text-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-4 py-2 flex items-center gap-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        <span>AI analysis only — not a medical diagnosis</span>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border flex items-center gap-2">
        <Button variant="glass" size="icon" className="flex-shrink-0">
          <Mic className="w-4 h-4" />
        </Button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Describe your symptoms..."
          className="flex-1 bg-secondary rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50"
        />
        <Button onClick={handleSend} size="icon" className="flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SymptomScanner;
