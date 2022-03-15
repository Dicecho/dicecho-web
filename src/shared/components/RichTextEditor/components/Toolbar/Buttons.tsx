// import 'tippy.js/animations/scale.css'
// import 'tippy.js/dist/tippy.css'
import React from 'react'
import { IconFont } from '../Iconfont';
import { TippyProps } from '@tippyjs/react'
import { LinkToolbarButton } from '../Link'; 
import { ImageToolbarButton } from '../Image';
import { ELEMENT_DETAILS, DetailsToolbarButton } from '@/shared/components/RichTextEditor/plugins';
import {
  addColumn,
  addRow,
  BalloonToolbar,
  deleteColumn,
  deleteRow,
  deleteTable,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  getPreventDefaultHandler,
  indent,
  insertTable,
  MARK_BG_COLOR,
  MARK_BOLD,
  MARK_CODE,
  MARK_COLOR,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_KBD,
  MARK_STRIKETHROUGH,
  MARK_SUBSCRIPT,
  MARK_SUPERSCRIPT,
  MARK_UNDERLINE,
  outdent,
  ToolbarButton,
  CodeBlockToolbarButton,
  ListToolbarButton,
  MediaEmbedToolbarButton,
  TableToolbarButton,
  toggleNodeType,
  usePlateEditorRef,
  usePlateEditorState,
} from '@udecode/plate'
import { BlockToolbarButton } from './BlockToolbarButton';
import { MarkToolbarButton } from './MarkToolbarButton';
import { AlignToolbarButton } from './AlignToolbarButton';
import {
  ColorPickerToolbarDropdown
} from '../ColorPickerToolbarDropdown';
import { openEditLinkFuncModal } from '../Link';
// import { Link } from '@styled-icons/material/Link'
// import { Image } from '@styled-icons/material/Image'
// import { OndemandVideo } from '@styled-icons/material/OndemandVideo'
// import { FontDownload } from '@styled-icons/material/FontDownload'
// import { FormatColorText } from '@styled-icons/material/FormatColorText'

export const BasicElementToolbarButtons: React.FC<{ id?: string }> = ({ id }) => {
  const editor = usePlateEditorRef(id);

  if(!editor) return null;

  return (
    <>
      <BlockToolbarButton
        id={id}
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<IconFont type='icon-dicecho-h1' />}
      />
      <BlockToolbarButton
        id={id}
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<IconFont type='icon-dicecho-h2' />}
      />
      <BlockToolbarButton
        id={id}
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<IconFont type='icon-dicecho-h3' />}
      />
      {/* <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H4)}
        icon={<IconFont type='icon-dicecho-h4' />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H5)}
        icon={<IconFont type='icon-dicecho-h5' />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H6)}
        icon={<IconFont type='icon-dicecho-h6' />}
      /> */}
      <BlockToolbarButton
        id={id}
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<IconFont type='icon-dicecho-quote' />}
      />
      <DetailsToolbarButton
        id={id}
        type={getPluginType(editor, ELEMENT_DETAILS)}
        icon={<IconFont type='icon-dicecho-hide' />}
      />
    </>
  )
}

export const IndentToolbarButtons: React.FC<{ id?: string }> = ({ id }) => {
  const editor = usePlateEditorRef(id)

  return (
    <>
      <ToolbarButton
        id={id}
        onMouseDown={editor && getPreventDefaultHandler(outdent, editor)}
        icon={<IconFont type='icon-dicecho-indent-decrease' />}
      />
      <ToolbarButton
        id={id}
        onMouseDown={editor && getPreventDefaultHandler(indent, editor)}
        icon={<IconFont type='icon-dicecho-indent-increase' />}
      />
    </>
  )
}

export const ListToolbarButtons: React.FC<{ id?: string }> = ({ id }) => {
  const editor = usePlateEditorRef(id)

  if(!editor) return null;

  return (
    <>
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<IconFont type='icon-dicecho-bulleted-list' />}
      />
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<IconFont type='icon-dicecho-numbered-list' />}
      />
    </>
  )
}

export const AlignToolbarButtons: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <>
      <AlignToolbarButton 
        id={id}
        value="left"
        icon={<IconFont type='icon-dicecho-left' />}
      />
      <AlignToolbarButton 
        id={id}
        value="center"
        icon={<IconFont type='icon-dicecho-center' />}
      />
      <AlignToolbarButton
        id={id}
        value="right"
        icon={<IconFont type='icon-dicecho-right' />}
      />
      <AlignToolbarButton 
        id={id}
        value="justify"
        icon={<IconFont type='icon-dicecho-justify' />}
      />
    </>
  )
}

