import {
  AutoformatPlugin,
  CodeBlockElement,
  createPlateUI,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  ELEMENT_IMAGE,
  ELEMENT_PARAGRAPH,
  ELEMENT_TD,
  ELEMENT_TODO_LI,
  MARK_BG_COLOR,
  MARK_COLOR,
  ExitBreakPlugin,
  IndentPlugin,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  KEYS_HEADING,
  NormalizeTypesPlugin,
  PlatePlugin,
  ResetNodePlugin,
  SelectOnBackspacePlugin,
  SoftBreakPlugin,
  TrailingBlockPlugin,
  withProps,
  StyledElement,
} from '@udecode/plate'
import { 
  DetailsElement,
  ELEMENT_DETAILS,
} from '../plugins'
import {
  CustomImageElement
} from '../components';
import { EditableProps } from 'slate-react/dist/components/editable'
// import { autoformatRules } from './autoformat/autoformatRules'
// import { MENTIONABLES } from './mentionables'

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
}

export const CONFIG: {
  components: Record<string, any>
  editableProps: EditableProps
  align: Partial<PlatePlugin>
  // autoformat: Partial<PlatePlugin<{}, AutoformatPlugin>>
  exitBreak: Partial<PlatePlugin<{}, ExitBreakPlugin>>
  forceLayout: Partial<PlatePlugin<{}, NormalizeTypesPlugin>>
  indent: Partial<PlatePlugin<{}, IndentPlugin>>
  lineHeight: Partial<PlatePlugin>
  // mentionItems: any
  resetBlockType: Partial<PlatePlugin<{}, ResetNodePlugin>>
  selectOnBackspace: Partial<PlatePlugin<{}, SelectOnBackspacePlugin>>
  softBreak: Partial<PlatePlugin<{}, SoftBreakPlugin>>
  trailingBlock: Partial<PlatePlugin<{}, TrailingBlockPlugin>>
} = {
  editableProps: {
    spellCheck: false,
    autoFocus: false,
    placeholder: 'Type…',
  },
  components: createPlateUI({
    [ELEMENT_CODE_BLOCK]: withProps(CodeBlockElement, {}),
    [ELEMENT_H1]: withProps(StyledElement, {
      as: 'h1',
    }),
    [ELEMENT_H2]: withProps(StyledElement, {
      as: 'h2',
    }),
    [ELEMENT_H3]: withProps(StyledElement, {
      as: 'h3',
    }),
    [ELEMENT_H4]: withProps(StyledElement, {
      as: 'h4',
    }),
    [ELEMENT_H5]: withProps(StyledElement, {
      as: 'h5',
    }),
    [ELEMENT_H6]: withProps(StyledElement, {
      as: 'h6',
    }),
    [ELEMENT_DETAILS]: DetailsElement,
    [ELEMENT_IMAGE]: CustomImageElement,
  }),
  align: {
    inject: {
      props: {
        validTypes: [
          ELEMENT_PARAGRAPH,
          ELEMENT_H1,
          ELEMENT_H2,
          ELEMENT_H3,
          ELEMENT_H4,
          ELEMENT_H5,
          ELEMENT_H6,
        ],
      },
    },
  },
  indent: {
    inject: {
      props: {
        validTypes: [
          ELEMENT_PARAGRAPH,
          ELEMENT_H1,
          ELEMENT_H2,
          ELEMENT_H3,
          ELEMENT_H4,
          ELEMENT_H5,
          ELEMENT_H6,
          ELEMENT_BLOCKQUOTE,
          ELEMENT_CODE_BLOCK,
        ],
      },
    },
  },
  lineHeight: {
    inject: {
      props: {
        defaultNodeValue: 1.5,
        validNodeValues: [1, 1.2, 1.5, 2, 3],
        validTypes: [
          ELEMENT_PARAGRAPH,
          ELEMENT_H1,
          ELEMENT_H2,
          ELEMENT_H3,
          ELEMENT_H4,
          ELEMENT_H5,
          ELEMENT_H6,
        ],
      },
    },
  },
  resetBlockType: {
    options: {
      rules: [
        {
          ...resetBlockTypesCommonRule,
          hotkey: 'Enter',
          predicate: isBlockAboveEmpty,
        },
        {
          ...resetBlockTypesCommonRule,
          hotkey: 'Backspace',
          predicate: isSelectionAtBlockStart,
        },
      ],
    },
  },
  trailingBlock: { type: ELEMENT_PARAGRAPH },
  softBreak: {
    options: {
      rules: [
        { hotkey: 'shift+enter' },
        {
          hotkey: 'enter',
          query: {
            allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
          },
        },
      ],
    },
  },
  exitBreak: {
    options: {
      rules: [
        {
          hotkey: 'mod+enter',
        },
        {
          hotkey: 'mod+shift+enter',
          before: true,
        },
        {
          hotkey: 'enter',
          query: {
            start: true,
            end: true,
            allow: [
              ELEMENT_H1,
              ELEMENT_H2,
              ELEMENT_H3,
              ELEMENT_H4,
              ELEMENT_H5,
              ELEMENT_H6,
            ],
          },
        },
      ],
    },
  },
  selectOnBackspace: {
    options: {
      query: {
        allow: [ELEMENT_IMAGE, ELEMENT_HR],
      },
    },
  },
  // autoformat: {
  //   options: {
  //     rules: autoformatRules,
  //   },
  // },
  // mentionItems: MENTIONABLES,
  forceLayout: {
    options: {
      rules: [{ path: [0], strictType: ELEMENT_H1 }],
    },
  },
}
