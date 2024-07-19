import { Key, useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useStore } from "@nanostores/react";

import Directory from "./components/Directory";
import Editor from "./components/Editor";
import Loading from "./components/Loading";
import { commits, getBranches, getTree } from "./services";

import {
  $contents,
  $touched,
  getContent,
  initContents,
  addContent,
  renameContent,
  deleteContent,
  updateContent,
  undoContent,
  type Content,
} from "./stores/content";
import { Modal, Select, Space, Table } from "antd";
import dayjs from "dayjs";

const formatPath = (content: Content) => {
  let path = content.path;
  if (content.newPath) {
    path += ` (${content.newPath})`;
  }

  if (content.isDeleted) {
    path += " (deleted)";
  }

  if (content.isEdited) {
    path += " (edited)";
  }

  if (content.isCreated) {
    path += " (created)";
  }

  return path;
};

const App = () => {
  const [key, setKey] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<Content | undefined>(undefined);
  const [branch, setBranch] = useState<string>("main");

  const contents = useStore($contents);
  const touched = useStore($touched);

  const { loading, run: fetch } = useRequest(getTree, {
    onSuccess: initContents,
    onFinally: () => {
      setKey(undefined);
    },
  });

  const { data: branches } = useRequest(getBranches);

  const { run: runCommit, loading: loadingCommit } = useRequest(commits, {
    manual: true,
    onSuccess: () => {
      fetch();
      setKey(undefined);
    },
  });

  const handleAdd = (path: string) => {
    addContent(path);
  };

  const handleRename = (oldPath: string, newPath: string) => {
    renameContent(oldPath, newPath);
    setKey(undefined);
  };

  const handleDelete = (path: string) => {
    deleteContent(path);
    setKey(undefined);
  };

  const handleUndo = (path: string) => {
    undoContent(path);
    setKey(undefined);
  };

  const handleUpdateContent = (newContent: string) => {
    if (newContent === content?.content) {
      return;
    }

    if (content) {
      updateContent(content.path, newContent);
    }
  };

  const handleFetchBranch = (branch: string) => {
    setBranch(branch);

    fetch({ ref: branch });
  };

  const handleCommit = (commit: string) => {
    Modal.confirm({
      title: "Commit",
      width: 800,
      content: (
        <div>
          <p>Are you sure to commit the changes?</p>
          <p>Commit message: {commit}</p>
          <Table
            size="small"
            dataSource={touched}
            rowKey={(d) => d.path}
            pagination={false}
            columns={[
              {
                title: "Path",
                dataIndex: "path",
              },
              {
                title: "Is Edited",
                dataIndex: "isEdited",
                render: (d) => (d ? "Yes" : "No"),
              },
              {
                title: "Is Deleted",
                dataIndex: "isDeleted",
                render: (d) => (d ? "Yes" : "No"),
              },
              {
                title: "Is Created",
                dataIndex: "isCreated",
                render: (d) => (d ? "Yes" : "No"),
              },
            ]}
          />
        </div>
      ),
      okButtonProps: { loading: loadingCommit },
      onOk: () => {
        const date = dayjs().format("YYYYMMDDHHmmss");

        runCommit({
          branch: `main-${date}`,
          start_branch: branch,
          commit_message: commit,
          actions: touched.map((d) => {
            const action = d.isCreated
              ? "create"
              : d.isDeleted
              ? "delete"
              : d.newPath
              ? "move"
              : "update";

            const file_path = d.newPath || d.path;
            const previous_path = action === "move" ? d.path : undefined;
            const content = action !== "delete" ? d.newContent : d.content;

            return { action, file_path, previous_path, content };
          }),
        });
      },
    });
  };

  const handleSelect = (key: Key) => {
    setKey(key as string);

    // empty content, cause Editor need to be re-rendered
    setContent(undefined);
  };

  useEffect(() => {
    const content = getContent(key as string);
    setContent(content);
  }, [key]);

  return (
    <>
      {loading && <Loading />}
      <div>
        <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
          <Panel defaultSize={25}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Select
                style={{ width: "100%" }}
                options={branches?.map((value) => ({ label: value, value }))}
                placeholder="Select a branch"
                onChange={handleFetchBranch}
                value={branch}
              />
              <Directory
                multiple={false}
                treeData={contents.map((d) => ({
                  key: d.path,
                  title: formatPath(d),
                  isLeaf: true,
                }))}
                onSingleSelect={handleSelect}
                onRename={handleRename}
                onAdd={handleAdd}
                onDelete={handleDelete}
                onCommit={handleCommit}
                onUndo={handleUndo}
              />
            </Space>
          </Panel>
          <PanelResizeHandle style={{ borderRight: "1px solid #111" }} />
          <Panel defaultSize={75} style={{ overflow: "auto" }}>
            {content && (
              <Editor
                markdown={content.newContent || content.content}
                diffMarkdown={content.content}
                onSave={handleUpdateContent}
              />
            )}
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
};

export default App;
