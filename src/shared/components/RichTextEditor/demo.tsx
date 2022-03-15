import React, { useEffect, useRef, useState } from "react";
import { Button } from 'antd';
import { RichTextPreview } from './preview';
import { RichTextEditor } from './editor';
import { Error } from "@/shared/components/Empty";

import { TNode, usePlateEditorRef } from '@udecode/plate-core';

interface IProps {}

const EditorDemoContainer: React.FC<IProps> = () => {
  const [value, setValue] = useState<TNode[]>([{ type: 'p', children: [{ text: '' }]}]);
  const editor = usePlateEditorRef('Examples/Playground')!;


  useEffect(() => {
    console.log(value)
  }, [value])

  return (
    <React.Fragment>
      <Error />
      
      <div className="container" style={{ marginTop: 64 }}>
        <RichTextEditor
          toolbarAffix={58}
          initialValue={value}
          onChange={setValue}
          id={'Examples/Playground'}
        />
      </div>

      {/* <Button onClick={() => editor.deleteBackward('character')} >deleteBackward</Button> */}

      <div className="container" style={{ marginTop: 64 }}>
        <RichTextPreview
          value={value}
          id={'Examples/Preview'}
        />
      </div>
    </React.Fragment>
  );
};
export default EditorDemoContainer;
