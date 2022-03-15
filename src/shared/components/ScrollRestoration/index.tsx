import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useIsMounted } from "react-tidy";
import useScrollPosition from "@/shared/hooks/useScrollPosition";
import MemoryStore from "@/shared/stores/MemoryStore";
import { ScrollRestorationStore } from "./ScrollRestorationStore";
import _ from 'lodash';

export interface IProps {
  uniqueKey: string,
  disabled?: boolean,
}

const ScrollRestoration: React.FC<IProps> = observer(({
  uniqueKey, 
  disabled = false,
}) => {
  const isMounted = useIsMounted();

  const store: ScrollRestorationStore = (() => {
    const cacheKey = `scroll-${uniqueKey}`;
    if (MemoryStore.hasStore(cacheKey)) {
      return MemoryStore.stores[cacheKey] as ScrollRestorationStore;
    }

    const nStore = new ScrollRestorationStore()
    MemoryStore.addStore(cacheKey, nStore);

    return nStore;
  })()

  const [jumped, setJumped] = useState(false);

  useScrollPosition((top) => {
    setTimeout(() => {
      if (!isMounted()) {
        return;
      }
      store.setScrollPosition(top)
    }, 200);
  });

  useEffect(() => {
    if (jumped || disabled) {
      return;
    }

    window.scrollTo(0, store.scrollPosition);
    setJumped(true);
  }, [jumped, disabled])

  return null;
});

export default ScrollRestoration