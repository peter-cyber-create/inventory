import React, { useState, useRef, useEffect } from 'react';

// File uploader component with drag & drop functionality
export const Uploader = ({ onFiles, maxSizeMB = 50, accept = 'application/pdf,image/*' }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const onDrop = (e) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = Array.from(e.dataTransfer?.files || []);
      handleAdd(dropped);
    };
    
    const onDragOver = (e) => {
      e.preventDefault();
      setDragActive(true);
    };
    
    const onDragLeave = (e) => {
      e.preventDefault();
      setDragActive(false);
    };
    
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  function handleAdd(newFiles) {
    const ok = newFiles.filter(f => f.size <= maxSizeMB * 1024 * 1024);
    setFiles(prev => {
      const merged = [...prev, ...ok];
      onFiles?.(merged);
      return merged;
    });
  }

  function handleFileSelect() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = accept;
    input.onchange = () => {
      const selected = Array.from((input.files || []));
      handleAdd(selected);
    };
    input.click();
  }

  function removeFile(index) {
    setFiles(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      onFiles?.(updated);
      return updated;
    });
  }

  return (
    <div>
      <div 
        ref={ref} 
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={handleFileSelect}
      >
        <p className="text-sm">
          Drag & drop files here or click to select (max {maxSizeMB}MB each)
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Accepted formats: {accept}
        </p>
      </div>
      
      <div className="mt-2 space-y-1">
        {files.map((f, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
            <div className="text-sm flex-1">
              {f.name} 
              <span className="text-xs text-gray-400 ml-2">
                ({Math.round(f.size / 1024 / 1024)} MB)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500">{f.type}</div>
              <button 
                onClick={() => removeFile(idx)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Uploader;
