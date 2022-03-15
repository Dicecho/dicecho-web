import React, { HTMLAttributes, useState } from "react";
import classnames from 'classnames';
import { observer } from "mobx-react";
import { ModuleEventModal } from './ModuleEventModal';
import { IModDto } from '@/interfaces/shared/api';
import styles from "./ModuleEvent.module.less";
import { EventDto } from "@/home/stores/HomePageStore";


interface IProps extends HTMLAttributes<HTMLDivElement> {
  mod: IModDto,
  event: EventDto,
}

export const ModuleEvent: React.FC<IProps> = observer(({
  mod,
  event,
  style,
  className,
  ...props
}) => {
  const [eventModalVisible, setEventModalVisible] = useState(false);

  return (
    <>
      <div 
        className={classnames(styles.eventImage, className)} 
        style={{ ...style, backgroundImage: `url(${event.imageUrl})` }}
        onClick={() => {
          if (event.action === 'hldxya') {
            setEventModalVisible(true)
          }
        }}
        {...props}
      />
      <ModuleEventModal 
        visible={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
      />
    </>
  )
});
