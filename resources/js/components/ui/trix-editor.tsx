import { useEffect, useRef } from 'react';
import 'trix';
import 'trix/dist/trix.css';

interface TrixEditorProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

export function TrixEditor({ value = '', onChange, placeholder = '', id = 'trix-editor' }: TrixEditorProps) {
    const trixInputRef = useRef<HTMLInputElement>(null);
    const trixEditorRef = useRef<any>(null);

    useEffect(() => {
        const handleTrixChange = (event: any) => {
            if (onChange) {
                onChange(event.target.innerHTML);
            }
        };

        const editorElement = trixEditorRef.current;
        if (editorElement) {
            editorElement.addEventListener('trix-change', handleTrixChange);
        }

        return () => {
            if (editorElement) {
                editorElement.removeEventListener('trix-change', handleTrixChange);
            }
        };
    }, [onChange]);

    // Handle initial value update (avoiding infinite loops)
    useEffect(() => {
        if (trixEditorRef.current && trixEditorRef.current.editor) {
            const currentHTML = trixEditorRef.current.editor.getDocument().toString();
            // This is a simplified check. For full React-Trix integration, 
            // you might need more robust HTML comparisons.
            if (value && currentHTML.trim() !== value.trim().replace(/<[^>]*>?/gm, '').trim()) {
                trixEditorRef.current.editor.loadHTML(value);
            }
        }
    }, [value]);

    return (
        <div className="trix-wrapper">
            <input id={id} type="hidden" name="content" ref={trixInputRef} defaultValue={value} />
            <trix-editor 
                input={id} 
                ref={trixEditorRef} 
                placeholder={placeholder}
                class="trix-content"
            />
        </div>
    );
}

// Add TypeScript support for the custom trix-editor element
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'trix-editor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                input?: string;
                placeholder?: string;
                class?: string;
            };
        }
    }
}