export const BasicMarkToolbarButtons: React.FC<{ id?: string }> = ({ id }) => {
  const editor = usePlateEditorRef(id)

  if(!editor) return null;

  return (
    <>
      <MarkToolbarButton
        id={id}
        type={getPluginType(editor, MARK_BOLD)}
        icon={<IconFont type='icon-dicecho-bold' />}
      />
      <MarkToolbarButton
        id={id}
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<IconFont type='icon-dicecho-italic' />}
      />
      <MarkToolbarButton
        id={id}
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<IconFont type='icon-dicecho-underline' />}
      />
      <MarkToolbarButton
        id={id}
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<IconFont type='icon-dicecho-strikethrough' />}
      />
      {/* <MarkToolbarButton
        type={getPluginType(editor, MARK_CODE)}
        icon={<IconFont type='icon-dicecho-code' />}
      /> */}
      {/* <MarkToolbarButton
        type={getPluginType(editor, MARK_SUPERSCRIPT)}
        clear={getPluginType(editor, MARK_SUBSCRIPT)}
        icon={<Superscript />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_SUBSCRIPT)}
        clear={getPluginType(editor, MARK_SUPERSCRIPT)}
        icon={<Subscript />}
      /> */}
    </>
  )
}

// export const KbdToolbarButton = () => {
//   const editor = usePlateEditorRef()

//   if(!editor) return;

//   return (
//     <MarkToolbarButton
//       type={getPluginType(editor, MARK_KBD)}
//       icon={<Keyboard />}
//     />
//   )
// }

// export const HighlightToolbarButton = () => {
//   const editor = usePlateEditorRef()

//   return (
//     <MarkToolbarButton
//       type={getPluginType(editor, MARK_HIGHLIGHT)}
//       icon={<Highlight />}
//     />
//   )
// }

// export const TableToolbarButtons = () => (
//   <>
//     <TableToolbarButton icon={<BorderAll />} transform={insertTable} />
//     <TableToolbarButton icon={<BorderClear />} transform={deleteTable} />
//     <TableToolbarButton icon={<BorderBottom />} transform={addRow} />
//     <TableToolbarButton icon={<BorderTop />} transform={deleteRow} />
//     <TableToolbarButton icon={<BorderLeft />} transform={addColumn} />
//     <TableToolbarButton icon={<BorderRight />} transform={deleteColumn} />
//   </>
// )

export const MarkBallonToolbar: React.FC<{ id?: string }> = ({ id }) => {
  const editor = usePlateEditorRef(id)

  if(!editor) return null;

  const arrow = false
  const theme = 'dark'
  const tooltip: TippyProps = {
    arrow: true,
    delay: 0,
    duration: [200, 0],
    hideOnClick: false,
    offset: [0, 17],
    placement: 'top',
  }

  return (
    <BalloonToolbar
      popperOptions={{
        placement: 'top',
      }}
      theme={theme}
      arrow={arrow}
    >
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<IconFont type='icon-dicecho-bold' />}
        // tooltip={{ content: 'Bold (⌘B)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<IconFont type='icon-dicecho-italic' />}
        // tooltip={{ content: 'Italic (⌘I)', ...tooltip }}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<IconFont type='icon-dicecho-underline' />}
        // tooltip={{ content: 'Underline (⌘U)', ...tooltip }}
      />
    </BalloonToolbar>
  )
}

export const ToolbarButtons: React.FC<{ id?: string }> = ({ id }) => (
  <>
    <BasicElementToolbarButtons id={id} />
    <ListToolbarButtons id={id} />
    <IndentToolbarButtons id={id} />
    <BasicMarkToolbarButtons id={id} />
    <ColorPickerToolbarDropdown
      id={id}
      pluginKey={MARK_COLOR}
      icon={<IconFont type='icon-dicecho-font-color' />}
      // tooltip={{ content: 'Text color' }}
    />
    <ColorPickerToolbarDropdown
      id={id}
      pluginKey={MARK_BG_COLOR}
      icon={<IconFont type='icon-dicecho-paint' />}
      // tooltip={{ content: 'Highlight color' }}
    />
    <AlignToolbarButtons id={id} />
    <LinkToolbarButton id={id} 
      icon={<IconFont type='icon-dicecho-link' />}
      // getLinkUrl={(preUrl: string | null) => new Promise((resolve, reject) => {
      //     openEditLinkFuncModal({ 
      //       prevUrl: preUrl || '',
      //       onSubmit: (url) => resolve(url),
      //     })
      //   })
      // }
    />
    <ImageToolbarButton
      id={id}
      icon={<IconFont type='icon-dicecho-image' />}
    />
    {/* <MediaEmbedToolbarButton 
      icon={<IconFont type='icon-dicecho-video' />}
    /> */}
    {/* <TableToolbarButtons /> */}
  </>
)
