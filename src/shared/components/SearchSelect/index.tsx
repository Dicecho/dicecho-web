
import React, { useState } from 'react';
import { Select, SelectProps } from 'antd';
import _ from 'lodash';

const { Option } = Select;

type SearchResult = {
  value: string,
  label: any,
}

interface IProps extends SelectProps<string> {
  onSearch: (value: string) => Promise<Array<SearchResult>>,
  onChanged: (value: string | number) => any,
}

export const SearchSelect: React.FC<IProps> = ({ onSearch, onChanged, ...props }) => {
  const [data, setData] = useState<Array<SearchResult>>([]);
  const [value, setValue] = useState<string>();

  const handleSearch = _.debounce((text: string) => {
    if (text) {
      onSearch(text).then((res) => {
        setData(res)
      });
    } else {
      setData([]);
    }
  }, 300);

  const handleChange = (value: string) => {
    setValue(value);
    console.log(value)
    onChanged(value)
  };
  const options = data.map(d => <Option key={d.value} value={d.value}>{d.label}</Option>);

  return (
    <Select
      showSearch
      value={value}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      {...props}
    >
      {options}
    </Select>
  );
};
