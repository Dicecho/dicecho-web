import React, { HTMLAttributes } from 'react';
import { throttleByAnimationFrame } from 'antd/lib/_util/throttleByAnimationFrame';
import { isWindow } from 'antd/lib/_util/getScroll';
const addEventListener = require('rc-util/lib/Dom/addEventListener').default;

function getScroll(
  target: HTMLElement | Window | Document | null,
  top: boolean,
): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  const method = top ? 'scrollTop' : 'scrollLeft';
  let result = 0;
  if (isWindow(target)) {
    result = (target as Window)[top ? 'pageYOffset' : 'pageXOffset'];
  } else if (target instanceof Document) {
    result = target.scrollingElement ? target.scrollingElement[method] : 0;
  } else if (target) {
    result = (target as HTMLElement)[method];
  }

  if (target && !isWindow(target) && typeof result !== 'number') {
    result = ((target as HTMLElement).ownerDocument || (target as Document)).documentElement?.[
      method
    ];
  }

  return result;
}

function useScrollPosition(
  onCallback: (top: number) => any,
  target?: () => HTMLElement | Window | Document,
) {
  const scrollEvent = React.useRef<any>();

  const handleScroll = throttleByAnimationFrame(
    (e: React.UIEvent<HTMLElement> | { target: any }) => {
      const scrollTop = getScroll(e.target, true);
      onCallback(scrollTop);
    },
  );

  const bindScrollEvent = () => {
    const container = target ? target() : window;
    scrollEvent.current = addEventListener(container, 'scroll', (e: React.UIEvent<HTMLElement>) => {
      handleScroll(e);
    });
    handleScroll({
      target: container,
    });
  };

  React.useEffect(() => {
    bindScrollEvent();
    return () => {
      if (scrollEvent.current) {
        scrollEvent.current.remove();
      }
      (handleScroll as any).cancel();
    };
  }, [target]);
}

export default useScrollPosition;