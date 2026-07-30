import { useState } from 'react';
import Button from '../common/Button';

const MusicForm = ({ initialData, onSubmit, onCancel, submitLabel = "Save" }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }
    // If creating new, we need a file
    if (!initialData && !formData.file) {
      alert('Please select an audio file');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stream-text-secondary mb-2">
          Song Title *
        </label>
        <input 
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-stream-elevated border border-stream-border/10 rounded-md p-3 text-white focus:border-stream-highlight focus:outline-none transition-colors"
          placeholder="Enter song title..."
          required
        />
      </div>

      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-stream-text-secondary mb-2">
            Audio File * (MP3, WAV)
          </label>
          <input 
            type="file" 
            name="file"
            accept="audio/*"
            onChange={handleChange}
            className="w-full text-stream-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-stream-highlight file:text-white hover:file:bg-stream-highlight/80"
            required
          />
        </div>
      )}

      <div className="flex gap-4 pt-4 border-t border-stream-border/10">
        <Button type="submit">{submitLabel}</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default MusicForm;
