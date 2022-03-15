import React from "react";
import { observer } from "mobx-react";
import _ from "lodash";
import DebounceSelect, { DebounceSelectProps } from './DebounceSelect';
import { LabeledValue } from "antd/lib/select";
import TagStore from '@/shared/stores/TagStore';

export type { LabeledValue }


interface Props extends Omit<DebounceSelectProps, 'mode' | 'fetchOptions' | 'value' | 'onChange' | 'defaultOptions'> {
  value?: string[];
  onChange?: (value: string[]) => any;
  recommendTagOptions?: string[];
}

const tagToValue = (tags: Array<LabeledValue>) => {
  return tags.map((tag) => tag.value.toString())
}

const valueToTag = (value: string[]) => {
  return value.map(v => ({
    label: v, value: v,
  }))
}

const TagSelect: React.FunctionComponent<Props> = observer(({
  value = [],
  onChange = () => {},
  placeholder='添加标签',
  recommendTagOptions=[],
  ...props
}) => {

  const fetchTags = (keyword: string) => {
    return TagStore.fetchTag({ keyword }).then((res) => valueToTag(res.data.data.map(tag => tag.name)))
  }

  return (
    <DebounceSelect
      fetchOptions={(keyword) => fetchTags(keyword)}
      mode='tags'
      value={valueToTag(value)}
      onChange={(value) => onChange(tagToValue(Array.isArray(value) ? value : [value]))}
      placeholder={placeholder}
      defaultOptions={valueToTag(recommendTagOptions)}
      {...props}
    />
  )
})

export default TagSelect