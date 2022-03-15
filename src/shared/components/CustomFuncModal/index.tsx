import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { globalConfig } from 'antd/lib/config-provider';
import destroyFns from 'antd/lib/modal/destroyFns';
import { ModalFuncProps } from 'antd/lib/modal/Modal';

let defaultRootPrefixCls = '';

function getRootPrefixCls() {
  return defaultRootPrefixCls;
}

// type ConfigUpdate = TopicPostModalProps | ((prevConfig: TopicPostModalProps) => TopicPostModalProps);

export default function openFuncModal<P extends ModalFuncProps>(config: P, Component: React.ComponentClass<P> | React.FunctionComponent<P>) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let currentConfig = { ...config, onCancel: close, close, visible: true } as any;

  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function render({ okText, cancelText, prefixCls: customizePrefixCls, ...props }: any) {
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    setTimeout(() => {
      const { getPrefixCls } = globalConfig();
      // because Modal.config  set rootPrefixCls, which is different from other components
      const rootPrefixCls = getPrefixCls(undefined, getRootPrefixCls());
      const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`;

      ReactDOM.render(
        <Component
          {...props}
        />,
        div,
      );
    });
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: () => {
        // @ts-ignore
        destroy.apply(this, args);
      },
    };
    render(currentConfig);
  }

  function update(configUpdate: P | ((prevConfig: P) => P)) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      };
    }
    render(currentConfig);
  }

  render(currentConfig);

  destroyFns.push(close);

  return {
    destroy: close,
    update,
  };
}
