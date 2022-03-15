import React, { HTMLAttributes, useEffect, useState } from 'react';
import LikeStore from '@/shared/stores/LikeStore';


export interface IDeclareProps {
  attitude: string;
  isActive?: boolean,
  count?: number,
  onDeclareOrCancel?: (key: string) => Promise<{
    declareCounts: Record<string, number>,
    declareStatus: Record<string, boolean>,
  }>
}


interface IProps {
  declareCounts: Record<string, number>,
  declareStatus: Record<string, boolean>,
  targetName: string,
  targetId: string,
}


const DeclareButtonGroup: React.FC<IProps> = ({
  declareCounts,
  declareStatus,
  targetName,
  targetId,
  children,
  ...props
}) => {
  const [ctx, setCtx] = useState<{
    declareCounts: Record<string, number>,
    declareStatus: Record<string, boolean>,
  }>({
    declareCounts,
    declareStatus,
  });

  useEffect(() => {
    setCtx({
      declareCounts,
      declareStatus,
    })
  }, [declareCounts, declareStatus])

  const onDeclareOrCancel = (key: string) => {
    return LikeStore.declareOrCancel(targetName, targetId, key, ctx.declareStatus[key]).then((res) => {
      setCtx(preCtx => ({
        ...preCtx,
        declareCounts: res.data.declareCounts,
        declareStatus: res.data.declareStatus,
      }))

      return res.data;
    })
  }


  return (
    <React.Fragment>
      {
        // children 不是数组我们需要用 React.Children.map 来遍历
        // 或者把它转成数组
        React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return null
          }


          // 这里我们通常还会判断 child 的类型来确定是不是要传递相应的数据，这里我就不做了
          const childProps = {
            ...child.props,
            isActive: ctx.declareStatus[child.props.attitude] || false,
            count: ctx.declareCounts[child.props.attitude] || 0,
            onDeclareOrCancel,
          }

          return React.cloneElement(child, childProps)
        })
      }
    </React.Fragment>
  )
}

export { DeclareButtonGroup };
