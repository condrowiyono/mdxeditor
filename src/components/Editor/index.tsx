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
  sandpackPlugin,
  codeMirrorPlugin,
  SandpackConfig,
  ConditionalContents,
  InsertSandpack,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  frontmatterPlugin,
} from "@mdxeditor/editor";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

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
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
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
                    when: (editor) => editor?.editorType === "sandpack",
                    contents: () => <ShowSandpackInfo />,
                  },
                  {
                    fallback: () => (
                      <>
                        <InsertCodeBlock />
                        <InsertSandpack />
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
