import { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

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
          menu: [
            'crop',
            'flip',
            'rotate',
            'draw',
            'shape',
            'icon',
            'text',
            'mask',
            'filter',
          ],
          initMenu: 'crop', // 처음 활성화될 메뉴
          uiSize: {
            width: '100%',
            height: '100%',
          },
          menuBarPosition: 'top', // 메뉴 바 위치
        },
        cssMaxWidth: '700px',
        cssMaxHeight: '500px',
        selectionStyle: {
          cornerSize: 10,
          rotatingPointOffset: 60,
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
    <div
      id="tui-image-editor"
      ref={editorRef}
      style={{ width: '700px', height: '500px' }} // 컨테이너 크기를 명시적으로 지정
    />
  );
};

export default ToastImageEditor;
