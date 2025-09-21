import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, Plus, Trash2, Vote, X, Image as ImageIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// TODO: Bu API anahtarını https://api.imgbb.com/ adresinden aldığınız kendi anahtarınızla değiştirin.
const IMGBB_API_KEY = '0b87ea4254783f6f403eaf07eb33b76d';

interface PostFormProps {
  onPostCreated: () => void;
}

export const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Poll state
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
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
    <Card {...getRootProps()} className={cn("w-full max-w-2xl transition-colors", isDragActive && "outline-dashed outline-2 outline-primary")}>
      <input {...getInputProps()} />
      <form onSubmit={handleSubmit}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="mt-2">
              <AvatarFallback>{username.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
            <div className="w-full space-y-2">
              <Input 
                placeholder="Kullanıcı Adınız" 
                className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-semibold p-0 h-auto bg-transparent"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
              <Textarea 
                placeholder="Ne düşünüyorsunuz?" 
                className="w-full border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 min-h-[80px] bg-transparent"
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
              />
            </div>
          </div>

          {preview && (
            <div className="mt-4 pl-16 relative">
              <img src={preview} alt="Önizleme" className="rounded-lg max-h-80 w-auto border" />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full h-7 w-7"
                onClick={handleRemoveMedia}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {isCreatingPoll && (
            <div className="mt-4 pl-16 space-y-4">
              <Separator />
              <div>
                <Label htmlFor="poll-question" className="font-semibold">Anket Sorusu</Label>
                <Input id="poll-question" placeholder="Anket sorunuz..." value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} className="mt-2" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Seçenekler</Label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input placeholder={`Seçenek ${index + 1}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)} disabled={pollOptions.length <= 2}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <Button type="button" variant="outline" size="sm" onClick={handleAddOption} disabled={pollOptions.length >= 5}>
                  <Plus className="mr-2 h-4 w-4" /> Seçenek Ekle
                </Button>
              </div>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex items-center justify-between pl-16">
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={open}>
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Resim Yükle</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setIsCreatingPoll(!isCreatingPoll)}>
                <Vote className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Anket Oluştur</span>
              </Button>
            </div>
            <Button type="submit" disabled={isLoading} className="rounded-full font-bold px-6">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Paylaş'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};