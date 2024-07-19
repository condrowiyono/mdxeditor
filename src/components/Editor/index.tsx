import "@mdxeditor/editor/style.css";
import {
  MDXEditorProps,
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  toolbarPlugin,
  headingsPlugin,
  quotePlugin,
  linkDialogPlugin,
  listsPlugin,
  thematicBreakPlugin,
  BlockTypeSelect,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertTable,
  InsertImage,
  InsertThematicBreak,
  InsertFrontmatter,
  ListsToggle,
  linkPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  frontmatterPlugin,
  imagePlugin,
  MDXEditorMethods,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";
import { Button, Space } from "antd";
import { useRef } from "react";

interface EditorProps extends MDXEditorProps {
  diffMarkdown: string;
  onSave?: (markdown: string) => void;
}

function Editor({ diffMarkdown, onSave, ...rest }: EditorProps) {
  const ref = useRef<MDXEditorMethods>(null);

  const handleSave = () => {
    const editor = ref.current;
    if (editor) {
      onSave?.(editor.getMarkdown());
    }
  };

  return (
    <div>
      <MDXEditor
        ref={ref}
        plugins={[
          quotePlugin(),
          headingsPlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          linkDialogPlugin(),
          linkPlugin(),
          tablePlugin(),
          frontmatterPlugin(),
          imagePlugin(),
          markdownShortcutPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: { js: "JavaScript", css: "CSS" },
          }),
          diffSourcePlugin({
            diffMarkdown: diffMarkdown,
            viewMode: "rich-text",
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <CodeToggle />
                <CreateLink />
                <InsertCodeBlock />
                <InsertTable />
                <InsertImage />
                <InsertThematicBreak />
                <InsertFrontmatter />
                <ListsToggle />
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                      fallback: () => (
                        <>
                          <InsertCodeBlock />
                        </>
                      ),
                    },
                  ]}
                />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
        {...rest}
      />
      <hr />
      <Space style={{ padding: "8px" }}>
        <Button type="primary" onClick={handleSave}>
          Save
        </Button>
      </Space>
    </div>
  );
}

export default Editor;
