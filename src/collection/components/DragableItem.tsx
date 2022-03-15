import React, { FC, useRef, HTMLAttributes } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  id: any
  index: number
  move: (dragIndex: number, hoverIndex: number) => void,
  dragable?: boolean
}

interface DragItem {
  index: number
  id: string
  type: string
}


const style = {
  cursor: 'move',
}


const DndItemType = 'modWidget'

export const DragableItem: FC<CardProps> = ({ id, index, move, dragable = false, children, style: htmlStyle, ...props }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop({
    accept: DndItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      if (!dragable) {
        return;
      }

      const dragIndex = item.index
      const hoverIndex = index


      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      move(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: DndItemType,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  if (dragable) {
    drag(drop(ref))
  }

  return (
    <div ref={ref} style={{ ...style, opacity, ...htmlStyle }} data-handler-id={handlerId} {...props}>
      {children}
    </div>
  )
}
