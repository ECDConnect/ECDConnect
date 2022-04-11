import { useEffect, useRef, useState } from 'react';
import ContentLoader from '../content-loader/content-loader';

export default function Editor({ label, onStateChange, currentValue }) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef({ CKEditor: undefined, ClassicEditor: undefined });
  const { CKEditor, ClassicEditor } = editorRef.current;

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  const handleChange = (event, editor) => {
    const content = editor.getData();
    onStateChange(content);
  };

  return (
    <>
      {editorLoaded ? (
        <div className="relative">
          <div className="mb-2 text-sm font-medium capitalize text-slate-700">
            {label}
          </div>
          <CKEditor
            editor={ClassicEditor}
            data={currentValue || ''}
            disabled={false}
            onChange={handleChange}
            onReady={(editor) => {
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  'min-height',
                  '150px',
                  editor.editing.view.document.getRoot()
                );
              });
            }}
          />
        </div>
      ) : (
        <ContentLoader />
      )}
    </>
  );
}
