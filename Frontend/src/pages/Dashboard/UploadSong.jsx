import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicService } from '../../services/musicService';
import MusicForm from '../../components/dashboard/MusicForm';
import { Upload } from 'lucide-react';
import Loader from '../../components/common/Loader';

const DashboardUploadSong = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSubmit = async (data) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.file) {
        formData.append('music', data.file);
      }

      await musicService.uploadMusic(formData);
      navigate('/dashboard/songs');
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to upload song. Please try again.");
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader />
        <h2 className="mt-4 text-xl font-medium">Uploading Song...</h2>
        <p className="text-stream-text-secondary">This might take a moment depending on the file size.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Upload size={28} className="text-stream-highlight" />
        <h1 className="text-3xl font-bold">Upload New Song</h1>
      </div>
      
      <div className="bg-stream-card p-6 rounded-lg border border-stream-border/5 shadow-sm">
        <MusicForm 
          onSubmit={handleUploadSubmit} 
          onCancel={() => navigate('/dashboard/songs')} 
          submitLabel="Upload Song"
        />
      </div>
    </div>
  );
};

export default DashboardUploadSong;
