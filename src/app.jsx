import React, { useEffect, useState, useRef } from "react";
import MarkdownMessage from "./components/MarkdownMessage";
import { motion } from "framer-motion";
import {
  Github, Linkedin, Mail, FileText, ExternalLink, ArrowRight,
  Code2, BrainCircuit, Database, GraduationCap, Building2, CalendarDays, ArrowLeft, FileCog2, BriefcaseBusiness, PanelLeftRightDashed, AlignHorizontalSpaceBetween, Maximize
} from "lucide-react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { PilcrowRight } from "lucide-react";

/* ------------------------------ CSV utils ------------------------------ */
function parseCSVtoSplit(csvText) {
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  const rows = lines.map(l => l.split(","));
  const header = rows[0];
  const dataRows = rows.slice(1);
  const columns = header.slice(1);
  const index = dataRows.map(r => r[0]);
  const data = dataRows.map(r => r.slice(1));
  return { columns, index, data };
}

/* Generic loader for any split-style CSV/JSON table */
function LoadSplitTable({ title, csvUrl, jsonUrl, note }) {
  const [tab, setTab] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (jsonUrl) {
          const r = await fetch(jsonUrl);
          if (r.ok) {
            const j = await r.json();
            setTab(j);
            return;
          }
        }
        const r2 = await fetch(csvUrl);
        if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
        const text = await r2.text();
        setTab(parseCSVtoSplit(text));
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [csvUrl, jsonUrl]);

  if (err) return <p className="text-rose-300 text-sm">Failed to load {title}: {err}</p>;
  if (!tab) return <p className="text-slate-300 text-sm">Loading {title}…</p>;

  const { columns, index, data } = tab;
  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-3 py-2 text-left text-slate-300">Variables</th>
              {columns.map((c) => (
                <th key={c} className="px-3 py-2 text-left text-slate-300">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const label = index[i];
              const isLevel = /: /.test(label);
              return (
                <tr key={i} className={i % 2 ? "bg-white/[0.03]" : ""}>
                  <td className={`px-3 py-2 text-slate-200 ${isLevel ? "pl-6" : "font-medium"}`}>{label}</td>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-slate-200">{cell}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-2 text-xs text-slate-400">{note}</p>}
      <div className="mt-2">
        {csvUrl && (
          <a
            href={csvUrl}
            className="text-indigo-300 hover:text-indigo-200 text-xs underline"
            target="_blank" rel="noopener noreferrer"
          >
            Download {title} (CSV)
          </a>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Shared UI ------------------------------ */
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
    {children}
  </span>
);

/* Button supports internal routes (Link) and external anchors */
const Button = ({ href, children, variant = "primary", onClick, as = "a" }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition";
  const styles = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white shadow hover:shadow-lg",
    ghost: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
  };
  const className = `${base} ${styles[variant]}`;
  if (as === "link") {
    return <Link to={href} className={className}>{children}</Link>;
  }
  const isExternal = href && !href.startsWith("/");
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-6 sm:py-10">
    <div className="mx-auto max-w-6xl px-4">
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="mt-2 text-slate-300">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  </section>
);

const Card = ({ children }) => (
  <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 transition overflow-hidden">
    <div className="pointer-events-none absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-2xl transition"
         style={{ background: "radial-gradient(400px 200px at 0% 0%, rgba(99,102,241,.25), transparent 60%)" }} />
    {children}
  </div>
);

/* ------------------------------ Assets (figures) ------------------------------ */
const FIGS = {
  shapSummary: "/figures/shap_summary.png",
  shapWaterfall: "/figures/shap_waterfall.png",
  roc: "/figures/roc_weighted_xgb_vs_lasso.png",
  pr: "/figures/pr_weighted_xgb_vs_lasso.png",
  bcRoc: "/figures/bc_roc.png", // export your ROC image here
};

/* ------------------------------ Data ------------------------------ */
const PROFILE = {
  name: "Jean D'Amour Kwizerimana",
  title: "Biostatistician & ML Enthusiast",
  blurb: "I build statistically rigorous, production-ready analytics and ML for public health, oncology, and internal medicine.",
  cv_url: "/Resume.pdf",
  links: {
    github: "https://github.com/jkwizerimana2",
    linkedin: "https://www.linkedin.com/in/jean-d’amour-k-321b87164/",
    email: "mailto:jeandamourk17@gmail.com",
  },
  skills: ["Statistics", "ML / DL", "Data Eng"],
};

const FEATURED = [
  {
    title: "Psychosocial Factors & Mental Health (ALSWH 1946–51)",
    year: "2025",
    desc: "Exploratory Factor Analysis of stress, support, and distress in Survey 1; regression of factor scores on SF-36 Mental Health.",
    bullets: [
      "EFA (oblimin) on 9 items → 3 factors: Hassles/Stress, Support, Distress",
      "Salient loadings across factors; reliability α≈0.61–0.65",
      "OLS: R²≈0.293; Support positive, Distress negative; Hassles negative",
    ],
    tags: ["Python", "EFA", "StatsModels", "scikit-learn", "ALSWH"],
    links: [{ label: "Details", href: "/factor-analysis" }],
  },
  {
    title: "LV Structural Abnormalities from CXR",
    year: "2025",
    desc: "Replication of Bhave et al. (EHJ 2024): DenseNet-121 + age/sex; detect SLVH & DLV from CXRs (CUIMC).",
    bullets: [
      "DenseNet-121 + age/sex; multitask regression of IVSd/LVPWd/LVIDd → calibrated probabilities (logistic + isotonic).",
      "Patient-wise 90/5/5; AUROC (test): Composite 0.75 [0.73–0.77], DLV 0.77 [0.74–0.80], SLVH 0.73 [0.70–0.76]."
    ],
    tags: ["TensorFlow/Keras", "DenseNet-121", "Bootstrap CIs"],
    links: [{ label: "Details", href: "/cxr" }],
  }
,
  {
    title: "ICU Mortality Prediction",
    year: "2025",
    desc: "Logistic Regression & XGBoost on the MIT GOSSIS / WiDS Datathon dataset.",
    bullets: [
      "Multi-center ICU dataset (130k+ admissions, first 24h data, 8–10% mortality)",
      "Baseline & weighted L1-logistic; threshold tuning for F2/recall",
      "XGBoost with hyperparameter search, class weighting (scale_pos_weight)",
      "Imputation (mean/mode), scaling, one-hot encoding, collinearity checks",
      "Evaluation: AUROC, PR curve, AP; cost-based and SHAP-based explainability",
    ],
    tags: ["scikit-learn", "XGBoost", "SHAP", "AUROC", "Precision-Recall"],
    links: [{ label: "Details", href: "/icu" }],
  }, 
  {
    title: "Breast Cancer Recurrence Analysis (GLMM)",
    year: "2025",
    desc: "Hospital registry cohort; multilevel logistic regression with facility random intercept; bivariate screening + ROC.",
    bullets: [
      "Sample: 3,257 patients (2,715 no recurrence; 542 recurrence)",
      "Predictors: age, race, ER, PR; ICC ≈ 0.056 (facility)",
      "Results: 40–60 & 60–80 lower odds vs ≤40; ER+/PR+ protective; White vs Black lower odds",
      "Discrimination: AUROC 0.77 (marginal) / 0.83 (conditional)"
    ],
    tags: ["R", "GLMM", "Epidemiology", "ROC/AUC"],
    links: [
      { label: "Details", href: "/breast-cancer" },
    ],
  }
];

const RECENT = [
  {
    title: "Biostatistics",
    desc: "Designing robust and interpretable models using classic statistical methods.",
    bullets: [
      "Descriptive stats, hypothesis testing, power/sample size calculation",
      "Linear/logistic/Poisson/Cox, mixed effects & GEE, survival analysis",
      "Predictive modeling & causal inference (propensity scores, IPTW, MSM)",
    ],
    tags: ["R", "SAS", "STATA", "SPSS", "Python"],
    links: [{ label: "Brief", href: "#" }, { label: "Shiny", href: "#" }],
  },
  {
    title: "Public Health Research",
    desc: "Leveraging public data for epidemiologic insights and reproducible reporting.",
    bullets: [
      "Evidence-based analysis, visualization, and reporting",
      "Program evaluation and policy",
      "Community health needs assessments",
    ],
    tags: ["Tableau", "Power BI", "GIS", "Shiny"],
    links: [{ label: "Brief", href: "#" }, { label: "Shiny", href: "#" }],
  },
  {
    title: "Machine Learning",
    desc: "Building and deploying ML models for classification, regression, and clustering.",
    bullets: [
      "Data preprocessing, feature engineering, model training/tuning",
      "Evaluation (CV, metrics, calibration); interpretation (SHAP, LIME, PDP, ICE)",
      "Deployment (APIs, dashboards, web apps)",
    ],
    tags: ["Python", "PyTorch", "Tensorflow/Keras"],
    links: [{ label: "Brief", href: "#" }, { label: "Shiny", href: "#" }],
  },
];

/* ------------------------------ Header ------------------------------ */
function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-extrabold tracking-tight text-white">
          JK<span className="text-indigo-400">.</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {[{t:"Home", href:"/"}, {t:"Projects", href:"/#projects"}, {t:"Experience", href:"/#experience"}, {t:"Education", href:"/#education"}, {t:"Contact", href:"/#contact"}].map(({t, href}) => (
            href.startsWith("/") && !href.includes("#") ? (
              <Link key={t} to={href} className="text-slate-300 hover:text-white">{t}</Link>
            ) : (
              <a key={t} href={href} className="text-slate-300 hover:text-white">{t}</a>
            )
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={PROFILE.links.github} aria-label="GitHub" className="p-2 rounded-lg hover:bg-white/10" target="_blank" rel="noopener noreferrer"><Github size={18} /></a>
          <a href={PROFILE.links.linkedin} aria-label="LinkedIn" className="p-2 rounded-lg hover:bg-white/10" target="_blank" rel="noopener noreferrer"><Linkedin size={18} /></a>
          <a href={PROFILE.links.email} aria-label="Email" className="p-2 rounded-lg hover:bg-white/10"><Mail size={18} /></a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ Chatbot ------------------------------ */
function Chatbot() {
  const [mode, setMode] = useState("rag"); // "rag" | "ollama"
  const [model, setModel] = useState(import.meta?.env?.VITE_OLLAMA_MODEL || "qwen2.5:7b-instruct");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inFlight = useRef(false);

  // Use Vite proxy in dev; override with VITE_RAG_URL in .env for two-tunnel setup
  const API_BASE = import.meta.env.VITE_RAG_URL || "/api";
  const RAG_EP   = "/ask";

  const persona = [
    `You are assisting ${PROFILE.name}.`,
    `Title: ${PROFILE.title}.`,
    `Focus: ${PROFILE.blurb}`,
    `Key domains: ${PROFILE.skills.join(", ")}.`,
  ].join(" ");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e) {
    e?.preventDefault();
    const content = input.trim();
    if (!content) return;
    if (loading || inFlight.current) return;

    inFlight.current = true;
    setLoading(true);

    const userMsg = { role: "user", content };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      let replyText = "";

      if (mode === "rag") {
        // ---- RAG → FastAPI /ask (via Vite proxy/API_BASE) ----
        const resp = await fetch(`${API_BASE}${RAG_EP}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: content }),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        replyText = data?.answer || "(no answer)";
      } else {
        // ---- Ollama-only → FastAPI proxy /ollama/generate (NOT 11434) ----
        const history = [
          { role: "system", content: persona },
          ...messages,
          userMsg,
        ].map(({ role, content }) => ({ role, content }));

        // Simple prompt fallback for models without /api/chat
        const fallbackPrompt =
          history
            .filter(m => m.role !== "system")
            .map(m => (m.role === "user" ? `User: ${m.content}` : `Assistant: ${m.content}`))
            .join("\n") + "\nAssistant:";

        // Try proxy chat first (your backend can forward to /api/chat if supported)
        let resp = await fetch(`${API_BASE}/ollama/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model,
            // If your backend supports /api/chat, you can send messages instead.
            // For broad compatibility, send a single prompt:
            prompt: fallbackPrompt,
            options: { num_predict: 256 },
          }),
        });

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        replyText = data?.response || data?.message?.content || "(no reply)";
      }

      setMessages((m) => [...m, { role: "assistant", content: replyText }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `[Error: ${err?.message ?? err}]` },
      ]);
    } finally {
      setLoading(false);
      inFlight.current = false;
    }
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <div className="flex items-center justify-between border-b border-white/10 p-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-slate-200">
            {mode === "rag" ? "Connected to RAG" : "Connected to Ollama (proxied)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-300">Knowledge</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-lg bg-slate-900/70 text-slate-200 text-xs px-2 py-1 border border-white/10"
            title="Choose knowledge source"
          >
            <option value="rag">RAG</option>
            <option value="ollama">Ollama only</option>
          </select>

          <label className="text-xs text-slate-300 ml-3">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-lg bg-slate-900/70 text-slate-200 text-xs px-2 py-1 border border-white/10"
            title="Ollama model (must be pulled)"
          >
            <option value="qwen2.5:7b-instruct">qwen2.5:7b-instruct</option>
            <option value="llama3.1:8b">llama3.1:8b</option>
            <option value="mistral:7b">mistral:7b</option>
          </select>

          <button
            onClick={clearChat}
            className="text-xs rounded-lg border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-indigo-500/20 border border-indigo-400/30"
                : "mr-auto bg-white/5 border border-white/10"
            }`}
          >
            <div className="text-[11px] mb-1 uppercase tracking-wider text-slate-400">
              {m.role === "user" ? "You" : "Assistant"}
            </div>
            <MarkdownMessage text={m.content} className="text-slate-200" />
          </div>
        ))}
        {loading && (
          <div className="mr-auto max-w-[85%] rounded-xl px-3 py-2 text-sm bg-white/5 border border-white/10 text-slate-300">
            <span className="animate-pulse">Thinking…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={mode === "rag" ? "Ask about Jean/projects (RAG)" : "Ask the model…"}
            className="flex-1 rounded-xl bg-slate-900/70 border border-white/10 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-indigo-500 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}


/* ------------------------------ Pages ------------------------------ */
function HomeContent() {
  return (
    <>
      {/* HERO */}
      <section id="home" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-300/90">
              <span className="size-1.5 rounded-full bg-indigo-400" /> Available for collaboration
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                {PROFILE.title}
              </span>
            </h1>
            <p className="mt-4 text-slate-300 max-w-prose">{PROFILE.blurb}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill><Code2 className="mr-1.5" size={14}/> Statistics</Pill>
              <Pill><BrainCircuit className="mr-1.5" size={14}/> ML / DL</Pill>
              <Pill><Database className="mr-1.5" size={14}/> Data Eng</Pill>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">

            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-3xl font-extrabold text-white">Statistics</div>
                <div className="text-sm text-slate-300">Causal & Predictive</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-3xl font-extrabold text-white">Public Health</div>
                <div className="text-sm text-slate-300">Improving People's Health</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-3xl font-extrabold text-white">ML & AI</div>
                <div className="text-sm text-slate-300">RAG LLM CNN LR SVM ...</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-3xl font-extrabold text-white">3+&nbsp;Years</div>
                <div className="text-sm text-slate-300">Experience</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <Section id="projects" title="Featured Projects">
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURED.map((p) => (
            <Card key={p.title}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{p.desc}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                  <CalendarDays size={14}/> {p.year}
                </span>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-300 list-disc pl-5">
                {p.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => <Pill key={t}>{t}</Pill>)}
              </div>
              <div className="mt-5 flex gap-3">
                {p.links.map((l) =>
                  l.href.startsWith("/") ? (
                    <Button key={l.label} as="link" href={l.href} variant="ghost">
                      {l.label} <ArrowRight size={14}/>
                    </Button>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      className="inline-flex items-center gap-1.5 text-sm text-indigo-300 hover:text-indigo-200"
                      target="_blank" rel="noopener noreferrer"
                    >
                      {l.label} <ExternalLink size={14}/>
                    </a>
                  )
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

{/* RECENT */}
        <Section title="Research Areas" subtitle="Let's work together in these domains">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECENT.map((p) => (
              <Card key={p.title}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{p.desc}</p>
                  </div>
                  {p.year && (
                    <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                      <CalendarDays size={14}/> {p.year}
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-1.5 text-sm text-slate-300 list-disc pl-5">
                  {p.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => <Pill key={t}>{t}</Pill>)}
                </div>
                {/* Links removed */}
              </Card>
            ))}
          </div>
        </Section>


      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" subtitle="What I have been up to:">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              org: "UNMC - College of Medicine",
              role: "Data Analyst",
              time: "Jun 2025 – Present",
              items: [
                "Analysis on RA and RA-ILD in the VA database",
                "Causal pipelines (PSM, IPTW, MSM)",
                "R/Python packages for internal use",
              ],
            },
            {
              org: "NE-DHHS",
              role: "Graduate Research Assistant",
              time: "Jan 2024 – May 2025",
              items: [
                "Data cleaning, linkage, and visualization",
                "ATV fatality analytics from death certificates",
                "Shiny dashboards & reproducible reporting",
                "Cancer surveillance (bladder, lung); NPDS poison surveillance",
              ],
            },
                        {
              org: "CHI Health",
              role: "Data Science Intern",
              time: "May 2024 – August 2024",
              items: [
                "Data integration & SQL preparation (cancer registry + EMR)",
                "Nested & mixed-effects modeling of cervical/breast cancer disparities",
                "Interactive visualization (ggplot2, Tableau)",
                "Multidisciplinary collaboration: oncology, registry, public health",
,
              ],
            },
                        {
              org: "UNMC - College of Public Health",
              role: "Graduate Research Assistant",
              time: "Sept 2023 – June 2024",
              items: [
                "IRB compliance & participant confidentiality",
                "Survey data validation",
                "REDCap survey administration",
                "LexisNexis participant tracing",

              ],
            },
          ].map((e) => (
            <Card key={e.org}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-300" />
                  <h3 className="text-base font-semibold text-white">{e.org}</h3>
                </div>
                <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                  <CalendarDays size={14}/> {e.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-indigo-200">{e.role}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-300 list-disc pl-5">
                {e.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* EDUCATION */}
      <Section id="education" title="Education" subtitle="Foundations of my work">
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { school: "UNMC", degree: "MPH, Biostatistics", time: "2023 – 2025" },
            { school: "UNL", degree: "BSc, Integrated Science", time: "2018 – 2022" },
          ].map((d) => (
            <Card key={d.school}>
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-emerald-300" />
                <div>
                  <h3 className="text-base font-semibold text-white">{d.school}</h3>
                  <p className="text-sm text-slate-300">{d.degree}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">{d.time}</p>
            </Card>
          ))}
        </div>
      </Section>
      {/* CONTACT / FOOTER */}
      <Section id="contact" title="Contact">
        <div className="flex flex-wrap items-center gap-3">
          <Button href={PROFILE.links.email}><Mail size={16}/> Email</Button>
          <Button href={PROFILE.links.linkedin} variant="ghost"><Linkedin size={16}/> LinkedIn</Button>
          <Button href={PROFILE.links.github} variant="ghost"><Github size={16}/> GitHub</Button>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------ ICU Page ------------------------------ */
function Table1() {
  const [tab, setTab] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("/data/table1.json")
      .then(r => {
        if (r.ok) return r.json().then(setTab);
        return fetch("/data/table1.csv")
          .then(rr => { if (!rr.ok) throw new Error(`HTTP ${rr.status}`); return rr.text(); })
          .then(text => setTab(parseCSVtoSplit(text)));
      })
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <p className="text-rose-300 text-sm">Failed to load Table 1: {err}</p>;
  if (!tab) return <p className="text-slate-300 text-sm">Loading Table 1…</p>;

  const { columns, index, data } = tab;

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-white/5">
            <tr>
              <th className="px-3 py-2 text-left text-slate-300 w-[30%]">Variable</th>
              {columns.map((c) => (
                <th key={c} className="px-3 py-2 text-right text-slate-300">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const label = index[i];
              return (
                <tr key={label} className={i % 2 ? "bg-white/[0.03]" : ""}>
                  {/* All variables flush left, bold for main rows */}
                  <td className="px-3 py-2 text-slate-200 font-medium">{label}</td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-3 py-2 text-slate-200 text-right whitespace-nowrap tabular-nums align-top"
                      title={String(cell)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Continuous variables are mean&nbsp;(SD); categorical variables are n&nbsp;(%).
      </p>
      <div className="mt-2">
        <a
          href="/data/table1.csv"
          className="text-indigo-300 hover:text-indigo-200 text-xs underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Table 1 (CSV)
        </a>
      </div>
    </div>
  );
}


function ICUPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#312e81_20%,transparent),radial-gradient(800px_400px_at_90%_-20%,#0f766e_10%,transparent)] bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white">
          <ArrowLeft size={16}/> Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Predicting ICU Mortality with Logistic Regression and XGBoost
        </h1>

        {/* ------------------------------ Introduction ------------------------------ */}
        <section className="mt-6 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Introduction</h2>
          <p>
            Predicting in-hospital mortality for intensive care unit (ICU) patients is critical for
            prioritizing care, allocating resources, and informing early interventions. Traditional models
            (e.g., APACHE) use limited variable sets and linear assumptions, whereas modern ML methods can
            capture nonlinearities and interactions in heterogeneous EHR data.
          </p>
          <p>
            We used the multi-center WiDS/MIT GOSSIS ICU dataset (first 24h features; 130k+ admissions) to
            compare L1-regularized logistic regression and gradient-boosted trees (XGBoost). Our clinical
            objective emphasized minimizing missed mortality (high recall), with threshold tuning to balance
            alert burden and sensitivity.
          </p>
        </section>

        {/* ------------------------------ Methods ------------------------------ */}
        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Methods</h2>

          <h3 className="pt-2 font-semibold text-slate-100">Data and Preprocessing</h3>
          <p>
            From first-24h variables we excluded high-missingness labs, filtered collinearity
            (absolute correlation &gt; 0.80), and renamed the outcome to <em>Death</em>. Missing numeric
            values were imputed with means; categorical values with the most frequent level. Numeric
            features were standardized and categorical features one-hot encoded via a
            <code> ColumnTransformer</code> pipeline. We performed a 90/10 stratified split.
          </p>

          <h3 className="pt-4 font-semibold text-slate-100">Models and Tuning</h3>
          <p>
            Baseline was L1-penalized <code>LogisticRegression</code> (solver “saga”) with and without
            class balancing. For XGBoost we trained unweighted and class-weighted models (using
            <code> scale_pos_weight</code>) with randomized search (30 candidates; 3-fold CV) over maximum
            depth, learning rate, subsampling, column subsampling, estimators, and L1/L2 regularization.
            We tuned decision thresholds by maximizing F2 and by meeting a recall constraint.
          </p>

          <h3 className="pt-4 font-semibold text-slate-100">Evaluation</h3>
          <p>
            Primary metric was AUROC; we also examined precision–recall (average precision). At selected
            thresholds we report accuracy, precision, recall, F1, and false-positive rate. SHAP was used
            for global and patient-level interpretation of the weighted XGBoost model.
          </p>
        </section>

        {/* ------------------------------ Results ------------------------------ */}
        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Results</h2>

          <h3 className="pt-2 font-semibold text-slate-100">Baseline Characteristics (Table 1)</h3>
          <p>
            Table 1 summarizes baseline characteristics by in-hospital mortality status (Alive vs Death).
            Continuous variables are shown as mean (SD); categorical variables as counts (percentages).
          </p>

          <Table1 />

          <p className="mt-4">
            Non-survivors were older and more acutely ill at presentation: mean age was <strong>68.5</strong> years in the Death group versus <strong>61.8</strong> years in the Alive group, and pre-ICU length of stay was longer (<strong>1.35</strong> vs <strong>0.79</strong> days). Neurologic status was worse among those who died (GCS Eyes <strong>2.65</strong> vs <strong>3.54</strong>; GCS Verbal <strong>2.76</strong> vs <strong>4.11</strong>). Vital signs showed higher heart rate (<strong>110.6</strong> vs <strong>98.7</strong> bpm) and respiratory rate (<strong>30.1</strong> vs <strong>25.4</strong> breaths/min), lower mean arterial pressure (<strong>82.5</strong> vs <strong>88.5</strong> mmHg), and lower temperature (<strong>36.0</strong> vs <strong>36.5</strong> °C) among non-survivors. Markers of organ dysfunction and inflammation were elevated in deaths (BUN <strong>37.8</strong> vs <strong>24.7</strong> mg/dL; creatinine <strong>2.04</strong> vs <strong>1.43</strong> mg/dL; WBC <strong>15.1</strong> vs <strong>11.8</strong> ×10⁹/L). Mechanical ventilation was far more common in deaths (<strong>67.5%</strong> vs <strong>29.3%</strong>), while elective surgery was less frequent (<strong>6.6%</strong> vs <strong>19.5%</strong>). Deaths were more often admitted from the floor (<strong>26.5%</strong> vs <strong>16.1%</strong>) and less often from the operating room/recovery (<strong>8.8%</strong> vs <strong>21.5%</strong>), and occurred predominantly in medical-surgical ICUs (<strong>55.9%</strong> vs <strong>55.1%</strong>), mirroring the overall ICU case-mix.
          </p>

          <h3 className="pt-2 font-semibold text-slate-100">Logistic Regression</h3>
          <p>
            Unweighted LASSO achieved AUROC 0.86 and accuracy 0.92. Class 0 (Alive) precision, recall, and
            F1 were 0.93, 0.99, and 0.96; Class 1 (Death) precision, recall, and F1 were 0.61, 0.16, and
            0.26. With class-balanced weights, AUROC remained 0.86; accuracy decreased to 0.78 while Death
            recall improved to 0.77 (precision 0.25; F1 0.38).
          </p>

          <h3 className="pt-2 font-semibold text-slate-100">XGBoost</h3>
          <p>
            The unweighted model (maximum depth five; learning rate 0.10; subsampling 1.0; column
            subsampling 0.60; 200 estimators; L1 0.10; L2 1) produced AUROC 0.895 and accuracy 0.93. Death
            precision and recall were 0.69 and 0.29 (F1 0.41). The weighted model (maximum depth four;
            learning rate 0.10; subsampling 1.0; column subsampling 0.80; 200 estimators; L1 1; L2 1)
            achieved AUROC 0.891 with Death recall 0.79 (precision 0.28; accuracy 0.81; F1 0.42).
          </p>
          <p>
            To visualize operating characteristics, we compared receiver operating characteristic (ROC) and
            precision–recall (PR) curves for weighted XGBoost and weighted LASSO on the holdout. ROC curves
            summarize discrimination across thresholds, whereas PR curves emphasize performance on the
            minority class by plotting precision against recall.
          </p>

          <figure className="mt-2">
            <img
              src={FIGS.roc}
              alt="ROC curves: weighted XGBoost vs weighted LASSO"
              className="w-full rounded-xl border border-white/10"
            />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure A.</span> ROC curves comparing weighted XGBoost and weighted
              LASSO logistic regression (AUC shown in legend).
            </figcaption>
          </figure>

          <figure className="mt-6">
            <img
              src={FIGS.pr}
              alt="Precision–Recall curves: weighted XGBoost vs weighted LASSO"
              className="w-full rounded-xl border border-white/10"
            />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure B.</span> Precision–Recall curves comparing weighted XGBoost and
              weighted LASSO; the dashed line marks the prevalence baseline.
            </figcaption>
          </figure>

          <p>
            Consistent with the numeric results, the ROC curves show comparable overall discrimination,
            while the PR curves highlight that, at recall near 0.75, weighted XGBoost maintains higher
            precision (fewer false alarms) than weighted LASSO. This supports selecting weighted XGBoost
            when alert burden must be controlled under a fixed sensitivity target.
          </p>

          <h3 className="pt-2 font-semibold text-slate-100">Model Interpretation (SHAP)</h3>
          <p>
            Global SHAP analysis highlighted ventilation status, age, Glasgow Coma Scale subscores,
            heart rate, mean arterial pressure, respiratory rate, and temperature as major drivers of risk.
            Renal and inflammatory markers (BUN, creatinine, WBC), APACHE II/III diagnoses, pre-ICU length
            of stay, and elective surgery also contributed. A representative waterfall plot showed
            how abnormal temperature, reduced GCS, ventilation, tachycardia, and hypotension pushed a
            prediction toward death, while younger age and lower creatinine were protective.
          </p>
          <p>
            We display the SHAP summary plot to visualize global importance and directionality across all
            patients, followed by a waterfall plot for a representative stay to illustrate feature-wise
            contributions for an individual prediction.
          </p>

          <figure className="mt-2">
            <img
              src={FIGS.shapSummary}
              alt="SHAP summary plot for weighted XGBoost"
              className="w-full rounded-xl border border-white/10"
            />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure C.</span> SHAP summary plot (weighted XGBoost). Each point
              is a patient; color encodes feature value (blue = low, red = high). Higher SHAP values increase
              predicted mortality.
            </figcaption>
          </figure>

          <figure className="mt-6">
            <img
              src={FIGS.shapWaterfall}
              alt="SHAP waterfall for a representative patient"
              className="w-full rounded-xl border border-white/10"
            />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure D.</span> SHAP waterfall for a representative ICU stay,
              showing feature-wise contributions from the baseline toward the predicted log-odds of death.
            </figcaption>
          </figure>

          <p>
            These plots confirm that the model’s risk signals align with known pathophysiology—respiratory
            failure, neurologic depression, hemodynamic instability, and renal dysfunction—supporting face
            validity and enabling transparent, patient-level rationale for risk scores in clinical review.
          </p>
        </section>

        {/* ------------------------------ Discussion ------------------------------ */}
        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Discussion</h2>
          <p>
            Both models demonstrated strong discrimination. Weighting strategies substantially improved
            sensitivity for mortality, consistent with our objective of minimizing false negatives. At
            matched sensitivity (recall ≈ 0.75), weighted XGBoost provided higher precision and a lower
            false-positive rate than weighted LASSO, suggesting a more favorable alert burden when resources
            are limited; conversely, the F2-optimal LASSO setting may suit contexts prioritizing maximal
            capture of deaths despite more false positives.
          </p>
          <p>
            SHAP explanations aligned with established risk factors (ventilation, age, neurologic status,
            hemodynamics, organ dysfunction), supporting face validity and enabling transparent, patient-level
            rationale. Limitations include use of first-24h features only, simple imputation, potential
            miscalibration with weighting, and internal validation only. Future work should examine
            calibration and decision-curve analyses, subgroup fairness, temporal trajectories, and external
            prospective validation with drift monitoring.
          </p>
        </section>

        {/* ------------------------------ References ------------------------------ */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">References</h2>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-slate-300 text-sm">
            <li>Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 785–794. https://doi.org/10.1145/2939672.2939785</li>
            <li>Karasneh, R., Al-Azzam, S., Alzoubi, K. H., Araydah, M., Rahhal, D., Al-Azzam, Y., Kharaba, Z., Kabbaha, S., & Aldeyab, M. A. (2025). ICU Mortality Prediction Using XGBoost-based Scoring Systems: A Study from a Developing Country. Reviews on Recent Clinical Trials. Advance online publication. https://doi.org/10.2174/0115748871348585250604065542</li>
            <li>Knaus, W. A., Draper, E. A., Wagner, D. P., & Zimmerman, J. E. (1985). APACHE II: A severity of disease classification system. Critical Care Medicine, 13(10), 818–829. https://doi.org/10.1097/00003246-198510000-00009</li>
            <li>Lee, M., Raffa, J., Ghassemi, M., Pollard, T., Kalanidhi, S., Badawi, O., Matthys, K., & Celi, L. A. (2020). WiDS Datathon 2020: ICU Mortality Prediction (version 1.0.0) [Data set]. PhysioNet. https://doi.org/10.13026/vc0e-th79</li>
            <li>Mesinovic, M., Watkinson, P., & Zhu, T. (2025). Explainable machine learning for predicting ICU mortality in myocardial infarction patients using pseudo-dynamic data. Scientific Reports, 15(1), 27887. https://doi.org/10.1038/s41598-025-13299</li>
          </ol>
        </section>

        <div className="mt-8 flex gap-3">
          <Button href="/" as="link"><ArrowLeft size={16}/> Back to Home</Button>
        </div>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-slate-400">
          <span>© 2025 {PROFILE.name}. All rights reserved.</span>
          <a href="#home" className="hover:text-slate-200">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

function FactorAnalysisPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#312e81_20%,transparent),radial-gradient(800px_400px_at_90%_-20%,#0f766e_10%,transparent)] bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white">
          <ArrowLeft size={16}/> Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Psychosocial Factors and Mental Health among Midlife Women: ALSWH 1946–51 Cohort
        </h1>

        {/* ------------------------------ Introduction ------------------------------ */}
        <section className="mt-6 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Introduction</h2>
          <p>
            Midlife women often face multiple psychosocial challenges from day-to-day stresses to major life changes that can impact their mental health. Social support is thought to buffer the adverse effects of stress on well-being (Cohen & Wills, 1985), whereas exposure to trauma or abuse is linked to poorer mental health outcomes (Parker & Lee, 2002). The present study uses cross-sectional data from the Australian Longitudinal Study on Women’s Health (ALSWH) mid-age cohort to examine how psychosocial stressors, social support, and distressing life experiences relate to mental health. The ALSWH is a large population-based study of over 57,000 women across four birth cohorts (Lee et al., 2005). We focus on the 1946–51 cohort, who were aged 45–50 at baseline in 1996 (Lee et al., 2005). We aimed to identify underlying psychosocial factors (via factor analysis of survey items on stress, support, and distress) and to assess their associations with a standardized mental health score. Based on prior research, we hypothesized that greater stress and distress would be associated with worse mental health, whereas stronger social support would correlate with better mental health (Cohen & Wills, 1985).
          </p>
        </section>

        {/* ------------------------------ Methods ------------------------------ */}
        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Methods</h2>

          <h3 className="pt-2 font-semibold text-slate-100">Data and Participants</h3>
          <p>
            This cross-sectional analysis used Survey 1 (baseline) data from the ALSWH 1946–51 cohort. At baseline, 13,716 mid-aged women (45–50 years old) completed mailed questionnaires (53–56% of those invited). We analyzed psychosocial measures and mental health outcomes from this survey. All participants provided informed consent, and the study was approved by ethics committees at the Universities of Newcastle and Queensland (Lee et al., 2005).
          </p>

          <h3 className="pt-4 font-semibold text-slate-100">Measures</h3>
          <p>
            Psychosocial variables included nine survey items covering stress, social support, and distress experiences. These items were: “stress from being busy” (stressbusy), “stress from changes in life” (stresschange), number of close supporters (socialsupportnum), feeling understood by family/friends (understood), ability to share problems (shareproblems), and four indicators of personal distress or adversity – physical abuse (abusephysical), feeling sad/lonely (sadlonely), feeling unwanted (feelunwanted), and fear of someone in family (fearfamily). Each item was self-reported on ordinal scales (e.g. frequency or degree, with higher values indicating more of the trait). The mental health outcome was the SF-36 Mental Health Component Score (menthealthscore), a 0–100 scaled summary of mental well-being (Ware & Sherbourne, 1992), where higher scores indicate better mental health. The SF-36 is a validated health-related quality of life survey widely used in ALSWH (Mishra & Schofield, 1998).
          </p>

          <h3 className="pt-4 font-semibold text-slate-100">Data Preparation</h3>
          <p>
            All variables were inspected and recoded as needed. Binary responses (e.g. 1 = Yes, 2 = No) were recoded to 1/0. Ordinal and continuous variables were treated as numeric. Missing data were handled with k-nearest neighbor imputation (using 5 nearest neighbors) to preserve sample size for analysis. This method replaces missing values with values from the most similar respondents and has been used to reliably impute survey data in health research. After imputation, ordinal variables were rounded to the nearest valid category and binary variables were set to 0/1 based on a 0.5 threshold. The final analytic dataset included N = 13,633 women (after excluding a small number with incomplete outcomes or implausible values). All analyses were conducted using Python statistical libraries.
          </p>

          <h3 className="pt-4 font-semibold text-slate-100">Statistical Analysis</h3>
          <p>
            We used exploratory factor analysis to identify latent psychosocial factors underlying the nine survey items. A principal-factor extraction method with oblique rotation (oblimin) was applied to allow for correlations among the factors. The number of factors was determined by examining eigenvalues greater than one and evaluating the interpretability of the factor structure. Items with factor loadings of ≥ 0.30 (in absolute value) were considered meaningfully associated with a factor and used to define each psychosocial construct. Internal consistency of the grouped items was assessed using Cronbach’s alpha (Cronbach, 1951). Next, we calculated factor scores for each participant using regression-based scoring. Finally, we performed a multiple linear regression to assess the association between these factor scores and the SF-36 mental health score. The mental health score was treated as a continuous dependent variable, and the predictors were the factor scores for each psychosocial factor. The model included a constant term and was estimated using ordinary least squares (OLS). We report unstandardized coefficients (B), standard errors (SE), t-statistics, p-values, and the model R-squared, with statistical significance evaluated at p less than 0.05 (two-tailed).
          </p>

        </section>

        {/* ------------------------------ Results ------------------------------ */}
        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Results</h2>

          <h3 className="pt-2 font-semibold text-slate-100">Psychosocial Factors</h3>
          <p>
            The factor analysis yielded three factors, which we labeled Hassles/Stress, Support, and Distress. These three factors had eigenvalues > 1 and together explained a majority of the variance in the nine items. Table 1 presents the rotated factor loadings for each item. The Hassles/Stress factor had high loadings for feeling stressed by being busy (loading = 0.998) and by life changes (0.480). The Support factor was defined by strong positive loadings for social support network size (0.458), feeling understood (0.709), and ability to share problems (0.724). The Distress factor showed high loadings for physical abuse (0.536), feeling sad or lonely (0.444), feeling unwanted (0.350), and fearing a family member (0.483). Each item loaded most strongly on one primary factor, and cross-loadings were low (all secondary loadings less than 0.30 in absolute value).
          </p>

          <div className="overflow-x-auto rounded-xl border border-white/10 mt-4">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-300">Item (survey question)</th>
                  <th className="px-3 py-2 text-left text-slate-300">Hassles/Stress</th>
                  <th className="px-3 py-2 text-left text-slate-300">Support</th>
                  <th className="px-3 py-2 text-left text-slate-300">Distress</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">abusephysical – Physical abuse in past 12 months (yes/no)</td>
                  <td className="px-3 py-2 text-slate-200">0.003</td>
                  <td className="px-3 py-2 text-slate-200">0.103</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.536</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-slate-200">sadlonely – How often felt sad or lonely</td>
                  <td className="px-3 py-2 text-slate-200">0.017</td>
                  <td className="px-3 py-2 text-slate-200">-0.272</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.444</td>
                </tr>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">feelunwanted – How often felt not wanted</td>
                  <td className="px-3 py-2 text-slate-200">-0.007</td>
                  <td className="px-3 py-2 text-slate-200">-0.251</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.350</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-slate-200">fearfamily – Fear of someone in family (yes/no)</td>
                  <td className="px-3 py-2 text-slate-200">0.008</td>
                  <td className="px-3 py-2 text-slate-200">0.053</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.483</td>
                </tr>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">stressbusy – Stress about being too busy</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.998</td>
                  <td className="px-3 py-2 text-slate-200">0.004</td>
                  <td className="px-3 py-2 text-slate-200">0.003</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-slate-200">stresschange – Stress about changes in life</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.480</td>
                  <td className="px-3 py-2 text-slate-200">-0.034</td>
                  <td className="px-3 py-2 text-slate-200">-0.039</td>
                </tr>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">socialsupportnum – Number of close friends/relatives</td>
                  <td className="px-3 py-2 text-slate-200">0.021</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.458</td>
                  <td className="px-3 py-2 text-slate-200">0.002</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-slate-200">understood – Feel family/friends understand you</td>
                  <td className="px-3 py-2 text-slate-200">-0.022</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.709</td>
                  <td className="px-3 py-2 text-slate-200">-0.067</td>
                </tr>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">shareproblems – Can share problems with someone</td>
                  <td className="px-3 py-2 text-slate-200">0.004</td>
                  <td className="px-3 py-2 text-slate-200 font-medium">0.724</td>
                  <td className="px-3 py-2 text-slate-200">0.066</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            Using the ≥ 0.30 criterion, we grouped the items into scales corresponding to each factor: Hassles/Stress (2 items: stressbusy, stresschange), Support (3 items: socialsupportnum, understood, shareproblems), and Distress (4 items: abusephysical, sadlonely, feelunwanted, fearfamily). The internal consistency of these scales was modest. Cronbach’s alpha was 0.61 for Hassles/Stress, 0.65 for Support, and 0.54 for Distress. These alphas indicate acceptable but not high reliability, likely reflecting the brevity and heterogeneity of the item sets (e.g., the Distress items encompass different aspects of adversity). Notably, the Distress factor combines interpersonal trauma (abuse/fear) with emotional loneliness, suggesting a broader distress construct.
          </p>

          <h3 className="pt-4 font-semibold text-slate-100">Association with Mental Health</h3>
          <p>
            The three psychosocial factors were all significantly associated with mental health in the expected directions. Table 2 summarizes the OLS regression results predicting the mental health score from the factor scores. Overall model fit was R² = 0.293, indicating that about 29.3% of the variance in mental health scores was explained by these three psychosocial factors (F(3, 13629) = 1879, p = 0.001). All three predictors were statistically significant (p = 0.001). The Hassles/Stress factor was negatively associated with mental health (B = -2.02, SE = 0.09, t = -22.1), where higher stress corresponded to lower mental health scores. The Support factor was positively associated (B = 3.10, SE = 0.09, t = 33.7), indicating that stronger social support was linked to better mental health. The Distress factor showed a strong negative association (B = -7.38, SE = 0.09, t = -80.7), where greater distress was associated with substantially lower mental health scores.
          </p>

          <div className="overflow-x-auto rounded-xl border border-white/10 mt-4">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-300">Predictor (Factor)</th>
                  <th className="px-3 py-2 text-left text-slate-300">B (SE)</th>
                  <th className="px-3 py-2 text-left text-slate-300">t (df=13629)</th>
                  <th className="px-3 py-2 text-left text-slate-300">p</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">(Intercept)</td>
                  <td className="px-3 py-2 text-slate-200">48.90 (0.08)</td>
                  <td className="px-3 py-2 text-slate-200">640.05</td>
                  <td className="px-3 py-2 text-slate-200">&lt;0.001</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-slate-200">Hassles/Stress factor</td>
                  <td className="px-3 py-2 text-slate-200">–1.60 (0.08)</td>
                  <td className="px-3 py-2 text-slate-200">–20.47</td>
                  <td className="px-3 py-2 text-slate-200">&lt;0.001</td>
                </tr>
                <tr className="bg-white/[0.03]">
                  <td className="px-3 py-2 text-slate-200">Support factor</td>
                  <td className="px-3 py-2 text-slate-200">+3.01 (0.11)</td>
                  <td className="px-3 py-2 text-slate-200">27.53</td>
                  <td className="px-3 py-2 text-slate-200">&lt;0.001</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-slate-200">Distress factor</td>
                  <td className="px-3 py-2 text-slate-200">–4.30 (0.12)</td>
                  <td className="px-3 py-2 text-slate-200">–35.01</td>
                  <td className="px-3 py-2 text-slate-200">&lt;0.001</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Model: R² = 0.293, Adjusted R² = 0.293, F(3, 13629) = 1879, p = 0.001
          </p>
        </section>

        {/* ------------------------------ Discussion ------------------------------ */}
        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Discussion</h2>
          <p>
            In this cross-sectional study of midlife Australian women, we found that psychosocial stress, social support, and distressing life experiences are important correlates of mental health. The factor analysis distilled nine psychosocial indicators into three distinct dimensions. The Hassles/Stress factor captured routine stressors (feeling extremely busy and dealing with change), the Support factor reflected the availability and quality of social support, and the Distress factor encompassed negative life experiences and emotions (including abuse and loneliness). These factors showed adequate internal consistency and conceptual coherence. Notably, even though the Distress factor combined different aspects of adversity, it emerged as the strongest predictor of poorer mental health in our regression model.
          </p>
          <p>
            Our findings align with existing literature on stress, support, and mental well-being. Women with higher chronic stress levels had significantly lower mental health scores, consistent with stress and coping theory that chronic stress can erode psychological health (Lazarus & Folkman, 1984). Social support, on the other hand, was a robust positive predictor of mental health, echoing the well-established notion that support from friends and family improves mental well-being and buffers against stress (Cohen & Wills, 1985). In practical terms, a woman who feels understood and has confidants to share problems with is likely to report better mental health. This is in line with evidence that social ties and support are causally linked to better mental and physical health outcomes (Thoits, 2011).
          </p>
          <p>
            The Distress factor’s strong negative association with mental health underscores the toll of abuse and social isolation on midlife women’s well-being. Approximately 7% of women in this cohort reported recent physical abuse or fear of a family member at baseline (data not shown), and many more reported frequent feelings of loneliness or unwantedness. Prior ALSWH analyses have documented the lasting psychological impact of abuse: for instance, 39% of mid-aged women with any abuse history reported that the abuse had ongoing negative effects on their lives. Our results reinforce that such distressing experiences are linked to significantly lower mental health scores. This finding is consistent with Parker and Lee’s (2002) study of abused Australian women, which found that a history of abuse was associated with worse emotional well-being. Public health implication: addressing domestic violence and social isolation in this demographic may be crucial for improving women’s mental health. Interventions that help women feel safer and more connected – such as counseling, support groups, or social services – could mitigate some of the observed deficits in mental health among those with high Distress scores.
          </p>
          <p>
            It is noteworthy that the Support factor was associated with a +3 point increase in mental health per unit, partially offsetting the effects of stress and distress. This suggests that strong social support may serve as a protective resource. Women who can confide in others and feel supported might better cope with life’s hassles and emotional hardships. This reflects the “buffering hypothesis” where support protects individuals from the harmful psychological effects of stress (Cohen & Wills, 1985). In our multivariate model, support remained beneficial even while accounting for stress and distress levels, implying an independent positive effect on mental health. This finding highlights the potential value of bolstering social support networks for midlife women – for example, community programs, peer networks, or family interventions that enhance support could have positive mental health benefits.
          </p>
          <h3 className="pt-4 font-semibold text-slate-100">Strengths and Limitations</h3>
          <p>
            A strength of this study is the large, nationally representative sample of midlife women and the use of standardized measures (e.g. SF-36 mental health score). By using factor analysis, we reduced measurement noise in individual survey items and created more reliable psychosocial scales. This approach allowed us to simultaneously examine multiple psychosocial domains in relation to mental health. However, several limitations should be noted. First, the study is cross-sectional (survey 1 of a longitudinal study), so causal directions cannot be firmly established. It is plausible that poor mental health could also influence perceptions of stress or support (e.g. depressed mood might make hassles feel more overwhelming or make one feel less supported). Longitudinal follow-up is needed to untangle directionality. Second, some of the psychosocial scales had only moderate reliability (particularly the Distress factor with α = 0.54). This suggests the need for caution in interpreting that factor; it may represent a broad cluster of adversities rather than a single coherent construct. A more nuanced measurement (e.g. separate scales for trauma vs. loneliness) might yield even stronger associations. Third, we did not control for other variables such as socioeconomic status, physical health, or personality, which could confound or mediate the relationships. The R² of ~0.29 indicates that while psychosocial factors explain a substantial portion of variance in mental health, the majority (70%) is left unexplained – likely attributable to other factors (e.g. genetics, physical illnesses, life circumstances). Future analyses could include such covariates to see if the psychosocial effects hold net of other influences.
          </p>
          <h3 className="pt-4 font-semibold text-slate-100">Conclusions</h3>
          <p>
            Despite these limitations, the study clearly demonstrates that psychosocial factors are integral to midlife women’s mental health. High ongoing stress and exposure to abusive or lonely situations are associated with worse mental health, whereas strong social support is associated with better mental health. These findings underscore the importance of psychosocial well-being in midlife: women who are juggling many stressors or who lack safe and supportive relationships constitute a vulnerable group for mental health problems. Health practitioners and policymakers should consider interventions that reduce everyday stress (for example, workplace flexibility or caregiving support) and that enhance social support networks for women in midlife. Likewise, efforts to prevent and address domestic abuse could have mental health payoffs in this population. As the ALSWH cohort continues to be followed, future research can examine how changes in these psychosocial factors over time (such as entering retirement, widowhood, or community engagement) impact mental health trajectories in older age. Meanwhile, our cross-sectional findings add to the evidence that psychosocial stress and support are key targets for maintaining and improving mental well-being in midlife women.
          </p>
        </section>

        {/* ------------------------------ References ------------------------------ */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">References</h2>
          <ol className="mt-4 list-decimal pl-6 space-y-2 text-slate-300 text-sm">
            <li>Cohen, S., & Wills, T. A. (1985). Stress, social support, and the buffering hypothesis. <em>Psychological Bulletin, 98</em>(2), 310–357.</li>
            <li>Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. <em>Psychometrika, 16</em>(3), 297–334.</li>
            <li>Lee, C., Dobson, A. J., Brown, W. J., Bryson, L., Byles, J. E., Warner-Smith, P., & Young, A. F. (2005). Cohort profile: The Australian Longitudinal Study on Women’s Health. <em>International Journal of Epidemiology, 34</em>(5), 987–991.</li>
            <li>Parker, G., & Lee, C. (2002). Predictors of physical and emotional health in a sample of abused Australian women. <em>Journal of Interpersonal Violence, 17</em>(9), 987–1001.</li>
            <li>Ware, J. E., & Sherbourne, C. D. (1992). The MOS 36-Item Short Form Health Survey (SF-36): I. Conceptual framework and item selection. <em>Medical Care, 30</em>(6), 473–483.</li>
            <li>Mishra, G., & Schofield, M. J. (1998). Norms for the physical and mental health component summary scores of the SF-36 for young, middle-aged and older Australian women. <em>Quality of Life Research, 7</em>(3), 215–220.</li>
            <li>Thoits, P. A. (2011). Mechanisms linking social ties and support to physical and mental health. <em>Journal of Health and Social Behavior, 52</em>(2), 145–161.</li>
            <li>Lazarus, R. S., & Folkman, S. (1984). Stress, appraisal, and coping. New York: Springer.</li>
          </ol>
        </section>

        <div className="mt-8 flex gap-3">
          <Button href="/" as="link"><ArrowLeft size={16}/> Back to Home</Button>
          <Button href="/Factor%20Analysis.docx" variant="ghost"><FileText size={16}/> Download Report</Button>
        </div>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-slate-400">
          <span>© 2025 {PROFILE.name}. All rights reserved.</span>
          <a href="#home" className="hover:text-slate-200">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------ Breast Cancer Page ------------------------------ */
function BreastCancerPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,#312e81_20%,transparent),radial-gradient(800px_400px_at_90%_-20%,#0f766e_10%,transparent)] bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-3xl px-4 py-10">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white">
          <ArrowLeft size={16}/> Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Breast Cancer Recurrence Analysis (Multilevel Logistic Regression)
        </h1>

        <section className="mt-6 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Introduction</h2>
          <p>
            Breast cancer recurrence remains an important clinical challenge, with implications for survival, treatment planning, and long-term quality of life. Identifying patient- and tumor-level predictors of recurrence can help clinicians stratify risk and improve individualized treatment strategies. Epidemiologic evidence highlights age, tumor receptor status, and stage as established risk factors, while disparities by race and socioeconomic characteristics have also been observed. In this study, we used data from a large hospital-based cancer registry to investigate predictors of first recurrence in breast cancer patients. Given that patients were treated across multiple healthcare facilities, we applied multilevel statistical modeling to account for clustering at the facility level.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Methods</h2>
          <h3 className="text-lg font-semibold text-white">Data Source and Sample</h3>
          <p>
            Data were derived from a multi-site hospital cancer registry encompassing breast cancer cases diagnosed and treated between 2018 and 2023. After deduplication by unique medical record number (MRN), the analytic dataset consisted of 3,257 patients, of whom 2,715 did not experience recurrence and 542 experienced a first recurrence during follow-up.
          </p>
          <h3 className="text-lg font-semibold text-white">Outcome</h3>
          <p>
            The primary outcome was first recurrence, defined using the variable “Type.1st.Recurrence”. Patients were classified as No Recurrence (coded 0) if no recurrence was documented, or Recurrence (coded 1) if any type of recurrence was reported.
          </p>
          <h3 className="text-lg font-semibold text-white">Covariates</h3>
          <p>
            The primary predictors of interest included age category, race category, estrogen receptor (ER) status, and progesterone receptor (PR) status. Age at diagnosis was categorized into four groups to reflect both clinical relevance and the observed distribution of patients: 0–40 years, 40–60 years, 60–80 years, and ≥80 years, with the youngest group (0–40 years) serving as the reference category. Race was harmonized into three categories, with Black patients designated as the reference group; White patients were retained as a separate category, while patients who identified as Asian, Native American, Pacific Islander, or multiracial were collapsed into an “Other” category to address sparse data issues. ER and PR statuses were each coded as binary variables, with tumors classified as either positive or negative. To account for potential clustering of patients within healthcare facilities, a random intercept for facility was incorporated into the model to capture between-facility variation in recurrence risk.
          </p>
          <h3 className="text-lg font-semibold text-white">Data Management</h3>
          <p>
            Data preparation involved several steps. First, multiple records for the same patient were identified using the medical record number (MRN), and only the earliest record by diagnosis date was retained to ensure that each patient contributed a single observation. Finally, a complete-case approach was applied, whereby observations with missing values in the outcome or any of the key predictors were excluded from the analytic dataset.
          </p>
          <h3 className="text-lg font-semibold text-white">Statistical Analysis</h3>
          <p>
            Patient characteristics were first summarized according to recurrence status using descriptive statistics. Table 1 presents distributions of sociodemographic and clinical variables stratified by recurrence. Categorical variables, including race, ER status, PR status, HER2 status, cancer stage, insurance type, and facility of treatment, were compared using chi-squared tests while age employed two sample t-test. To preliminarily assess the strength of association between each predictor and recurrence, bivariate logistic regression models were fitted. Odds ratios (ORs) with 95% confidence intervals (CIs) were estimated for each variable individually. Subsequently, a generalized linear mixed-effects model (GLMM) with a logit link was applied to simultaneously evaluate the effects of age category, race category, ER status, and PR status on recurrence risk, while accounting for clustering of patients within facilities. A random intercept for facility was included to capture heterogeneity in baseline recurrence risk across treatment sites. Odds ratios with 95% CIs were reported for all fixed effects. Model performance was assessed by examining the Akaike Information Criterion (AIC), the intraclass correlation coefficient (ICC) derived from the variance of the facility-level random effect, and marginal and conditional R² to quantify explained variance. Discriminatory capacity was evaluated by calculating the area under the receiver operating characteristic curve (AUC) for both marginal predictions (fixed effects only) and conditional predictions (fixed plus random effects).
          </p>
        </section>

        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Patient Characteristics</h2>
          <p>
            The mean age was similar between patients without recurrence (62.7 years, SD 12.7) and those with recurrence (63.1 years, SD 15.9), and no significant difference was observed (p = 0.492). However, when age was analyzed categorically, patients ≤40 years represented a larger proportion of those with recurrence (9.8%) compared with those without recurrence (3.8%), while patients aged 60–80 years were more common in the non-recurrence group (53.8% vs. 41.1%). Significant proportional differences were also observed by race: White patients comprised most of the cohort, but a greater proportion of Black patients experienced recurrence (6.8%) compared to non-recurrence (3.1%). Patients with HER2-positive disease accounted for 19.1% of those with recurrence compared to 13.7% of those without, while ER negativity was nearly twice as common among patients with recurrence (23.6% vs. 12.4%). Stage at diagnosis demonstrated a striking gradient: nearly one quarter (24.5%) of patients with recurrence presented with stage IV disease, compared to just 0.4% of those without recurrence, whereas stage I disease dominated the non-recurrence group (80.6% vs. 41.1%). Patients insured by Medicaid/Medicare or classified under “Other” insurance were more frequently represented in the recurrence group, while those with private insurance were more common in the non-recurrence group. Facility-level differences were apparent, with some sites, such as St. Francis and Bergan, contributing disproportionately to the recurrence group.
          </p>
          <LoadSplitTable
            title="Table 1 (Recurrence vs No Recurrence)"
            csvUrl="/data/bc_table1.csv"
            note="Continuous variables are mean (SD); categorical variables are n (%). P-values from chi-squared tests for categorical variables and t-test for age."
          />
        </section>

        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Bivariate Logistic Regression</h2>
          <p>
            In bivariate logistic regression analyses, younger patients (≤40 years) had the highest risk of recurrence, with significantly lower odds observed in those aged 40–60 years (OR = 0.36, 95% CI: 0.25–0.52, p  less than 0.001) and 60–80 years (OR = 0.30, 95% CI: 0.21–0.43, p = 0.001), while patients aged ≥80 did not differ significantly from the youngest group (OR = 0.85, 95% CI: 0.57–1.29, p = 0.450). Tumor biology was strongly associated with recurrence: ER-positive (OR = 0.46, 95% CI: 0.37–0.58, p = 0.001) and PR-positive (OR = 0.53, 95% CI: 0.44–0.65, p = 0.001) tumors were less likely to recur, whereas HER2-positive tumors showed increased recurrence risk (OR = 1.48, 95% CI: 1.15–1.88, p = 0.002). Racial differences were evident, with White patients experiencing significantly lower odds of recurrence compared to Black patients (OR = 0.43, 95% CI: 0.29–0.65, p = 0.001), while the difference for patients categorized as Other was not statistically significant (OR = 0.62, 95% CI: 0.33–1.16, p = 0.138). Insurance status was also associated with recurrence, with privately insured patients having lower odds (OR = 0.79, 95% CI: 0.64–0.97, p = 0.027) and those categorized as “Other” insurance types having higher odds (OR = 1.70, 95% CI: 1.30–2.21, p= 0.001) relative to Medicaid.
          </p>
          <LoadSplitTable title="Bivariate ORs" csvUrl="/data/bc_bivariate.csv" />
        </section>

        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Mixed-Effects Logistic Regression</h2>
          <p>
            In the multivariable mixed-effects logistic regression model, patient age, tumor receptor status, and race were significantly associated with recurrence. Compared with patients ≤40 years, those aged 40–60 years (OR = 0.35, 95% CI: 0.23–0.51, p less than 0.001) and 60–80 years (OR = 0.31, 95% CI: 0.21–0.46, p = 0.001) had substantially lower odds of recurrence, while patients ≥80 years did not differ significantly (OR = 0.89, 95% CI: 0.57–1.38, p = 0.594). ER-positive tumors were associated with 38% lower recurrence odds (OR = 0.62, 95% CI: 0.45–0.86, p = 0.004), and PR positivity conferred a similar protective effect (OR = 0.72, 95% CI: 0.55–0.95, p = 0.020). White patients experienced significantly reduced recurrence risk relative to Black patients (OR = 0.43, 95% CI: 0.28–0.67, p = 0.001), whereas patients categorized as Other did not differ significantly (OR = 0.66, 95% CI: 0.34–1.29, p = 0.224). The model included a random intercept for facility to account for clustering of patients within treatment sites. The estimated facility-level variance was 0.194, corresponding to an intraclass correlation coefficient of 0.056, suggesting that approximately 6% of the variation in recurrence risk was attributable to between-facility differences after adjusting for patient characteristics. Model performance statistics indicated that fixed effects alone explained about 7.1% of the variance (marginal R²), while the combination of fixed and random effects explained 12.3% (conditional R²). The ROC curve demonstrates that the model has good discriminatory ability, with a marginal AUC of 0.77 (95% CI: 0.75–0.80) based on fixed effects alone and a conditional AUC of 0.83 (95% CI: 0.81–0.85) when facility-level random effects are included.
          </p>
          <LoadSplitTable title="Multivariable ORs" csvUrl="/data/bc_model.csv" />
          <figure className="mt-6">
            <img src={FIGS.bcRoc} alt="ROC curves (marginal and conditional)"
                 className="w-full rounded-xl border border-white/10" />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure.</span> ROC curves: AUROC 0.77 (marginal, 95% CI: 0.75–0.80) and 0.83 (conditional, 95% CI: 0.81–0.85).
            </figcaption>
          </figure>
        </section>

        <section className="mt-8 space-y-4 text-slate-200 leading-relaxed">
          <h2 className="text-xl font-semibold text-white">Discussion</h2>
          <p>
            In this study, younger patients, particularly those aged 40 years and below, were more likely to experience recurrence, while patients in the 40–60 and 60–80-year categories had substantially lower odds compared with the youngest group. ER- and PR-positive tumors were both associated with significantly reduced recurrence risk, highlighting the protective effect of hormone receptor positivity in this cohort. Although HER2 status showed an association with recurrence in unadjusted analyses, it did not remain significant in the multivariable model once other predictors were included. Racial differences were evident, with White patients having significantly lower recurrence risk compared to Black patients, while patients classified as Other did not differ significantly from the reference group. The random intercept for facility suggested that about 6% of the variation in recurrence risk was explained by differences across treatment sites, indicating modest clustering effects. Despite relatively small R² values, the model demonstrated good discrimination, with an AUC of 0.77 for fixed effects and 0.83 when accounting for facility-level variation, showing that the selected predictors meaningfully distinguished patients with and without recurrence.
          </p>
        </section>

        <div className="mt-8 flex gap-3">
          <Button href="/" as="link"><ArrowLeft size={16}/> Back to Home</Button>
          <Button href="/reports/breast-cancer-recurrence-analysis-report.docx" variant="ghost">
            <FileText size={16}/> Download Full Report
          </Button>
        </div>
      </main>
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-slate-400">
          <span>© 2025 {PROFILE.name}. All rights reserved.</span>
          <a href="#home" className="hover:text-slate-200">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
/* ------------------------------ CXR Deep Learning Replication Page ------------------------------ */
function CXRPage() {
  const navigate = useNavigate();

  // Image asset paths (mapped from document's image1.png and image2.png)
  const ROC_IMG = '/images/cxr/roc_combined_overlay_ci.png'; // Corresponds to image1.png
  const PR_IMG = '/images/cxr/pr_combined_overlay_ci.png'; // Corresponds to image2.png

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <main className="mx-auto max-w-4xl px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-slate-300 hover:text-white"
          aria-label="Back"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Detecting Left Ventricular Structural Abnormalities in Chest X-Rays using Deep Learning: A Replication Study
        </h1>
        <p className="mt-2 text-slate-400 italic">
          Replicating Bhave et al., European Heart Journal (2024).
        </p>

        {/* ------------------------------ Introduction ------------------------------ */}
        <section className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">Introduction</h2>
          <p className="leading-7 text-slate-200">
            Heart failure often develops silently, with early structural changes that precede overt symptoms. Early recognition of left ventricular (LV) structural disease is clinically valuable because initial symptoms can be mild and nonspecific. <span className="italic">Bhave et al.</span> (2024) proposed a deep learning approach to screen standard chest radiographs (CXRs) for two echocardiographic phenotypes of structural heart disease: severe LV hypertrophy (SLVH) and dilated LV (DLV), as well as a composite outcome indicating either condition. In their study, CXRs were paired with echocardiograms within a 12-month window, and a convolutional neural network (DenseNet-121 backbone) was trained to jointly leverage image features and patient demographics (age, sex) to predict continuous LV measurements and subsequent binary outcomes. The model achieved high discriminative performance on the internal test set (area under the ROC curve [AUROC] ~0.79–0.80 for SLVH, DLV, and the composite outcome) and maintained similar performance on an external dataset, outperforming radiologists in detecting the composite outcome. As a resource for the community, the authors publicly released the CXR-echo dataset (71,589 CXRs from 24,689 patients) to enable replication and further innovation.
          </p>
          <p className="leading-7 text-slate-200">
            Our objective in this replication study was to reproduce the model of Bhave et al. using the publicly available dataset and to compare the results of our independent implementation with the originally reported discrimination and calibration. We aimed to confirm whether similar performance could be achieved under the same data definitions and to identify any implementation differences that might affect model outcomes.
          </p>
        </section>

        {/* ------------------------------ Methods ------------------------------ */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-white">Methods</h2>

          <h3 className="text-xl font-semibold text-white mt-4">Data and Preprocessing</h3>
          <p className="leading-7 text-slate-200">
            We used the publicly released Columbia University Irving Medical Center (CUIMC) CXR-echo dataset, as described by Bhave et al. (2024), comprising 71,589 frontal chest X-ray images from 24,689 patients. Each CXR had at least one transthoracic echocardiogram within ±12 months, which provided ground truth measurements of LV structure. From the echocardiography reports, we extracted three continuous measurements: interventricular septal thickness in diastole (IVSd), LV posterior wall thickness in diastole (LVPWd), and LV internal diameter in diastole (LVIDd). These measurements were binarized into diagnostic labels for SLVH and DLV using the same sex-specific threshold criteria as the original study. SLVH was labeled for men if IVSd &gt; 1.5 cm or LVPWd &gt; 1.5 cm (for women, &gt; 1.4 cm), and DLV was labeled for men if LVIDd &gt; 5.9 cm (for women, &gt; 5.3 cm). A composite label was assigned if either SLVH or DLV criteria were met. These threshold definitions correspond to guideline criteria for severe LV hypertrophy and dilation and mirror those used by Bhave et al.
          </p>
          <p className="leading-7 text-slate-200">
            To prevent information leakage between training and testing, we performed a patient-level split of the data, ensuring all CXRs from a given patient were confined to a single set. We randomly split the patients into training (90%), validation (5%), and test (5%) subsets, yielding an internal test set of approximately 3,571 CXRs from 1,235 patients (Table 1). Demographic characteristics and label prevalences were compared across the splits to ensure no significant differences. Prior to model training, each CXR was preprocessed following the procedure described by Bhave et al.: images were converted to grayscale if not already, center-cropped to a square region capturing the thorax, and resized to 224×224 pixels using bicubic interpolation. We then applied contrast-limited adaptive histogram equalization (CLAHE) for contrast enhancement, matching the original study’s preprocessing. Pixel intensity values were normalized to the standard range used by the DenseNet-121 ImageNet model. During training, mild data augmentation (random flips and shifts) was employed to improve generalizability, consistent with the augmentation strategy noted in the original implementation.
          </p>

          <h3 className="text-xl font-semibold text-white mt-4">Model Architecture and Training</h3>
          <p className="leading-7 text-slate-200">
            We recreated the deep learning model as described by Bhave et al. (2024), with a few modifications in framework but not in overall design. The original model was implemented in PyTorch; our replication used an equivalent architecture in Keras/TensorFlow. Specifically, we used a DenseNet-121 convolutional neural network (pretrained on ImageNet) as the CXR feature extractor, taking the 224×224 preprocessed image as input. The DenseNet backbone’s output (global average pooled feature map) was concatenated with two demographic inputs: patient age (normalized) and sex (encoded as a one-hot vector for female/male). The combined feature vector was fed into multitask regression heads to predict the three continuous echocardiographic measures (IVSd, LVPWd, LVIDd) simultaneously. This multitask design mirrors the original approach, which used the intermediate regression outputs to inform the final classification. Each regression head produced both a mean and variance (uncertainty) estimate for its target, and we optimized a Gaussian negative log-likelihood loss for each continuous output. The model was trained end-to-end to minimize the joint loss of all three regression tasks.
          </p>
          <p className="leading-7 text-slate-200">
            For training, we adopted a two-phase strategy like Bhave et al.’s description: an initial “warm-up” phase and a subsequent fine-tuning phase. In the warm-up, we froze the DenseNet-121 backbone weights and trained only the new regression head and demographic fusion layers for 10 epochs, allowing the added layers to learn without disturbing the pretrained imaging features. Then we fine-tuned the model for an additional 40 epochs, unfreezing the last few DenseNet blocks (matching the original paper’s approach) and training with a lower learning rate (1×10^–5) to refine the image feature extractor on this specific task. We used the Adam optimizer with a batch size of 32 images. During fine-tuning, the same augmentation (random horizontal flips and small rotations/translations) was applied as in the warm-up. Model performance on the validation set was monitored, and the epoch with the best validation loss was used for final evaluation to avoid overfitting.
          </p>
          <p className="leading-7 text-slate-200">
            After training the model to predict the continuous LV measures, we derived the probabilities for each binary outcome. Rather than simply thresholding the predicted values (as conceptualized in the original study), we implemented a calibration step to optimize classification performance. Using the held-out validation set, we trained a simple logistic regression model to map the three continuous outputs (IVSd, LVPWd, LVIDd predictions) to each binary label. This served as a learned combiner that weighted the contributions of each echo measurement to the final probability of SLVH, DLV, or the composite. We then applied isotonic regression on the validation outputs to calibrate the probabilities to the observed label frequencies, resulting in a calibrated model that outputs well-conditioned probabilities for each outcome given an input CXR. Finally, we evaluated the calibrated model on the independent test set.
          </p>

          <h3 className="text-xl font-semibold text-white mt-4">Evaluation</h3>
          <p className="leading-7 text-slate-200">
            We assessed model discrimination using receiver operating characteristic (ROC) curves and precision–recall (PR) curves for each of the three outcomes (SLVH, DLV, composite). The primary metrics were the area under the ROC curve (AUROC) and the average precision (AP, i.e., area under the PR curve). To quantify uncertainty in these performance metrics, we computed 95% confidence intervals (CIs) via bootstrap resampling, performing 1,000 bootstrap replicates of the test-set predictions and calculating AUROC and AP for each replicate. The 2.5th and 97.5th percentiles of these bootstrap distributions were taken as the 95% CI bounds. Model calibration was examined by computing the Brier score for each outcome (mean squared error between predicted probability and the true label, lower values indicating better calibration) and by inspecting reliability curves (not shown). All results from our replication were compared with the originally published results for the internal test set of the CUIMC dataset (Bhave et al., 2024).
          </p>
        </section>

        {/* ------------------------------ Results ------------------------------ */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-white">Results</h2>

          <h3 className="text-xl font-semibold text-white mt-4">Cohort Characteristics</h3>
          <p className="leading-7 text-slate-200">
            A total of 71,589 CXRs from 24,689 patients were included after applying the inclusion criteria (CXRs with an echocardiogram within one year). The training set contained 90% of the patients (≈22,220 patients, 64,467 images), while the validation and test sets each contained 5% of patients (~1,234–1,235 patients, 3,551–3,571 images). The mean age of patients was approximately 62 years in each subset, with a standard deviation of about 16 years. The age distribution was similar across training, validation, and test splits (about 38% of patients were under 59 years, 27% in their 60s, 21% in their 70s, and ~13–14% aged 80 or above in each subset). Each subset had roughly half of patients being female (overall 52.1% female). The prevalence of the target conditions was low in all splits, reflecting the class imbalance inherent in this clinical scenario. In the test set, 8.8% of CXRs had evidence of SLVH and 10.0% had DLV, with 16.3% positive for either condition (composite outcome). These prevalences were closely matched between the training and test sets (composite prevalence ~17% in both).
          </p>
          <p className="leading-7 text-slate-200">
            <strong>Interpretation of Table 1:</strong> The training, validation, and test sets are well-matched in terms of patient demographics and outcome prevalence. The overall cohort is middle-aged to elderly (mean age ~62 years) with a slight majority of patients being female. The distribution across age brackets is uniform between the splits, and the proportion of females is ~52% in both training and test sets. The average echocardiographic measurements (IVSd, LVPWd, LVIDd) are identical across subsets (mean septal and posterior wall thickness ~1.1 cm, mean LV end-diastolic diameter ~4.6 cm), indicating no appreciable differences in baseline cardiac structure between the groups. Approximately 10% of patients meet criteria for severe LV hypertrophy or dilation individually, and 17% have either abnormality. The composite outcome is more common than each individual condition, as expected, but still present in only roughly one in six patients. The similarity of these statistics across training and test sets suggests that the random splitting did not introduce any significant sampling bias, allowing a fair evaluation of model generalizability on the internal test data.
          </p>

          {/* Table 1 */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="text-lg font-semibold text-white">Table 1. Patient Characteristics and Label Prevalence in the CUIMC CXR-Echo Dataset</h4>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-300">
                  <tr>
                    <th className="py-2 pr-4">Section</th>
                    <th className="py-2 pr-4">Metric</th>
                    <th className="py-2 pr-4">Train</th>
                    <th className="py-2 pr-4">Val</th>
                    <th className="py-2 pr-4">Test</th>
                    <th className="py-2 pr-4">Overall</th>
                  </tr>
                </thead>
                <tbody className="text-slate-100">
                  {[
                    ['Patient characteristics', 'CXRs, n', '64,467', '3,551', '3,571', '71,589'],
                    ['Patient characteristics', 'Patients, n', '22,220', '1,234', '1,235', '24,689'],
                    ['Patient characteristics', 'Age, years (mean ± SD)', '62.2 ± 16.1', '61.7 ± 16.3', '62.0 ± 15.9', '62.1 ± 16.1'],
                    ['Age groups, years', '<59', '24,525 (38.0%)', '1,393 (39.2%)', '1,458 (40.8%)', '27,376 (38.2%)'],
                    ['Age groups, years', '60–69', '17,535 (27.2%)', '926 (26.1%)', '898 (25.1%)', '19,359 (27.0%)'],
                    ['Age groups, years', '70–79', '13,551 (21.0%)', '774 (21.8%)', '717 (20.1%)', '15,042 (21.0%)'],
                    ['Age groups, years', '80+', '8,856 (13.7%)', '458 (12.9%)', '498 (13.9%)', '9,812 (13.7%)'],
                    ['', 'Female sex', '33,486 (51.9%)', '1,845 (52.0%)', '1,958 (54.8%)', '37,289 (52.1%)'],
                    ['Echo measures', 'IVSd (cm, mean ± SD)', '1.1 ± 0.3', '1.1 ± 0.2', '1.1 ± 0.2', '1.1 ± 0.3'],
                    ['Echo measures', 'LVPWd (cm, mean ± SD)', '1.1 ± 0.2', '1.1 ± 0.2', '1.1 ± 0.2', '1.1 ± 0.2'],
                    ['Echo measures', 'LVIDd (cm, mean ± SD)', '4.6 ± 0.7', '4.6 ± 0.6', '4.6 ± 0.7', '4.6 ± 0.7'],
                    ['Outcome prevalence', 'SLVH', '6,467 (10.0%)', '317 (8.9%)', '313 (8.8%)', '7,097 (9.9%)'],
                    ['Outcome prevalence', 'DLV', '6,250 (9.7%)', '336 (9.5%)', '357 (10.0%)', '6,943 (9.7%)'],
                    ['Outcome prevalence', 'Composite (SLVH or DLV)', '11,167 (17.3%)', '574 (16.2%)', '581 (16.3%)', '12,322 (17.2%)'],
                  ].map((row, idx) => (
                    <tr key={idx} className="border-t border-white/10">
                      {row.map((cell, i) => (
                        <td key={i} className="py-2 pr-4 align-top">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white mt-6">Discrimination Performance</h3>
          <p className="leading-7 text-slate-200">
            On the held-out CUIMC test set, our replicated model demonstrated good discrimination for all three outcomes, though performance was slightly below that reported in the original study. Figure 1 shows the receiver operating characteristic (ROC) curves for the deep learning model’s performance in detecting LV structural abnormalities, with bootstrap-derived 95% confidence intervals. Each curve represents one outcome: the composite outcome (either SLVH or DLV, blue), DLV alone (orange), and SLVH alone (green). The diagonal gray line is the line of no-discrimination (AUROC = 0.50). The model achieves an AUROC of 0.75 for the composite outcome (95% CI: 0.728–0.772), 0.77 for DLV (95% CI: 0.736–0.797), and 0.73 for SLVH (95% CI: 0.703–0.759). All three curves lie well above the diagonal, indicating that the model can discriminate patients with structural abnormalities from those without. Notably, the DLV curve is slightly higher than the SLVH curve, suggesting the model was more effective at detecting LV dilation than LV hypertrophy. The composite outcome, which combines both, shows intermediate performance. The overlap of confidence intervals implies these differences are modest, and overall, the model demonstrates moderate discriminative power for all outcomes.
          </p>
          <figure className="mt-8">
            <img src={ROC_IMG} alt="ROC curves with 95% confidence bands for composite, DLV, and SLVH" className="w-full rounded-xl border border-white/10" />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure 1.</span> Receiver operating characteristic curves for SLVH, DLV, and the composite outcome on the CUIMC test set, with 95% bootstrap confidence intervals. AUROC: composite 0.750 (0.728–0.772), DLV 0.766 (0.736–0.797), SLVH 0.729 (0.703–0.759).
            </figcaption>
          </figure>
          <p className="leading-7 text-slate-200 mt-3">
            Following the ROC analysis, Figure 2 presents the precision–recall (PR) curves for the same three outcomes, which more directly highlight performance on the positive class. The PR curves are especially informative given the class imbalance (relatively low prevalence of SLVH/DLV). The model’s precision–recall curve for the composite outcome (blue) yields an average precision of about 0.31 (95% CI: 0.276–0.350), which is substantially higher than the baseline positive rate of ~0.16 for the composite condition. This indicates that the model concentrates a significant fraction of true positives towards the top of its risk predictions. The PR curves for DLV (orange) and SLVH (green) have lower average precision (~0.19 each, 95% CI: 0.160–0.216 for DLV, 0.163–0.219 for SLVH), reflecting the lower prevalence (~9–10%) of each condition and the challenge of identifying these cases. Nonetheless, both curves stay above their respective baseline precision levels, confirming that the model’s predictions carry useful signal. The initial steep portion of each PR curve suggests that at high recall levels (approaching all positives found), precision declines but still remains above random, which is expected in a medical screening context. In summary, the PR analysis shows that the model can identify a subset of patients with structural heart disease with reasonable precision, though many false positives occur once recall is pushed higher (a typical trade-off in imbalanced classification scenarios).
          </p>
          <figure className="mt-8">
            <img src={PR_IMG} alt="Precision–Recall curves with 95% confidence bands for composite, DLV, and SLVH" className="w-full rounded-xl border border-white/10" />
            <figcaption className="mt-2 text-sm text-slate-300">
              <span className="font-semibold">Figure 2.</span> Precision–recall curves for SLVH, DLV, and composite on the test set, with 95% CIs. AP: composite 0.311 (0.276–0.350), DLV 0.187 (0.160–0.216), SLVH 0.190 (0.163–0.219). Dashed baselines indicate label prevalence.
            </figcaption>
          </figure>

          <h3 className="text-xl font-semibold text-white mt-6">Comparison to Original Study</h3>
          <p className="leading-7 text-slate-200">
            Our replication results can be directly compared to the internal test performance reported by Bhave et al. (2024) on the same CUIMC dataset. The original model had slightly higher discrimination: they reported AUROC values of 0.80 for DLV, 0.79 for SLVH, and 0.80 for the composite outcome (with overlapping CIs in the range ~0.77–0.84), versus our reproduced AUROCs of 0.766, 0.729, and 0.750, respectively. The absolute differences in AUC are on the order of 0.03–0.05 (3–5 percentage points). In terms of precision–recall, the original study’s composite outcome had an AP of approximately 0.53 on the internal test (benefiting from a somewhat higher prevalence in their test distribution or thresholding on echo measurements), compared to our composite AP of 0.31. Overall, our model’s rank-ordering of cases by risk is similar but slightly less sharp than in the original model.
          </p>
          <p className="leading-7 text-slate-200">
            The original study also validated their model on an external dataset of 8,003 CXRs from a different hospital and found broadly similar performance (AUROCs ~0.67–0.78) albeit with some drop for the SLVH label. They further showed that their model could outperform 15 board-certified radiologists in detecting the composite outcome at a fixed specificity of 73% (sensitivity 71% for the model vs. 66% for the radiologist consensus). These aspects underscore the clinical relevance of the approach. Our replication focused only on the internal dataset and did not include an external validation or reader study. We therefore report exclusively on the reproducibility of the internal discrimination results.
          </p>
        </section>

        {/* ------------------------------ Discussion ------------------------------ */}
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold text-white">Discussion</h2>
          <p className="leading-7 text-slate-200">
            We successfully replicated the core design and methodology of Bhave et al. (2024) for CXR-based detection of LV structural abnormalities, and we demonstrated that an independent implementation could achieve moderately strong discrimination on the same large clinical dataset. The patient-level data split, sex-specific diagnostic thresholds, and DenseNet-121 image backbone with age/sex feature fusion were all implemented as described in the original paper. The resulting model’s performance (AUROC ~0.73–0.77 across tasks) confirms the feasibility of screening CXRs for echocardiographic evidence of severe hypertrophy or dilation. However, our reproduced results were modestly lower than those originally reported (AUROCs ~0.79–0.80 in Bhave et al., 2024). Several plausible factors could explain this performance gap, including dataset split and prevalence, training regimen, and augmentation intensity.
          </p>
          <p className="leading-7 text-slate-200">
            Despite these differences, it is heartening that our replication achieved broadly similar results, reinforcing the soundness of the original study’s conclusions. The model’s ability to detect SLVH and DLV from CXRs, even with slightly reduced accuracy, is remarkable, considering that radiologists do not routinely diagnose these conditions from a chest X-ray alone. The replication process highlights the importance of implementation details: replicating medical AI studies often requires careful attention to seemingly minor factors like preprocessing and calibration, which can meaningfully affect outcomes. Potential reasons for the performance gap include: (1) image preprocessing nuances (e.g., crop, CLAHE settings, normalization), (2) label prevalence and split composition, (3) probability-head/calibration differences (logistic+isotonic vs. the original’s conversion), and (4) training schedule/augmentation intensity. Aligning preprocessing and probability derivation should narrow the gap.
          </p>
          <p className="leading-7 text-slate-200">
            In conclusion, this replication study confirms that deep learning analysis of CXRs can detect certain LV structural abnormalities (hypertrophy and dilation) with a performance approaching that of the original reported model. Small deviations in implementation can lead to modest performance differences. Nonetheless, our independent reproduction supports the original findings that chest X-rays contain latent information about cardiac structure that a neural network can exploit. With continued refinement and external validation, such models could become useful tools for early identification of patients with occult cardiomyopathy, enabling earlier intervention and improved outcomes.
          </p>
        </section>

        {/* ------------------------------ References ------------------------------ */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-white">References</h2>
          <ol className="list-decimal pl-5 mt-3 space-y-2 text-slate-300">
            <li>
              Bhave, S., Rodriguez, V., Poterucha, T., Mutasa, S., Aberle, D., Capaccione, K. M., Chen, Y., Dsouza, B., Dumeer, S., Goldstein, J., Hodes, A., Leb, J.,
              Lungren, M., Miller, M., Monoky, D., Navot, B., Wattamwar, K., Wattamwar, A., Clerkin, K., ... Elias, P. (2024). <span className="italic">Deep learning to detect left ventricular structural abnormalities in chest X-rays.</span> European Heart Journal, 45(22), 2002–2012. https://doi.org/10.1093/eurheartj/ehad782
            </li>
          </ol>
        </section>

        <div className="mt-8 flex gap-3">
          <a
            href={ROC_IMG}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-semibold"
            download
          >
            <FileText size={16} /> Download Figure 1 (ROC)
          </a>
          <a
            href={PR_IMG}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-semibold"
            download
          >
            <FileText size={16} /> Download Figure 2 (PR)
          </a>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------ App (routes) ------------------------------ */
export default function App() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomeContent />} />
        <Route path="/icu" element={<ICUPage />} />
        <Route path="/factor-analysis" element={<FactorAnalysisPage />} />
        <Route path="/breast-cancer" element={<BreastCancerPage />} />
        <Route path="/cxr" element={<CXRPage />} />
        <Route
          path="*"
          element={
            <main className="mx-auto max-w-3xl px-4 py-10">
              <h1 className="text-2xl font-bold text-white">404 — Not found</h1>
              <p className="mt-2 text-slate-300">
                That route doesn’t exist. Go{" "}
                <Link to="/" className="text-indigo-300 underline">home</Link>.
              </p>
            </main>
          }
        />
      </Routes>
    </div>
  );
}