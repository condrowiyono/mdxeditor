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
  contentExist,
  type Content,
  fillContent,
} from "./stores/content";
import { Modal, Select, Space, Table } from "antd";
import dayjs from "dayjs";
import { getFiles } from "./services/files";

const formatPath = (content: Content) => {
  let path = content.path;

  if (content.isCreated) {
    path += " (created)";
  }

  if (content.isDeleted) {
    path += " (deleted)";
  }

  if (content.isEdited) {
    path += " (edited)";
  }

  if (content.newPath) {
    path += ` (${content.newPath})`;
  }

  return path;
};

const getAction = (d: Content) => {
  if (d.isCreated) return "create";
  if (d.isDeleted) return "delete";
  if (d.newPath) return "move";

  return "update";
};

const CommitMessage = (props: { commit: string; touched: Content[] }) => {
  const { commit, touched } = props;

  return (
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
            title: "Actions",
            dataIndex: "path",
            render: (_, record) => getAction(record),
          },
        ]}
      />
    </div>
  );
};

const App = () => {
  const [path, setPath] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<Content | undefined>(undefined);
  const [branch, setBranch] = useState<string>("main");

  const contents = useStore($contents);
  const touched = useStore($touched);

  const { data: branches } = useRequest(getBranches);

  const { loading: loadingTree, run: fetch } = useRequest(getTree, {
    onSuccess: initContents,
    onFinally: () => setPath(undefined),
  });

  const { loading: loadingFile, run: fetchFile } = useRequest(getFiles, {
    manual: true,
    onSuccess: (data, params) => {
      const path = params[0]?.path;
      if (path) {
        fillContent(path, data);
        setPath(path);
      }
    },
  });

  const { run: runCommit, loading: loadingCommit } = useRequest(commits, {
    manual: true,
    onSuccess: () => {
      fetch();
      setPath(undefined);
    },
  });

  const handleAdd = (path: string) => {
    addContent(path);
  };

  const handleRename = (oldPath: string, newPath: string) => {
    renameContent(oldPath, newPath);
    setPath(undefined);
  };

  const handleDelete = (path: string) => {
    deleteContent(path);
    setPath(undefined);
  };

  const handleUndo = (path: string) => {
    undoContent(path);
    setPath(undefined);
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
    if (touched.length === 0) {
      Modal.info({ title: "Commit", content: "No changes to commit" });
      return;
    }

    Modal.confirm({
      title: "Commit",
      width: 800,
      content: <CommitMessage commit={commit} touched={touched} />,
      okButtonProps: { loading: loadingCommit },
      onOk: () => {
        const date = dayjs().format("YYYYMMDDHHmmss");

        runCommit({
          branch: `update-${date}`,
          start_branch: branch,
          commit_message: commit,
          actions: touched.map((d) => {
            const action = getAction(d);

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
    const pathName = key as string;

    if (contentExist(pathName)) {
      setPath(pathName);
    } else {
      fetchFile({ path: pathName, ref: branch });
    }

    // empty content, cause Editor need to be re-rendered
    setContent(undefined);
  };

  useEffect(() => {
    const content = getContent(path as string);
    setContent(content);
  }, [path]);

  return (
    <>
      <div>
        <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
          <Panel defaultSize={25}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select a branch"
                onChange={handleFetchBranch}
                value={branch}
                options={branches?.map(({ name }) => ({
                  label: name,
                  value: name,
                }))}
              />
              {loadingTree && <Loading />}
              <Directory
                multiple={false}
                treeData={contents.map((d) => ({
                  key: d.path,
                  title: formatPath(d),
                  isLeaf: true,
                }))}
                selectedKeys={path ? [path] : []}
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
            {loadingFile && <Loading />}
            {content && (
              <Editor
                markdown={content.newContent || content.content || ""}
                diffMarkdown={content.content || ""}
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
