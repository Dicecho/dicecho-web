import React, { useState } from "react";
import { observer } from "mobx-react";
import { IModDto } from "interfaces/shared/api";
import { Error } from "@/shared/components/Empty";
import ModuleWidget from "@/module/components/ModuleWidget";
import ModuleStore from "../stores/ModuleStore";
import { Modal, Spin, Input } from "antd";
import _ from "lodash";

const { Search } = Input;

interface IProps {
  visible: boolean;
  onCancel: () => void;
  defaultInput?: string;
  onSelect: (mod: IModDto) => any;
}

const ModuleSearchModal: React.FunctionComponent<IProps> = observer(
  ({ defaultInput = "", ...props }) => {
    const [lastSearch, setLastSearch] = useState(defaultInput);
    const [searching, setSearching] = useState(false);
    const [result, setResult] = useState<Array<IModDto>>([]);

    const handleSearch = (value: string) => {
      if (searching) {
        return;
      }

      setLastSearch(value);
      if (value === "") {
        setResult([]);
        return;
      }

      setSearching(true);
      ModuleStore.fetchModuleList({ keyword: value })
        .then((res) => {
          setResult(res.data);
        })
        .finally(() => {
          setSearching(false);
        });
    };

    const handleInput = _.debounce((e: any) => {
      handleSearch(e.target.value);
    }, 800);

    return (
      <Modal
        visible={props.visible}
        onCancel={props.onCancel}
        centered
        title={null}
        footer={null}
        closable={false}
      >
        <Search
          // value={text}
          onChange={handleInput}
          onSearch={(value) => handleSearch(value)}
          placeholder={"在此输入模组的名称/简介/作者来搜索"}
          style={{ marginBottom: 16 }}
        />
        <div style={{ minHeight: 400, maxHeight: 400, overflowY: "scroll" }}>
          {searching ? (
            <div
              style={{
                width: "100%",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin />
            </div>
          ) : result.length === 0 ? (
            <Error
              text={lastSearch === "" ? "看上面输入框，别看我" : "好像没搜到"}
            />
          ) : (
            result.map((mod) => (
              <div key={mod._id} onClick={() => props.onSelect(mod)}>
                <ModuleWidget mod={mod} tiny />
              </div>
            ))
          )}
        </div>
      </Modal>
    );
  }
);

export default ModuleSearchModal;
