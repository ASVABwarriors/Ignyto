"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-50 animate-pulse rounded-xl border border-gray-200"></div>
});

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  // Modules configuration for rich text features
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }]
    ]
  }), []);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Write your content here..."}
      />
      {/* Custom CSS to fix quill height inside the container */}
      <style jsx global>{`
        .ql-container.ql-snow {
          border: none !important;
          font-family: inherit !important;
          font-size: 1rem !important;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        .ql-editor {
          min-height: 250px;
        }
      `}</style>
    </div>
  );
}
