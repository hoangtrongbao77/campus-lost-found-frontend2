import { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-green-600'
      : type === 'warning'
      ? 'bg-amber-500'
      : 'bg-red-600';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-semibold`}
      >
        <span>{type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}</span>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-75 font-bold text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}