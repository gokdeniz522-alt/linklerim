import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export const ImageUploader = ({ onFileSelect }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
      'image/heic': [],
      'image/avif': [],
    },
    maxSize: 32 * 1024 * 1024, // 32 MB
    multiple: false,
  });

  const handleRemoveImage = () => {
    setPreview(null);
    onFileSelect(null);
    // Revoke the object URL to free up memory
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative group w-full h-48 border rounded-md flex items-center justify-center">
          <img src={preview} alt="Önizleme" className="max-h-full max-w-full object-contain rounded-md" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-background/60 backdrop-blur-sm rounded-full p-1 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Resmi Kaldır</span>
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
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF vb. (Maks. 32MB)</p>
          </div>
        </div>
      )}
    </div>
  );
};