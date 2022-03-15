import React, { useState } from 'react';
import {
  getRootProps,
  StyledElementProps,
} from '@udecode/plate-styled-components';
import classnames from 'classnames';
import { getPluginOptions, setNodes, TElement } from '@udecode/plate-core';
import { ReactEditor, useReadOnly } from 'slate-react';
import { Input } from 'antd';
import { DetailsNodeData } from '../types'
import _ from 'lodash';
import styles from './DetailsElement.module.less';
// import { getBlockquoteElementStyles } from './BlockquoteElement.styles';

export const DetailsElement = (props: StyledElementProps) => {
  const { attributes, children, nodeProps, element, editor } = props;
  const readOnly = useReadOnly();
  const { summary = '' } = element;

  const [_summary, setSummary] = useState(summary);
  const [isComposition, setComposition] = useState(false);

  const rootProps = getRootProps(props);

  const saveDate = (value: string) => {
    const path = ReactEditor.findPath(editor, element);
    setNodes<TElement<DetailsNodeData>>(
      editor,
      { summary: value },
      { at: path }
    );
  }

  if (readOnly) {
    return (
      <details
        {...attributes}
        {...rootProps}
        {...nodeProps}
        contentEditable={false} 
        className={classnames(styles.details, rootProps?.className)}
      >
        <summary className={classnames(styles.summary, styles.staticSummary)}>
          {summary}
        </summary>
        <div className={styles.content}>
          {children}
        </div>

      </details>
    )
  }

  return (
    <div
      {...attributes}
      {...rootProps}
      {...nodeProps}
      className={classnames(styles.details, rootProps?.className)}
    >

      <div contentEditable={false} className={styles.summary}>
        <input
          autoComplete='off'
          data-testid="DetailsElementSummary"
          className={styles.summaryInput}
          value={_summary} 
          placeholder='填写预警标题'
          onCompositionStart={() => setComposition(true)}
          onCompositionEnd={() => {
            setComposition(false)
            saveDate(_summary)
          }}
          onChange={e => {
            setSummary(e.target.value);
            if (!isComposition) {
              saveDate(e.target.value);
            }
          }}
        />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
