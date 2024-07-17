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
} from "@mdxeditor/editor";

function Editor({
  diffMarkdown,
  ...rest
}: MDXEditorProps & { diffMarkdown: string }) {
  return (
    <MDXEditor
      onChange={console.log}
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
  );
}

export default Editor;
