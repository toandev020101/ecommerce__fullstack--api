import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useState } from 'react';
import MediaDialog from './MediaDialog';

interface Props {
  data: string;
  onHandleChange: Function;
  height: string;
}

const TextEditor: React.FC<Props> = ({ data, onHandleChange, height }) => {
  const editorRef: any = useRef(null);
  const [isOpenMediaDialog, setIsOpenMediaDialog] = useState<boolean>(false);

  const handleConfirmDialog = (newImageUrl: string) => {
    editorRef.current.insertContent(`<img src=${newImageUrl} alt="" />`);
  };

  return (
    <>
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        onInit={(_evt: any, editor: any) => (editorRef.current = editor)}
        initialValue={data}
        init={{
          height,
          menubar: false,
          toolbar_mode: 'wrap',
          language: 'vi',
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'preview',
            'help',
            'wordcount',
            'emoticons',
            'highlight',
            'lineheight',
          ],
          toolbar:
            'undo redo | blocks fontsize | bold underline italic strikethrough | forecolor backcolor | bullist numlist | alignleft aligncenter alignright alignjustify outdent indent lineheight | link unlink image upload code | emoticons searchreplace fullscreen | removeformat blockquote | help',
          lineheight_formats: '1 1.5 2 2.5 3',
          setup: function (editor: any) {
            // Add a custom button to the toolbar.
            editor.ui.registry.addButton('upload', {
              icon: 'upload',
              tooltip: 'Tải lên',
              onAction: function () {
                // Call a function to handle the image insertion.
                setIsOpenMediaDialog(true);
              },
            });
          },
        }}
        onChange={() => onHandleChange(editorRef.current.getContent())}
      />

      <MediaDialog
        title="Hình ảnh"
        isOpen={isOpenMediaDialog}
        handleClose={() => setIsOpenMediaDialog(false)}
        selectedValues={[]}
        handleConfirm={handleConfirmDialog}
      />
    </>
  );
};

export default TextEditor;
