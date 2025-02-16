import { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import St from 'styled-components';

const EditorContainer = St.div`
  width:100%;
  height:100%;
`;

const ToastImageEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // includeUI 옵션 사항 추가하기
      const instance = new ImageEditor(editorRef.current, {
        includeUI: {
          loadImage: {
            path: '', //store에서 이미지 불러오기
            name: 'SampleImage',
          },
          theme: {}, // 기본 테마 사용 (원하면 커스터마이징 가능)
          menu: ['crop', 'flip', 'shape', 'icon', 'text', 'mask', 'filter'],
          initMenu: 'crop',
          uiSize: {
            width: '100%',
            height: '100%',
          },
          menuBarPosition: 'left',
        },
        cssMaxWidth: '100%',
        cssMaxHeight: '100%',
        selectionStyle: {
          cornerSize: 5,
          rotatingPointOffset: 30,
        },
      });

      // 컴포넌트 언마운트 시 에디터 인스턴스 정리
      return () => {
        if (instance) {
          instance.destroy();
        }
      };
    }
  }, []);

  return (
    <EditorContainer
      id="tui-image-editor"
      ref={editorRef}
      // 컨테이너 크기
    />
  );
};

export default ToastImageEditor;
