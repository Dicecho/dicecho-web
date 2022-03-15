import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CSSProp } from "styled-components";
import TextareaAutosize from "react-textarea-autosize";
import { setNodes } from "@udecode/plate-core";
import { getRootProps } from "@udecode/plate-styled-components";
import { Resizable } from "re-resizable";
import { Node, Transforms } from "slate";
import { ReactEditor, useFocused, useSelected, useReadOnly } from "slate-react";
import {
  ImageElementProps,
  ImageHandle,
  getImageElementStyles,
} from "@udecode/plate-ui-image";

declare module "react" {
  interface Attributes {
    css?: CSSProp;
  }
}

export const CustomImageElement = (props: ImageElementProps) => {
  const readOnly = useReadOnly();

  const {
    attributes,
    children,
    element,
    nodeProps,
    caption = {},
    resizableProps = {
      minWidth: 92,
    },
    align = "center",
    draggable,
    editor,
  } = props;

  const rootProps = getRootProps(props);

  const { placeholder = "这里可以写图片说明..." } = caption;

  const {
    url,
    width: nodeWidth = "100%",
    caption: nodeCaption = [{ children: [{ text: "" }] }],
  } = element;
  const focused = useFocused();
  const selected = useSelected();
  const [width, setWidth] = useState(nodeWidth);
  const [_caption, setCaption] = useState(nodeCaption[0].text);
  const [isComposition, setComposition] = useState(false);

  useEffect(() => {
    setCaption(nodeCaption[0].text)
  }, [nodeCaption[0].text])

  useEffect(() => {
    setWidth(nodeWidth);
  }, [nodeWidth]);

  const styles = getImageElementStyles({ ...props, align, focused, selected });

  const setNodeWidth = useCallback(
    (w: number) => {
      const path = ReactEditor.findPath(editor, element);

      if (w === nodeWidth) {
        // Focus the node if not resized
        Transforms.select(editor, path);
      } else {
        setNodes(editor, { width: w }, { at: path });
      }
    },
    [editor, element, nodeWidth]
  );

  const onChangeCaption = useCallback(
    (value: string) => {
      const path = ReactEditor.findPath(editor as ReactEditor, element);
      setNodes(editor, { caption: [{ text: value }] }, { at: path });
    },
    [editor, element]
  );

  const captionString = useMemo(() => {
    return Node.string(nodeCaption[0]) || "";
  }, [nodeCaption]);

  return (
    <div
      {...attributes}
      css={styles.root.css}
      className={styles.root.className}
      {...rootProps}
      {...nodeProps}
    >
      <div contentEditable={false}>
        <figure
          css={styles.figure?.css}
          className={`group ${styles.figure?.className}`}
        >
          <Resizable
            // @ts-ignore
            css={styles.resizable?.css}
            className={styles.resizable?.className}
            size={{ width, height: "100%" }}
            maxWidth="100%"
            lockAspectRatio
            resizeRatio={align === "center" ? 2 : 1}
            enable={readOnly 
              ? {}
              : {
                left: ["center", "left"].includes(align),
                right: ["center", "right"].includes(align),
              }
            }
            handleComponent={{
              left: (
                <ImageHandle
                  css={[styles.handleLeft?.css]}
                  className={styles.handleLeft?.className}
                />
              ),
              right: (
                <ImageHandle
                  css={styles.handleRight?.css}
                  className={styles.handleRight?.className}
                />
              ),
            }}
            handleStyles={{
              left: { left: 0 },
              right: { right: 0 },
            }}
            onResize={(e, direction, ref) => {
              setWidth(ref.offsetWidth);
            }}
            onResizeStop={(e, direction, ref) => setNodeWidth(ref.offsetWidth)}
            {...resizableProps}
          >
            <img
              data-testid="ImageElementImage"
              css={styles.img?.css}
              className={styles.img?.className}
              src={url}
              alt={captionString}
              draggable={draggable}
              {...nodeProps}
            />
          </Resizable>

          {!caption.disabled && (captionString.length || selected) && (
            <figcaption
              style={{ width }}
              css={styles.figcaption?.css}
              className={styles.figcaption?.className}
            >
              <TextareaAutosize
                css={styles.caption?.css}
                className={styles.caption?.className}
                disabled={readOnly}
                value={_caption}
                placeholder={placeholder}
                onCompositionEnd={() => {
                  setComposition(false)
                  onChangeCaption(_caption);
                }}
                onChange={e => {
                  setCaption(e.target.value);
                  if (!isComposition) {
                    onChangeCaption(e.target.value);
                  }
                }}
              />
            </figcaption>
          )}
        </figure>
      </div>
      {children}
    </div>
  );
};
