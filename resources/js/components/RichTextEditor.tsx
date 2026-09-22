import React, { useEffect, useRef } from 'react';
import 'trix/dist/trix.css';
// @ts-ignore
import Trix from 'trix';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, id = 'trix-editor', placeholder = '' }: RichTextEditorProps) {
    const editorRef = useRef<any>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const editorElement = editorRef.current;
        if (!editorElement) return;

        const handleInitialize = (e: any) => {
            // Set initial value only once
            if (value && e.target.editor.getDocument().toString().length === 1) {
                e.target.editor.insertHTML(value);
            }
        };

        const handleChange = (e: any) => {
            onChange(inputRef.current?.value || '');
        };

        editorElement.addEventListener('trix-initialize', handleInitialize);
        editorElement.addEventListener('trix-change', handleChange);

        // Prevent file uploads by default for now (unless implemented)
        editorElement.addEventListener('trix-file-accept', (e: any) => {
            e.preventDefault();
            alert('File attachments are currently disabled.');
        });

        return () => {
            editorElement.removeEventListener('trix-initialize', handleInitialize);
            editorElement.removeEventListener('trix-change', handleChange);
        };
    }, []);

    // Sync external value changes
    useEffect(() => {
        if (editorRef.current?.editor && inputRef.current?.value !== value) {
            const currentLength = editorRef.current.editor.getDocument().toString().length;
            editorRef.current.editor.setSelectedRange([0, currentLength - 1]);
            editorRef.current.editor.deleteInDirection("forward");
            editorRef.current.editor.insertHTML(value);
        }
    }, [value]);

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <input id={id} type="hidden" name="content" ref={inputRef} value={value} />
            <trix-editor
                ref={editorRef}
                input={id}
                placeholder={placeholder}
                className="min-h-[250px] rounded-md border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
            ></trix-editor>
        </div>
    );
}
