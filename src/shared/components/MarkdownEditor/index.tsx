import { sleepAsync } from "@/utils/utils";
import React, {
  useRef,
  useImperativeHandle,
  MutableRefObject,
  HTMLAttributes,
  useState,
  useEffect,
} from "react";
import { Upload, Spin, Skeleton } from "antd";
import Vditor from "vditor";
import "vditor/src/assets/scss/index.scss";
import MarkdownRender from "./MarkdownRender";
import styles from "./styles.module.less";
import FileStore from "@/shared/stores/FileStore";
import UIStore from "@/shared/stores/UIStore";

function isFileImage(file: File) {
    return file && file['type'].split('/')[0] === 'image';
}

interface IOptions {
  /** 历史记录间隔 */
  undoDelay?: number;
  /** 内部调试时使用 */
  _lutePath?: string;
  /** 编辑器初始化值。默认值: '' */
  value?: string;
  /** 是否显示日志。默认值: false */
  debugger?: boolean;
  /** 是否启用打字机模式。默认值: false */
  typewriterMode?: boolean;
  /** 编辑器总高度。默认值: 'auto' */
  height?: number | string;
  /** 编辑器最小高度 */
  minHeight?: number;
  /** 编辑器总宽度，支持 %。默认值: 'auto' */
  width?: number | string;
  /** 输入区域为空时的提示。默认值: '' */
  placeholder?: string;
  /** 多语言。默认值: 'zh_CN' */
  lang?: keyof II18n;
  /** @link https://ld246.com/article/1549638745630#options-fullscreen */
  fullscreen?: {
    index: number;
  };
  /** @link https://ld246.com/article/1549638745630#options-toolbar */
  toolbar?: Array<string | IMenuItem>;
  /** @link https://ld246.com/article/1549638745630#options-resize */
  resize?: IResize;
  /** @link https://ld246.com/article/1549638745630#options-counter */
  counter?: {
    enable: boolean;
    max?: number;
    type?: "markdown" | "text";
    after?(
      length: number,
      counter: {
        enable: boolean;
        max?: number;
        type?: "markdown" | "text";
      }
    ): void;
  };
  /** @link https://ld246.com/article/1549638745630#options-cache */
  cache?: {
    id?: string;
    enable?: boolean;
    after?(markdown: string): void;
  };
  /** 编辑模式。默认值: 'wysiwyg' */
  mode?: "wysiwyg" | "sv" | "ir";
  /** @link https://ld246.com/article/1549638745630#options-preview */
  preview?: IPreview;
  /** @link https://ld246.com/article/1549638745630#options-hint */
  hint?: IHint;
  /** @link https://ld246.com/article/1549638745630#options-toolbarConfig */
  toolbarConfig?: {
    hide?: boolean;
    pin?: boolean;
  };
  /** 评论 */
  comment?: {
    enable: boolean;
    add?(id: string, text: string, commentsData: ICommentsData[]): void;
    remove?(ids: string[]): void;
    scroll?(top: number): void;
    adjustTop?(commentsData: ICommentsData[]): void;
  };
  /** 主题。默认值: 'classic' */
  theme?: "classic" | "dark";
  /** 图标。默认值: 'ant' */
  icon?: "ant" | "material";
  /** @link https://ld246.com/article/1549638745630#options-upload */
  upload?: IUpload;
  /** @link https://ld246.com/article/1549638745630#options-classes */
  classes?: IClasses;
  /** 配置自建 CDN 地址。默认值: 'https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}' */
  cdn?: string;
  /** tab 键操作字符串，支持 \t 及任意字符串 */
  tab?: string;
  /** @link https://ld246.com/article/1549638745630#options-outline */
  outline?: {
    enable: boolean;
    position: "left" | "right";
  };

  /** 编辑器异步渲染完成后的回调方法 */
  after?(): void;

  /** 输入后触发 */
  input?(value: string, previewElement?: HTMLElement): void;

