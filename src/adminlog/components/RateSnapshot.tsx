import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";
import {
  Rate,
  Button,
} from "antd";
import { MarkdownRender } from "@/shared/components/MarkdownEditor";
import styles from "./RateSnapshot.module.less";

interface IProps {
  remark: string;
  score: number;
  authorNickname: string;
}

const FOLD_LIMIT = 150;

const RateSnapshot: React.FC<IProps> = observer(
  ({
    score,
    remark,
    authorNickname,
  }) => {
    const [isFold, setIsFold] = useState(remark.length > FOLD_LIMIT);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setIsFold(remark.length > FOLD_LIMIT);
    }, [remark]);


    const renderContent = () => {
      return (
        <React.Fragment>
          <div
            className={`${styles.cardContent} ${
              isFold ? styles.foldContent : ""
            }`}
          >
            <MarkdownRender content={remark} />
          </div>
          {remark.length > FOLD_LIMIT && (
            <div
              className={`${styles.foldAction} ${
                isFold ? styles.fold : styles.unfold
              }`}
            >
              <Button
                type="primary"
                onClick={() => {
                  if (!isFold && headerRef.current) {
                    window.scrollTo(
                      0,
                      headerRef.current.getBoundingClientRect().y +
                        window.scrollY
                    );
                  }
                  setIsFold(!isFold);
                }}
              >
                {isFold ? "展开完整评价" : "折叠评价"}
              </Button>
            </div>
          )}
        </React.Fragment>
      );
    };

    return (
      <div className={styles.rateItem}>
        <div ref={headerRef} />
        <div>
          {authorNickname}
        </div>
        {score > 0 && (
          <Rate
            className={styles.cardRate}
            allowHalf
            value={score / 2}
            disabled
          />
        )}
        {renderContent()}
      </div>
    );
  }
);

export default RateSnapshot;
