import { useEffect, useRef, useState } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import St from 'styled-components';

const StEditorContainer = St.div`
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
          menu: ['crop', 'flip', 'shape', 'icon', 'filter'],
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
      console.log(instance);
      // console.log(imageEditorInstance);
      // console.log(imageEditorInstance.current._graphics.imageName);
      //현재 이미지 로드 시 이미지의 이름 Object object로 출력력
    }

    return () => {
      if (imageEditorInstance.current) {
        imageEditorInstance.current.destroy();
      }
    };
  }, []);

  const handleImgFile = async (e) => {
    const file = e.target.files[0];
    if (file && imageEditorInstance.current) {
      setImgFile(file.name);
      console.log('file', file);
      console.log('file name', file.name);
      try {
        await imageEditorInstance.current.loadImageFromFile(file, file.name);
      } catch (error) {
        console.error('image file error', error);
      }
    }
  };

  return <StEditorContainer id="tui-image-editor" ref={editorRef} />;
};

export default MyImageEditor;
