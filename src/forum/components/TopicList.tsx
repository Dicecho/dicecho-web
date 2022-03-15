import { ITopicDto, TopicListQuery } from "@/forum/stores/TopicStore";
import InfiniteScrollWrapper, {
  InfiniteScrollWrapperProps,
} from "@/shared/components/InfiniteScrollWrapper";
import { observer } from "mobx-react";
import React from "react";

interface IProps
  extends InfiniteScrollWrapperProps<ITopicDto, TopicListQuery> {}

const TopicList: React.FC<IProps> = observer((props) => {
  return <InfiniteScrollWrapper<ITopicDto, TopicListQuery> {...props} />;
});
export default TopicList;
