import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgentTag, DemoNote, PageHeader, Panel } from "@/components/app/ui-bits";
import { useApp } from "@/store/AppStore";
import { computeMetrics } from "@/lib/finance";
import { CfoAnswer, answerQuestion, suggestedQuestions } from "@/lib/cfo";

interface Msg {
  id: string;
  role: "user" | "cfo";
  text?: string;
  answer?: CfoAnswer;
}

const CFOChat = () => {
  const { transactions } = useApp();
  const m = useMemo(() => computeMetrics(transactions), [transactions]);
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m0",
      role: "cfo",
      answer: answerQuestion("summary", m, transactions),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const ask = (question: string) => {
    if (!question.trim() || thinking) return;
    const id = Date.now().toString();
    setMessages((prev) => [...prev, { id, role: "user", text: question }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const answer = answerQuestion(question, m, transactions);
      setMessages((prev) => [...prev, { id: id + "-a", role: "cfo", answer }]);
      setThinking(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI CFO"
        subtitle="Ask anything about your finances in plain language. The orchestrator routes the question to the right specialist agent and shows the data behind the answer."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Panel className="flex flex-col">
          <div className="space-y-5 max-h-[62vh] overflow-y-auto pr-1">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="rounded-xl rounded-tr-sm bg-primary text-primary-foreground px-3.5 py-2.5 text-sm">
                      {msg.text}
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg gradient-trust flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <AgentTag agent={msg.answer!.agent} />
                    <div className="rounded-xl rounded-tl-sm border border-border/70 bg-card p-4 mt-1.5">
                      <div className="font-display font-semibold text-[15px]">{msg.answer!.headline}</div>
                      <div className="grid sm:grid-cols-3 gap-2 my-3">
                        {msg.answer!.numbers.map((n) => (
                          <div key={n.label} className="rounded-lg bg-muted/60 px-3 py-2">
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{n.label}</div>
                            <div className="text-sm font-semibold tnum">{n.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        {msg.answer!.body.map((b, i) => (
                          <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                            {b}
                          </p>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/70 space-y-1.5">
                        <p className="text-[11px] text-muted-foreground/80">Data used: {msg.answer!.dataUsed}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.answer!.next.map((n) => (
                            <span key={n} className="rounded-md bg-primary/8 border border-primary/20 text-primary text-[11px] px-2 py-0.5">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ),
            )}
            {thinking && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Routing to the right agent and recomputing from the ledger…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="flex gap-2 mt-5 pt-4 border-t border-border/70"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Can I afford to hire two designers?"
              className="rounded-lg"
            />
            <Button type="submit" className="rounded-lg" disabled={thinking}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Panel>

        <div className="space-y-4">
          <Panel title="Try asking">
            <div className="space-y-1.5">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="w-full text-left text-xs rounded-lg border border-border/70 px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </Panel>
          <DemoNote>
            Answers are computed from your ledger with deterministic formulas. The AI layer chooses the agent, the framing
            and the recommendation — never the arithmetic.
          </DemoNote>
        </div>
      </div>
    </div>
  );
};

export default CFOChat;
