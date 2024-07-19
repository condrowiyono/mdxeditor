import { Key, useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, Space, Tree } from "antd";
import type { InputRef, ModalProps, TreeProps } from "antd";

const { DirectoryTree } = Tree;

type SelectProps = TreeProps["onSelect"];

interface DirectoryProps extends TreeProps {
  onSingleSelect?: (key: Key) => void;
  onAdd?: (path: string) => void;
  onRename?: (path: string, newPath: string) => void;
  onDelete?: (path: string) => void;
  onCommit?: (commit: string) => void;
  onUndo?: (path: string) => void;
}

interface RenameModalProps extends ModalProps {
  oldValue?: string;
  onSubmit?: ({ path, newPath }: { path: string; newPath: string }) => void;
}

const RenameModal = ({
  oldValue,
  open,
  onSubmit,
  ...rest
}: RenameModalProps) => {
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm<{ path: string; newPath: string }>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ path: oldValue, newPath: oldValue });
    }
  }, [form, open, oldValue]);

  return (
    <Modal
      title="Rename"
      open={open}
      onOk={form.submit}
      afterOpenChange={(open) => open && inputRef.current?.focus()}
      {...rest}
    >
      <Form form={form} onFinish={onSubmit}>
        <Form.Item label="Path" name="path">
          <Input disabled />
        </Form.Item>
        <Form.Item label="New Path" name="newPath">
          <Input ref={inputRef} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface AddModalProps extends ModalProps {
  onSubmit?: ({ path }: { path: string }) => void;
}

const AddModal = ({ open, onSubmit, ...rest }: AddModalProps) => {
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm<{ path: string }>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  return (
    <Modal
      title="Add"
      open={open}
      afterOpenChange={(open) => open && inputRef.current?.focus()}
      onOk={form.submit}
      {...rest}
    >
      <Form
        onFinish={onSubmit}
        form={form}
        initialValues={{ path: "src/contents/" }}
      >
        <Form.Item label="Path" name="path">
          <Input ref={inputRef} autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface CommitModalProps extends ModalProps {
  onSubmit?: ({ commit }: { commit: string }) => void;
}

const CommitModal = ({ open, onSubmit, ...rest }: CommitModalProps) => {
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm<{ commit: string }>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [form, open]);

  return (
    <Modal
      title="Commit"
      open={open}
      afterOpenChange={(open) => open && inputRef.current?.focus()}
      onOk={form.submit}
      {...rest}
    >
      <Form
        onFinish={onSubmit}
        form={form}
        initialValues={{ path: "src/contents/" }}
      >
        <Form.Item label="Commit" name="commit">
          <Input ref={inputRef} autoFocus />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Directory = ({
  onSelect,
  onSingleSelect,
  onRename,
  onAdd,
  onDelete,
  onCommit,
  onUndo,
  ...rest
}: DirectoryProps) => {
  const [selectedKeys, setSelectedKeys] = useState<Key>();
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [commitModalVisible, setCommitModalVisible] = useState(false);

  const handleSelect: SelectProps = (keys, info) => {
    if (keys.length === 1) {
      const key = keys[0];
      setSelectedKeys(key);

      onSingleSelect?.(key);
    }

    onSelect?.(keys, info);
  };

  const handleRename = () => {
    setRenameModalVisible(true);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure to delete this file?",
      onOk: () => onDelete?.(String(selectedKeys)),
    });
  };

  const handleAdd = () => {
    setAddModalVisible(true);
  };

  const handleCommit = () => {
    setCommitModalVisible(true);
  };

  const handleUndo = () => {
    Modal.confirm({
      title: "Undo",
      content: "Are you sure to undo the changes of this file?",
      onOk: () => onUndo?.(String(selectedKeys)),
    });
  };

  return (
    <div>
      <Space>
        <Button disabled={!selectedKeys} onClick={handleRename}>
          Rename
        </Button>
        <Button disabled={!selectedKeys} onClick={handleDelete}>
          Delete
        </Button>
        <Button disabled={!selectedKeys} onClick={handleUndo}>
          Undo
        </Button>
        <Button onClick={handleAdd}>Add</Button>
        <Button onClick={handleCommit}>Commit</Button>
      </Space>
      <DirectoryTree defaultExpandAll onSelect={handleSelect} {...rest} />

      <RenameModal
        destroyOnClose
        open={renameModalVisible}
        onCancel={() => setRenameModalVisible(false)}
        oldValue={String(selectedKeys)}
        onSubmit={({ path, newPath }) => {
          onRename?.(path, newPath);
          setRenameModalVisible(false);
        }}
      />

      <AddModal
        destroyOnClose
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSubmit={({ path }) => {
          onAdd?.(path);
          setAddModalVisible(false);
        }}
      />

      <CommitModal
        destroyOnClose
        open={commitModalVisible}
        onCancel={() => setCommitModalVisible(false)}
        onSubmit={({ commit }) => {
          onCommit?.(commit);
          setCommitModalVisible(false);
        }}
      />
    </div>
  );
};

export default Directory;
