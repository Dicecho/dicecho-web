import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { Spin } from "antd";
import { Select } from '@/lib/antd';
import { SelectProps, LabeledValue } from "antd/lib/select";
import _ from "lodash";

type ValueType = LabeledValue | LabeledValue[]

export interface DebounceSelectProps extends SelectProps<ValueType> {
  fetchOptions: (value: string) => Promise<Array<LabeledValue>>;
  debounceTimeout?: number;
  defaultOptions?: Array<LabeledValue>;
}


export default observer(function DebounceSelect({
  fetchOptions,
  debounceTimeout = 300,
  defaultOptions = [],
  ...props
}: DebounceSelectProps) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<Array<LabeledValue>>(defaultOptions);
  const fetchRef = React.useRef(0);
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return _.debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
})