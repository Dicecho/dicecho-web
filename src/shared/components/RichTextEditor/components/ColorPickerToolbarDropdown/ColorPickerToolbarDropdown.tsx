import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  getMark,
  getPluginType,
  isMarkActive,
  removeMark,
  setMarks,
  usePlateEditorRef,
  usePlateEditorState,
} from '@udecode/plate-core';
import { Popover, Button } from 'antd';
import {
  ToolbarButton,
  ToolbarButtonProps,
  ToolbarDropdown,
} from '@udecode/plate-ui-toolbar';
import { Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { BlockPicker } from 'react-color';
// import { ColorPicker } from '../ColorPicker/ColorPicker';
// import { ColorType } from '../ColorPicker/ColorType';
import { DEFAULT_COLORS, DEFAULT_CUSTOM_COLORS } from './constants';
import styles from './ColorPickerToolbarDropdown.module.less';

type ColorPickerToolbarDropdownProps = {
  pluginKey: string;
  icon: ReactNode;
  // selectedIcon: ReactNode;
  // colors?: ColorType[];
  // customColors?: ColorType[];
  closeOnSelect?: boolean;
  id?: string;
};

export const ColorPickerToolbarDropdown = ({
  pluginKey,
  icon,
  id,
  colors = DEFAULT_COLORS,
  customColors = DEFAULT_CUSTOM_COLORS,
  closeOnSelect = true,
  ...rest
}: ColorPickerToolbarDropdownProps & ToolbarButtonProps) => {
  const [open, setOpen] = useState(false);
  const editor = usePlateEditorState(id)!;
  const editorRef = usePlateEditorRef(id)!;

  const type = getPluginType(editorRef, pluginKey);

  const color = editorRef && getMark(editorRef, type);

  const [selectedColor, setSelectedColor] = useState<string>();

  const onToggle = useCallback(() => {
    setOpen(!open);
  }, [open, setOpen]);

  const updateColor = useCallback(
    (value: string) => {
      if (editorRef && editor && editor.selection) {
        setSelectedColor(value);

        Transforms.select(editorRef, editor.selection);
        ReactEditor.focus(editorRef);

        setMarks(editor, { [type]: value });
      }
    },
    [editor, editorRef, type]
  );

  const updateColorAndClose = useCallback(
    (value: string) => {
      updateColor(value);
      closeOnSelect && onToggle();
    },
    [closeOnSelect, onToggle, updateColor]
  );

  const clearColor = useCallback(() => {
    if (editorRef && editor && editor.selection) {
      Transforms.select(editorRef, editor.selection);
      ReactEditor.focus(editorRef);

      if (selectedColor) {
        removeMark(editor, { key: type });
      }

      closeOnSelect && onToggle();
    }
  }, [closeOnSelect, editor, editorRef, onToggle, selectedColor, type]);

  useEffect(() => {
    if (editor?.selection) {
      setSelectedColor(color);
    }
  }, [color, editor?.selection]);

  return (
    <Popover
      // title={null}
      content={(
        <BlockPicker
          color={selectedColor || color}
          colors={['#d9e3f0', '#f47373', '#697689', '#37d67a', '#2ccce4', '#555555', '#dce775', '#FF8A65', '#BA68C8', 'transparent']}
          onChangeComplete={(e) => {
            if (e.hex === 'transparent') {
              clearColor();
              return;
            }
            updateColorAndClose(e.hex)
          }}
        />
      )}
      color={'transparent'}
      trigger="click"
      overlayInnerStyle={{ padding: 0, boxShadow: 'none' }}
      visible={open}
      onVisibleChange={setOpen}
    >
      <ToolbarButton
        onMouseDown={onToggle}
        active={false}
        icon={(
          <div className={styles.iconWrapper}>
            {icon}
            {!!editor?.selection && isMarkActive(editor, type) &&
              <div className={styles.colorSign} style={{ background: color }}/>
            }
          </div>
        )}
        {...rest}
      />
    </Popover>
  );
};
