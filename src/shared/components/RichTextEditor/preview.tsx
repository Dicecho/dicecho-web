import React, { useEffect } from "react";
import { PlateEditor } from './plate';
import { usePlateEditorState, PlateProps } from '@udecode/plate-core';
import _ from 'lodash';
import { WebErrorBoundary } from '@/shared/components/ErrorBoundary';

export const RichTextPreview: React.FC<PlateProps> = ({
  id,
  ...props
}) => {
  const state = usePlateEditorState(id);

  useEffect(() => {
    if (!props.value || !state) {
      return;
    }

    if (_.isEqual(state.children, props.value)) {
      return;
    }

    state.children = props.value;
  }, [props.value])

  return (
    <WebErrorBoundary>
      <PlateEditor
        initialValue={props.value}
        id={id}
        editableProps={{ placeholder: '', readOnly: true }}
      />
    </WebErrorBoundary>
  );
};
