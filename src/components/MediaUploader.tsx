import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Video, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  onFileSelect: (file: File | null, fileType: 'image' | 'video' | null) => void;
}

export const MediaUploader = ({ onFileSelect }: MediaUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      setPreview(URL.createObjectURL(file));
      setFileType(type);
      onFileSelect(file, type);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.webm']
    },
    maxSize: 128 * 1024 * 1024, // 128 MB
    multiple: false,
  });

  const handleRemoveMedia = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFileType(null);
    onFileSelect(null, null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative group w-full aspect-video border rounded-md flex items-center justify-center bg-muted">
          {fileType === 'image' ? (
            <img src={preview} alt="Önizleme" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <video src={preview} controls className="max-h-full max-w-full object-contain rounded-md" />
          )}
          <button
            type="button"
            onClick={handleRemoveMedia}
            className="absolute top-2 right-2 bg-background/60 backdrop-blur-sm rounded-full p-1 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Medyayı Kaldır</span>
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors',
            isDragActive && 'border-primary bg-accent'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Yüklemek için tıklayın</span> veya sürükleyip bırakın
            </p>
            <p className="text-xs text-muted-foreground">Resim veya Video (Maks. 128MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};