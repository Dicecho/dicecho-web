import React from "react";
import { observer } from "mobx-react";
import { Modal, Drawer } from "antd";
import { ModalProps } from 'antd/lib/modal'
import { DrawerProps } from 'antd/lib/drawer'
import UIStore from '@/shared/stores/UIStore';

interface IProps {
  modalProps: ModalProps,
  drawerProps: DrawerProps,
}

const ResponsiveModal: React.FC<IProps> = observer(({
  children,
  modalProps,
  drawerProps,
  ...props
}) => {
  if (UIStore.isMobile) {
    return (
      <Drawer {...drawerProps}>
        {children}
      </Drawer>
    )
  }

  return (
    <Modal {...modalProps}>
      {children}
    </Modal>
  )
});

export default ResponsiveModal;
