import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, Plus, Trash2, Vote, XCircle, UploadCloud, File as FileIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

// TODO: Bu API anahtarını https://api.imgbb.com/ adresinden aldığınız kendi anahtarınızla değiştirin.
const IMGBB_API_KEY = '0b87ea4254783f6f403eaf07eb33b76d';

interface PostFormProps {
  onPostCreated: () => void;
}

export const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Poll state
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
    },
    multiple: false,
  });

  const handleRemoveMedia = () => {
    setSelectedFile(null);
  };

  const handleAddOption = () => {
    if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const resetForm = () => {
    setUsername('');
    setContent('');
    setSelectedFile(null);
    setIsCreatingPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !content.trim()) {
      showError('Kullanıcı adı ve gönderi içeriği boş olamaz.');
      return;
    }
    if (isCreatingPoll && (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()))) {
      showError('Anket sorusu ve tüm seçenekler dolu olmalıdır.');
      return;
    }
    if (IMGBB_API_KEY === 'BURAYA_KENDI_IMGBB_API_ANAHTARINIZI_YAPISTIRIN') {
        showError('Lütfen PostForm.tsx dosyasındaki IMGBB_API_KEY değerini güncelleyin.');
        return;
    }

    setIsLoading(true);
    let imageUrl: string | null = null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('key', IMGBB_API_KEY);
      formData.append('image', selectedFile);

      try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          imageUrl = result.data.url;
        } else {
          throw new Error(result.error?.message || 'Resim yüklenirken bir hata oluştu.');
        }
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Resim yüklenemedi.');
        setIsLoading(false);
        return;
      }
    }

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ username, content, image_url: imageUrl }])
      .select().single();

    if (postError) {
      setIsLoading(false);
      showError('Gönderi paylaşılamadı: ' + postError.message);
      return;
    }

    if (isCreatingPoll && postData) {
      const { data: pollData, error: pollError } = await supabase
        .from('polls').insert([{ post_id: postData.id, question: pollQuestion }]).select().single();

      if (pollError) {
        showError('Anket oluşturulamadı: ' + pollError.message);
        setIsLoading(false); return;
      }

      if (pollData) {
        const optionsToInsert = pollOptions.map(opt => ({ poll_id: pollData.id, option_text: opt }));
        const { error: optionsError } = await supabase.from('poll_options').insert(optionsToInsert);
        if (optionsError) {
          showError('Anket seçenekleri oluşturulamadı: ' + optionsError.message);
          setIsLoading(false); return;
        }
      }
    }

    setIsLoading(false);
    showSuccess('Gönderiniz başarıyla paylaşıldı!');
    resetForm();
    onPostCreated();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Yeni Gönderi Paylaş</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input id="username" placeholder="Kullanıcı adınızı girin..." value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Gönderiniz</Label>
            <Textarea id="content" placeholder="Ne düşünüyorsunuz?" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Resim veya GIF Yükle (İsteğe Bağlı)</Label>
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                  <FileIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate flex-1">{selectedFile.name}</span>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={handleRemoveMedia}>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div 
                {...getRootProps()} 
                className={cn(
                  "relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                  isDragActive && "border-primary bg-primary/10"
                )}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                {isDragActive ? (
                  <p className="mt-2 text-sm text-primary">Dosyayı buraya bırakın</p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">Sürükleyip bırakın veya seçmek için tıklayın</p>
                )}
              </div>
            )}
          </div>
          
          <Separator />

          {isCreatingPoll ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="poll-question">Anket Sorusu</Label>
                <Input id="poll-question" placeholder="Anket sorunuz..." value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Seçenekler</Label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input placeholder={`Seçenek ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} disabled={pollOptions.length <= 2}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" size="sm" onClick={handleAddOption} disabled={pollOptions.length >= 5}>
                  <Plus className="mr-2 h-4 w-4" /> Seçenek Ekle
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => setIsCreatingPoll(false)}>
                  Anketi İptal Et
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" variant="outline" className="w-full" onClick={() => setIsCreatingPoll(true)}>
              <Vote className="mr-2 h-4 w-4" /> Anket Oluştur
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Paylaş'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};