  /** 聚焦后触发  */
  focus?(value: string): void;

  /** 失焦后触发 */
  blur?(value: string): void;

  /** `esc` 按下后触发 */
  esc?(value: string): void;

  /** `⌘/ctrl+enter` 按下后触发 */
  ctrlEnter?(value: string): void;

  /** 编辑器中选中文字后触发 */
  select?(value: string): void;
}

interface IProps extends Omit<IOptions, 'input'> {
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  action?: React.ReactNode;
  showUploader?: boolean;
  defaultValue?: string;
  onChange?: (value: string,  previewElement?: HTMLElement) => any;
  // editorProps?: IOptions;
}

export const MarkdownEditor = React.forwardRef<Vditor | undefined, IProps>(
  ({ 
    wrapperProps,
    action,
    showUploader = true,
    defaultValue = '',
    onChange = () => {},
    ...editorProps
  }, ref) => {
    // const { editorProps, className = "", ...divProps } = props;
    const editorRef: MutableRefObject<Vditor | undefined> = useRef();
    // const [innerValue, setInnerValue] = useState(defaultValue);
    const [initialized, setInitialized] = useState(
      editorRef.current !== undefined
    );
    const [uploading, setUploading] = useState(false);

    useImperativeHandle(ref, () => editorRef.current);

    const beforeUpload = (image: File) => {
      upload(image);
      return false;
    };

    const upload = (file: File) => {
      setUploading(true);
      FileStore.uploadFileToAliOSS(file, { rename: true })
        .then((res) => {
          const value = `${isFileImage(file) ? '!' : ''}[${res.name}](${res.url})`;
          insertValue(value);
        })
        .finally(() => {
          setUploading(false);
        });
    };

    const insertValue = (content: string, render: boolean = true) => {
      if (!editorRef.current) {
        return;
      }

      editorRef.current.insertValue(content, render);
    };

    const insertHiddenContent = (title: string, content: string) => {
      insertValue(
        `<details><summary>${title}</summary>${content}</details>`,
        false
      );
    };

    const minHeight = editorProps.minHeight ? editorProps.minHeight + (showUploader ? 37 : 0) : undefined
    const height = (() => {
      if (typeof editorProps.height === 'number') {
        return editorProps.height + (showUploader ? 37 : 0)
      }

      return editorProps.height
    })()

    return (
      <div
        {...wrapperProps}
        className={`${styles.editor} ${wrapperProps?.className || ""}`}
        style={{ minHeight, height, ...wrapperProps?.style }}
      >
        {!initialized &&
          <div className={styles.placeholder}>
            <div className={styles.placeholderHeader} />
            <div className={styles.placeholderContent}>
              <Skeleton />
            </div>
          </div>
        }
        <div
          ref={(element) => {
            if (!element || editorRef.current) return;
            
            const vditor = new Vditor(element, {
              toolbar: UIStore.isMobile
                ? [
                    "upload",
                    {
                      name: "hidden",
                      tip: "隐藏内容",
                      tipPosition: "n",
                      icon: `<svg t="1614482497869" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1113" width="200" height="200"><path d="M877.28384 237.248a64 64 0 1 0-90.496-90.496l-45.888 45.888A438.912 438.912 0 0 0 512.03584 128C275.68384 128 131.42784 295.488 10.78784 476.48a63.872 63.872 0 0 0 0 71.04 1180.672 1180.672 0 0 0 168.64 206.592l-32.64 32.64a64 64 0 1 0 90.496 90.496zM141.47584 512C270.17984 328.448 376.35584 256 512.03584 256a313.152 313.152 0 0 1 135.168 30.336L544.86784 388.672A119.04 119.04 0 0 0 512.03584 384a128.128 128.128 0 0 0-128 128 119.04 119.04 0 0 0 4.672 32.832L269.92384 663.68A938.688 938.688 0 0 1 141.47584 512zM1013.28384 476.48a1646.72 1646.72 0 0 0-81.856-112.576L840.35584 455.104c13.888 17.792 27.84 36.416 42.24 56.896-123.264 175.936-226.176 248.96-353.984 254.848l-117.12 117.056A453.568 453.568 0 0 0 512.03584 896c236.352 0 380.608-167.488 501.248-348.48a63.872 63.872 0 0 0 0-71.04z" p-id="1114"></path></svg>`,
                      click() {
                        insertHiddenContent(
                          "这里填写预警标题",
                          "这里填写隐藏内容"
                        );
                      },
                    },
                    "edit-mode",
                    {
                      name: "more",
                      toolbar: [
                        "link",
                        "headings",
                        "bold",
                        "italic",
                        "strike",
                        "quote",
                        "line",
                        "preview",
                        "fullscreen",
                      ],
                    },
                  ]
                : [
                    "headings",
                    "bold",
                    "italic",
                    "strike",
                    {
                      name: "hidden",
                      tip: "隐藏内容",
                      tipPosition: "n",
                      icon: `<svg t="1614482497869" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1113" width="200" height="200"><path d="M877.28384 237.248a64 64 0 1 0-90.496-90.496l-45.888 45.888A438.912 438.912 0 0 0 512.03584 128C275.68384 128 131.42784 295.488 10.78784 476.48a63.872 63.872 0 0 0 0 71.04 1180.672 1180.672 0 0 0 168.64 206.592l-32.64 32.64a64 64 0 1 0 90.496 90.496zM141.47584 512C270.17984 328.448 376.35584 256 512.03584 256a313.152 313.152 0 0 1 135.168 30.336L544.86784 388.672A119.04 119.04 0 0 0 512.03584 384a128.128 128.128 0 0 0-128 128 119.04 119.04 0 0 0 4.672 32.832L269.92384 663.68A938.688 938.688 0 0 1 141.47584 512zM1013.28384 476.48a1646.72 1646.72 0 0 0-81.856-112.576L840.35584 455.104c13.888 17.792 27.84 36.416 42.24 56.896-123.264 175.936-226.176 248.96-353.984 254.848l-117.12 117.056A453.568 453.568 0 0 0 512.03584 896c236.352 0 380.608-167.488 501.248-348.48a63.872 63.872 0 0 0 0-71.04z" p-id="1114"></path></svg>`,
                      click() {
                        insertHiddenContent(
                          "这里填写预警标题",
                          "这里填写隐藏内容"
                        );
                      },
                    },
                    "|",
                    "upload",
                    // {
                    //   name: "upload",
                    //   tip: "上传图片",
                    //   tipPosition: "n",
                    //   // icon: `<svg t="1614501674336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2814" width="200" height="200"><path d="M213.333 426.667c-25.6 0-42.666-17.067-42.666-42.667 0-166.4 132.266-298.667 298.666-298.667 128 0 243.2 85.334 285.867 209.067 4.267 21.333-4.267 46.933-29.867 51.2-21.333 8.533-46.933-4.267-55.466-25.6-25.6-89.6-106.667-149.333-200.534-149.333C349.867 170.667 256 264.533 256 384c0 25.6-17.067 42.667-42.667 42.667zM768 768c-25.6 0-42.667-17.067-42.667-42.667S742.4 682.667 768 682.667c93.867 0 170.667-76.8 170.667-170.667S861.867 341.333 768 341.333c-12.8 0-29.867 0-42.667 4.267-21.333 4.267-46.933-8.533-51.2-29.867s8.534-46.933 29.867-51.2c21.333-4.266 42.667-8.533 64-8.533 140.8 0 256 115.2 256 256S908.8 768 768 768z m-426.667 0h-128c-25.6 0-42.666-17.067-42.666-42.667s17.066-42.666 42.666-42.666h128c25.6 0 42.667 17.066 42.667 42.666S366.933 768 341.333 768zM768 768h-85.333c-25.6 0-42.667-17.067-42.667-42.667s17.067-42.666 42.667-42.666H768c25.6 0 42.667 17.066 42.667 42.666S793.6 768 768 768z m-554.667 0C93.867 768 0 674.133 0 554.667s93.867-213.334 213.333-213.334C238.933 341.333 256 358.4 256 384s-17.067 42.667-42.667 42.667c-72.533 0-128 55.466-128 128s55.467 128 128 128c25.6 0 42.667 17.066 42.667 42.666S238.933 768 213.333 768zM512 938.667c-25.6 0-42.667-17.067-42.667-42.667V469.333c0-25.6 17.067-42.666 42.667-42.666s42.667 17.066 42.667 42.666V896c0 25.6-17.067 42.667-42.667 42.667zM384 640c-12.8 0-21.333-4.267-29.867-12.8-17.066-17.067-17.066-42.667 0-59.733l128-128c17.067-17.067 42.667-17.067 59.734 0s17.066 42.666 0 59.733l-128 128C405.333 635.733 396.8 640 384 640z m256 0c-12.8 0-21.333-4.267-29.867-12.8l-128-128c-17.066-17.067-17.066-42.667 0-59.733s42.667-17.067 59.734 0l128 128c17.066 17.066 17.066 42.666 0 59.733C661.333 635.733 652.8 640 640 640z" fill="#b9b9b9" p-id="2815"></path></svg>`,
                    //   // click() {console.log('upload')},
                    // },
                    "link",
                    "|",
                    "quote",
                    "line",
                    "|",
                    "preview",
                    "edit-mode",
                    "undo",
                    "redo",
                    "fullscreen",
                  ],
              toolbarConfig: {
                pin: true,
              },
              cdn: 'https://file.dicecho.com/lib/vditor@3.7.5',
              cache: {
                enable: false,
              },
              upload: {
                url: '/api/file/upload/',
                handler: (files: File[]) => {
                  upload(files[0]);
                  return null;
                },
              },
              preview: {
                mode: "editor",
              },
              mode: "ir",
              value: defaultValue,
              // input: (v) => setInnerValue(v),
              input: (value: string) => onChange(value),
              after() {
                setInitialized(true);
                // if (!editorRef.current) return;
                // editorRef.current.setValue(editorProps?.value || '');
              },
              ...editorProps,
            });
            // vditor.setTheme(editorProps?.theme || "dark");
            editorRef.current = vditor;
            // editorRef.current.vditor.lute.SetJSRenderers({
            //   renderers: {
            //     HTML2VditorDOM: {
            //       renderHTML: (node, entering) => {
            //         console.log(node)
            //         console.log(entering)
            //         if (entering) {
            //           return [`<div>`, Lute.WalkContinue]
            //         }
            //         return [`</div>`, Lute.WalkContinue]
            //         // if (entering) {
            //         //   return [`<h${node.__internal_object__.HeadingLevel} class="vditor__heading"><span class="prefix"></span><span>`, Lute.WalkContinue];
            //         // } else {
            //         //   return [`</span></h${node.__internal_object__.HeadingLevel}>`, Lute.WalkContinue];
            //         // }
            //       },
            //     }
            //   }
            // })

          }}
        />
        <div className={styles.actionBar}>
          {showUploader &&
            <Upload
              name="imageuploader"
              accept=".jpg,.png,.jpeg"
              showUploadList={false}
              multiple={false}
              beforeUpload={beforeUpload}
              className={styles.uploadBar}
              disabled={uploading}
            >
              <div className={styles.uploadContent}>
                {uploading ? (
                  <div>
                    <Spin style={{ marginRight: 8 }} size="small" />
                    正在上传...
                  </div>
                ) : (
                  "点击或者拖拽图片到此来上传图片"
                )}
              </div>
            </Upload>
          }
          {action}
        </div>
      </div>
    );
  }
);

export { Vditor, MarkdownRender };
