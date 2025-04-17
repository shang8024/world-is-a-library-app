import {$getRoot, $getSelection} from 'lexical';
import {useEffect} from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';

const theme = {
  // Theme styling goes here
  //...
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

function ChapterEditor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="h-full min-h-[400px] border-2 border-gray-300 rounded-md p-4"
            aria-placeholder={'Enter some text...'}
            placeholder={<div>Enter some text...</div>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  );
}

export default ChapterEditor;