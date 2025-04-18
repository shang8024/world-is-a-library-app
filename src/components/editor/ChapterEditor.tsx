// import {$getRoot, $getSelection} from 'lexical';
// import {useEffect} from 'react';
import { EditorState, LexicalEditor } from 'lexical';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer, InitialEditorStateType} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';

const theme = {
  // Theme styling goes here
  //...
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function ChapterEditor({onChange, initialState, onError}: {initialState: InitialEditorStateType, onChange: (editorState : EditorState) => void, onError: (error: Error, editor: LexicalEditor) => void}) {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    editorState: initialState,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            className="h-full min-h-[400px] border-2 border-gray-300 rounded-md p-4"
            aria-placeholder={'Enter some text...'}
            placeholder={<></>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}

export default ChapterEditor;