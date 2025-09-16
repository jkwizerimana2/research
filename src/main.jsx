import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

console.log("[main.jsx] loaded");

function ErrorBox({ error }) {
  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 16, color: "#fca5a5", background: "#111827", border: "1px solid #4b5563", borderRadius: 12 }}>
      <strong>Render error:</strong>{"\n"}{error?.stack || String(error)}
    </pre>
  );
}

function Boot() {
  const [err, setErr] = React.useState(null);
  const [RealApp, setRealApp] = React.useState(null);

  React.useEffect(() => {
    console.log("[main.jsx] attempting dynamic import of ./app.jsx …");
    import("./app.jsx")
      .then((mod) => {
        const Comp = mod.default || mod.App;
        if (!Comp) throw new Error("app.jsx has no default export");
        console.log("[main.jsx] app.jsx imported successfully");
        setRealApp(() => Comp);
      })
      .catch((e) => {
        console.error("[main.jsx] import error:", e);
        setErr(e);
      });
  }, []);

  if (err) return <ErrorBox error={err} />;

  if (!RealApp) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>React mounted ✅</div>
        <div style={{ opacity: 0.8 }}>Loading <code>app.jsx</code>…</div>
      </div>
    );
  }

  try {
    return <RealApp />;
  } catch (e) {
    console.error("[main.jsx] render error:", e);
    return <ErrorBox error={e} />;
  }
}

const el = document.getElementById("root");
if (!el) {
  document.body.innerHTML = "<pre style='color:#fca5a5;background:#111827;padding:16px'>Missing #root in index.html</pre>";
  throw new Error("Missing #root in index.html");
}
createRoot(el).render(
  <React.StrictMode>
    <BrowserRouter>
      <Boot />
    </BrowserRouter>
  </React.StrictMode>
);
