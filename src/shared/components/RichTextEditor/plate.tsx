// import 'tippy.js/dist/tippy.css'
// import './index.css'
import React, { useEffect } from 'react'
import { message } from 'antd';
import classnames from 'classnames';
import {
  createDetailsPlugin,
} from './plugins';
import {
  TNode,
  Plate,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createKbdPlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  createMentionPlugin,
  createIndentPlugin,
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createDeserializeMdPlugin,
  createDeserializeCsvPlugin,
  createNormalizeTypesPlugin,
  createFontSizePlugin,
  createHorizontalRulePlugin,
  createPlugins,
  createDeserializeDocxPlugin,
  createJuicePlugin,
  PlateProps,
} from '@udecode/plate'
import { 
  createImagePlugin,
} from './components'
import { CONFIG } from './config/config'
import { useUploadOSS } from '@/shared/hooks';
import styles from './styles.module.less';

const PlateEditor: React.FC<PlateProps> = ({
  editableProps,
  children,
  ...props
}) => {
  const { upload } = useUploadOSS({ compress: true, compressorOption: { quality: 0.8 } });

  const plugins = createPlugins(
    [
      createParagraphPlugin(),
      createBlockquotePlugin(),
      // createTodoListPlugin(),
      createHeadingPlugin(),
      createImagePlugin({
        options: {
          uploadImage: (file) => upload(file)
            .then(res => res.url)
            .catch(() => {
              message.error('上传失败，请重试');
              return '';
            })
        }
      }),
      createHorizontalRulePlugin(),
      createLinkPlugin(),
      createListPlugin(),
      createMediaEmbedPlugin(),
      createCodeBlockPlugin(),
      createAlignPlugin(CONFIG.align),
      createBoldPlugin(),
      createCodePlugin(),
      createItalicPlugin(),
      createHighlightPlugin(),
      createUnderlinePlugin(),
      createStrikethroughPlugin(),
      // createSubscriptPlugin(),
      // createSuperscriptPlugin(),
      createFontColorPlugin(),
      createFontBackgroundColorPlugin(),
      // createFontSizePlugin(),
      createKbdPlugin(),
      createNodeIdPlugin(),
      // createDndPlugin(),
      createIndentPlugin(CONFIG.indent),
      // createAutoformatPlugin(CONFIG.autoformat),
      createResetNodePlugin(CONFIG.resetBlockType),
      createSoftBreakPlugin(CONFIG.softBreak),
      createExitBreakPlugin(CONFIG.exitBreak),
      // createNormalizeTypesPlugin(CONFIG.forceLayout),
      createTrailingBlockPlugin(CONFIG.trailingBlock),
      createSelectOnBackspacePlugin(CONFIG.selectOnBackspace),
      createDeserializeMdPlugin(),
      createDeserializeCsvPlugin(),
      createDeserializeDocxPlugin(),
      createJuicePlugin(),

      // advance
      // createMentionPlugin(),

      // custom plugins
      // createPreviewPlugin(),
      createDetailsPlugin(),
    ],
    {
      components: CONFIG.components,
    }
  )

  return (
    <Plate
      editableProps={{
        ...CONFIG.editableProps,
        ...editableProps,
        className: classnames(styles.plate ,editableProps?.className),
      }}
      plugins={plugins}
      {...props}
    >
      {children}
    </Plate>
  )
}

export { PlateEditor }
