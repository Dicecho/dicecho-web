import React, { useEffect, useState, useRef,HTMLAttributes } from 'react';
import { useIsMounted } from 'react-tidy'
import Vditor from "vditor";
import 'vditor/src/assets/scss/index.scss';
import 'vditor/dist/css/content-theme/dark.css'
import styles from "./styles.module.less";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  content: string
}

const MarkdownRender: React.FC<IProps> = ({ content, className = '', ...props }) => {
  // const [renderHtml, setRenderHtml] = useState('');
  // const isMounted = useIsMounted()
  const previewRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   Vditor.md2html(content).then((value) => {
  //     if (isMounted()) {
  //       setRenderHtml(value)
  //     }
  //   })
  // }, [content])

  useEffect(() => {
    if (!previewRef.current) {
      return;
    }

    Vditor.preview(previewRef.current, content, { mode: 'dark', cdn: 'https://file.dicecho.com/lib/vditor@3.7.5' })
  }, [content, previewRef])

  return (
    <div 
      className={`vditor--dark vditor-reset ${styles.renderView} ${className}`}
      ref={previewRef}
      {...props}
      // dangerouslySetInnerHTML={{ __html: renderHtml }}
    />
  );
};

export default MarkdownRender;
