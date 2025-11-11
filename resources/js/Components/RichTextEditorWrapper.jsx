// src/components/RichTextEditorWrapper.jsx
import React from "react";
import RichTextEditor from "rich-text-editor";

/**
 * Small wrapper around the package's React component.
 * Props:
 *  - value: string (HTML)
 *  - onChange: function(html) => void
 *  - language: 'EN'|'FI'|... (defaults to 'EN' here)
 *  - allowedFileTypes: array (optional)
 *  - className: extra wrapper classes
 */
export default function RichTextEditorWrapper({
  value = "",
  onChange = () => {},
  language = "EN",
  allowedFileTypes = ["image/png", "image/jpeg"],
  className = "",
  textAreaClassName = "min-h-[200px] p-3 rounded bg-white dark:bg-[#0a0e37] dark:text-white"
}) {
  return (
    <div className={className}>
      <RichTextEditor
        // best-effort binding: the package supports value/on-like callbacks (see below)
        value={value}
        // the packaged initializer uses the callback name onValueChange — this forwards to onChange
        onValueChange={(v) => onChange(v)}
        language={language}
        baseUrl={""}
        allowedFileTypes={allowedFileTypes}
        textAreaProps={{ className: textAreaClassName }}
      />
    </div>
  );
}
