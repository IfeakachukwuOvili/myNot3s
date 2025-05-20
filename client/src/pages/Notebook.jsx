import { useParams, useNavigate } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useNotebook } from '../hooks/useNotebook';
import { editorOptions } from '../config/editorConfig';

export default function NotebookEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    content,
    setContent,
    isSaving,
    saveMsg,
    saveNotebook
  } = useNotebook(id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate('/notebooks')}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-900"
          >
            <IoHomeOutline />
            <span>Home</span>
          </button>
          
          <button
            onClick={saveNotebook}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-900
              ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : saveMsg || 'Save'}
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={() => {
              if (title === 'Untitled Notebook') {
                setTitle('');
              }
            }}
            placeholder="Notebook Title"
            className="w-full p-4 mb-4 text-2xl font-bold rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              placeholder:text-gray-400 placeholder:font-normal"
          />

          <SimpleMDE
            value={content}
            onChange={setContent}
            options={editorOptions}
          />
        </div>
      </div>
    </div>
  );
}