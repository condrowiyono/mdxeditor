import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Directory from "./components/Directory";
import Editor from "./components/Editor";
import { Key, useEffect, useState } from "react";

const contents = import.meta.glob("./contents/**/*.(md|mdx)", {
  query: "?raw",
});

const App = () => {
  const [selectedFile, setSelectedFile] = useState<Key | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const handleSelect = (selectedKeys: Key[]) => {
    setSelectedFile(selectedKeys[0]);
    setSelectedContent(null);
  };

  useEffect(() => {
    if (selectedFile) {
      const get = async () => {
        const content = await contents[selectedFile as string]();
        setSelectedContent(content.default);
      };

      get();
    }
  }, [selectedFile]);

  return (
    <div>
      <PanelGroup direction="horizontal" style={{ height: "100vh" }}>
        <Panel defaultSize={25}>
          <Directory contents={contents} onSelect={handleSelect} />
        </Panel>
        <PanelResizeHandle style={{ borderRight: "1px solid #111" }} />
        <Panel defaultSize={75} style={{ overflow: "auto" }}>
          {selectedContent && (
            <Editor markdown={selectedContent} diffMarkdown={selectedContent} />
          )}
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default App;
