import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";

const { DirectoryTree } = Tree;

type DirectoryProps = TreeProps & {
  contents: { [key: string]: unknown };
};

const Directory = ({ contents, ...rest }: DirectoryProps) => {
  const treeData: TreeDataNode[] = Object.keys(contents).map((key) => {
    const path = key.split("/").slice(2).join("/");
    return {
      title: path,
      key,
      isLeaf: true,
    };
  }, []);

  return <DirectoryTree defaultExpandAll treeData={treeData} {...rest} />;
};

export default Directory;
