import { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import styled from 'styled-components';

const EditorContainer = styled.div`
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
`;

const MyImageEditor = () => {
  const editorRef = useRef(null); // 에디터 인스턴스를 위한 useRef
  const imageEditorInstance = useRef(null); // 로드한 이미지를 위한 useRef

  useEffect(() => {
    if (editorRef.current) {
      const instance = new ImageEditor(editorRef.current, {
        includeUI: {
          theme: {},
          menu: ['crop', 'flip', 'shape', 'icon', 'text', 'mask', 'filter'],
          initMenu: 'crop',
          uiSize: {
            width: '100%',
            height: '100%',
          },
          menuBarPosition: 'left',
        },
        cssMaxWidth: 1000,
        cssMaxHeight: 800,
        selectionStyle: {
          cornerSize: 5,
          rotatingPointOffset: 30,
        },
      });

      imageEditorInstance.current = instance;
    }

    return () => {
      if (imageEditorInstance.current) {
        imageEditorInstance.current.destroy();
      }
    };
  }, []);

  return <EditorContainer id="tui-image-editor" ref={editorRef} />;
};

export default MyImageEditor;
