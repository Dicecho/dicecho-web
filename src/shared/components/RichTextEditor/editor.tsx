import React, { useEffect } from "react";
import { Affix } from 'antd';
import classnames from 'classnames';
import { PlateEditor } from './plate';
import { 
  CustomToolbar,
} from './components'
import { WebErrorBoundary } from '@/shared/components/ErrorBoundary';
import { PlateProps } from '@udecode/plate-core';
import styles from './styles.module.less';

export interface RichTextEditorProps extends PlateProps {
  toolbarAffix?: number
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  toolbarAffix = undefined,
  editableProps,
  value,
  initialValue,
  ...props
}) => {
  const renderToolbar = () => {
    if (toolbarAffix !== undefined) {
      return (
        <Affix offsetTop={toolbarAffix}>
          <CustomToolbar id={props.id} className={styles.editorToolbar} />
        </Affix>
      )
    }

    return <CustomToolbar id={props.id} className={styles.editorToolbar} />
  }

  const DEFAULT_VALUE = [{ children: [{ text: '' }]}];

  const _initialValue = (() => {
    if (initialValue) {
      return initialValue.length === 0 ? DEFAULT_VALUE : initialValue;
    }

    if (value) {
      return value.length === 0 ? DEFAULT_VALUE : value;
    }

    return DEFAULT_VALUE;
  })()

  return (
    <WebErrorBoundary>
      {renderToolbar()}
      <PlateEditor
        initialValue={_initialValue}
        editableProps={{
          ...editableProps,
          className: classnames(styles.editorEditable, editableProps?.className),
        }}
        {...props}
      />
    </WebErrorBoundary>
  );
};
