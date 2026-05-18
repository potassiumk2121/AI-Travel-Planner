import { useState } from "react";
import { Bot, Send, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const starterMessages = [
  {
    role: "assistant",
    content: "Ask me about neighborhoods, safety tradeoffs, packing, transit, food, or how to adjust a route."
  }
];

export const Chat = () => {
  const toast = useToast();
  const [messages, setMessages] = useState(starterMessages);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    const nextQuestion = question.trim();
    setMessages((current) => [...current, { role: "user", content: nextQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", { question: nextQuestion });
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (error) {
      toast.error("Chat failed", error.userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-2rem)] gap-5">
      <section className="glass rounded-lg p-5">
        <h1 className="text-3xl font-bold tracking-normal">AI Travel Chat</h1>
        <p className="mt-2 text-muted-foreground">Use it for route tweaks, local planning questions, and safety checks.</p>
      </section>

      <Card className="min-h-[28rem]">
        <CardContent className="flex h-full min-h-[28rem] flex-col p-5">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" ? (
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                    <Bot className="h-4 w-4" />
                  </span>
                ) : null}
                <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  
                </div>
                {message.role === "user" ? (
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary/18 text-secondary-foreground">
                    <UserRound className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
            ))}
            {loading ? <p className="text-sm text-muted-foreground">Thinking...</p> : null}
          </div>

          <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={ask}>
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about your next destination..."
              className="min-h-16 flex-1"
            />
            <Button type="submit" disabled={loading} className="sm:self-end">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
