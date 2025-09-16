import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownMessage({ text, className = "" }) {
  const safe = typeof text === "string" ? text : String(text ?? "");

  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          strong: ({ node, ...props }) => <strong {...props} />,
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          code: ({ inline, ...props }) =>
            inline ? (
              <code className="px-1 py-0.5 rounded" {...props} />
            ) : (
              <code {...props} />
            ),
        }}
      >
        {safe}
      </ReactMarkdown>
    </div>
  );
}
