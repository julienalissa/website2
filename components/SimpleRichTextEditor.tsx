"use client";

import { useState, useRef, useEffect } from "react";

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SimpleRichTextEditor({
  value,
  onChange,
  placeholder = "Écrivez votre description...",
  className = ""
}: SimpleRichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const ToolbarButton = ({ 
    onClick, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 hover:bg-gray-100 rounded transition-colors"
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );

  return (
    <div className={`border rounded-lg ${isFocused ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300'} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
        <ToolbarButton onClick={() => execCommand('bold')} title="Gras">
          <strong className="text-sm">B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italique">
          <em className="text-sm">I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} title="Souligné">
          <u className="text-sm">S</u>
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => execCommand('formatBlock', '<p>')} title="Paragraphe">
          <span className="text-xs">P</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Liste à puces">
          <span className="text-xs">•</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Liste numérotée">
          <span className="text-xs">1.</span>
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Aligner à gauche">
          <span className="text-xs">◀</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Centrer">
          <span className="text-xs">⬌</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyRight')} title="Aligner à droite">
          <span className="text-xs">▶</span>
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[120px] p-4 focus:outline-none"
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
