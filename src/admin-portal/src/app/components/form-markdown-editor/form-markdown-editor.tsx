import { useEffect, useRef, useState } from 'react';
import ContentLoader from '../content-loader/content-loader';
import { CKEditorCustomUploadAdapterPlugin } from '../../utils/custom-upload-adapter';

interface CKEditorProps {
  label: any;
  onStateChange: any;
  currentValue: any;
  subLabel?: any;
}

export default function Editor({
  label,
  onStateChange,
  currentValue,
  subLabel,
}: CKEditorProps) {
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

  const editorConfiguration = {
    extraPlugins: [CKEditorCustomUploadAdapterPlugin, 'FileRepository'],
    image: {
      upload: {
        types: ['png', 'jpeg'],
      },
    },
  };

  return (
    <>
      {editorLoaded ? (
        <div className="relative">
          <div className="text-textDark text-h4 mb-2 font-bold font-medium">
            {label}
          </div>
          <div className="text-slate-700 mb-2 text-sm font-medium">
            {subLabel}
          </div>
          <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
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
