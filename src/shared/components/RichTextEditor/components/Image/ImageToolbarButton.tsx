import React from 'react';
import {
  OSSUpload,
} from "@/shared/components/Uploader";
import { Upload } from 'antd';
import { usePlateEditorRef } from '@udecode/plate-core';
import { insertImage } from '@udecode/plate-image';
import { ToolbarButton, ToolbarButtonProps } from '@udecode/plate-ui-toolbar';

export interface ImageToolbarButtonProps extends ToolbarButtonProps {
  /**
   * Default onMouseDown is getting the image url by calling this promise before inserting the image.
   */
  // getImageUrl?: () => Promise<string>;
}

export const ImageToolbarButton = ({
  id,
  ...props
}: ImageToolbarButtonProps) => {
  const editor = usePlateEditorRef(id)!;

  return (
    <OSSUpload
      accept=".jpg,.png,.jpeg,.gif,.svg"
      showUploadList={false}
      multiple={false}
      onUploaded={(url) => {
        if (!url) return;
        insertImage(editor, url);
      }}
      rename
    >
      <ToolbarButton
        // onMouseDown={async (event) => {
        //   if (!editor) return;

        //   event.preventDefault();

        //   let url;
        //   if (getImageUrl) {
        //     url = await getImageUrl();
        //   } else {
        //     url = window.prompt('Enter the URL of the image:');
        //   }
        //   if (!url) return;

        //   insertImage(editor, url);
        // }}
        {...props}
      />
    </OSSUpload>
  );
};
