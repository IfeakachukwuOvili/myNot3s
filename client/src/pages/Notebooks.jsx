import { useNavigate } from 'react-router-dom';
import { IoTrashOutline, IoAddOutline } from 'react-icons/io5';
import Modal from '../components/Modal';
import { useNotebooks } from '../hooks/useNotebooks';

export default function NotebookList() {
  const navigate = useNavigate();
  const {
    notebooks,
    isModalOpen,
    setIsModalOpen,
    handleDeleteClick,
    confirmDelete
  } = useNotebooks();

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
          Your Notebooks
        </h1>
        
        <button
          onClick={() => navigate('/notebook/new')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-900"
        >
          <IoAddOutline className="text-xl" />
          <span>New Notebook</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notebooks.map(notebook => (
          <div
            key={notebook._id}
            className="p-6 rounded-lg cursor-pointer transition-all hover:scale-105 bg-gray-50 dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700"
          >
            <div onClick={() => navigate(`/notebook/${notebook._id}`)}>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {notebook.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Last updated: {new Date(notebook.updatedAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(notebook._id);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-400 text-gray-600 dark:text-white"
            >
              <IoTrashOutline className="text-xl" />
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Notebook"
        message="Are you sure you want to delete this notebook?"
      />
    </div>
  );
}