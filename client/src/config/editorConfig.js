const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(window.navigator.userAgent);

export const editorOptions = {
  autofocus: true,
  spellChecker: true,
  status: ['lines', 'words'],
  placeholder: 'Start writing...',
  toolbar: [
    'bold', 'italic', 'heading', '|',
    'quote', 'unordered-list', 'ordered-list', '|',
    'link', '|',
    'undo', 'redo', '|',
    'preview', 'side-by-side', 'fullscreen'
  ],
  shortcuts: {
    'toggleBold': isMac ? 'Cmd-B' : 'Ctrl-B',
    'toggleItalic': isMac ? 'Cmd-I' : 'Ctrl-I',
    'toggleUnorderedList': isMac ? 'Cmd-L' : 'Ctrl-L',
    'toggleOrderedList': isMac ? 'Cmd-Alt-L' : 'Ctrl-Alt-L',
    'undo': isMac ? 'Cmd-Z' : 'Ctrl-Z',
    'redo': isMac ? 'Cmd-Shift-Z' : 'Ctrl-Y', // Changed to standard Mac redo shortcut
    'toggleSideBySide': 'F9',
    'toggleFullScreen': 'F11'
  }
};