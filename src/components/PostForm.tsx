import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, Plus, Trash2, Vote } from 'lucide-react';
import { Separator } from './ui/separator';
import { ImageUploader } from './ImageUploader';

const IMGBB_API_KEY = '0b87ea4254783f6f403eaf07eb33b76d';

export const PostForm = () => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(Date.now());

  // Poll state
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const handleAddOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
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
    setImageFile(null);
    setIsCreatingPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setUploaderKey(Date.now()); // Reset the uploader component
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !content.trim()) {
      showError('Kullanıcı adı ve gönderi içeriği boş olamaz.');
      return;
    }
    if (isCreatingPoll) {
      if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) {
        showError('Anket sorusu ve tüm seçenekler dolu olmalıdır.');
        return;
      }
    }

    setIsLoading(true);
    let uploadedImageUrl: string | null = null;

    // 1. Upload image to ImgBB if it exists
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (result.success) {
          uploadedImageUrl = result.data.url;
        } else {
          throw new Error(result.error?.message || 'Resim yüklenemedi.');
        }
      } catch (error) {
        setIsLoading(false);
        showError(`Resim yükleme hatası: ${error instanceof Error ? error.message : String(error)}`);
        return;
      }
    }

    // 2. Insert Post to Supabase
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ username, content, image_url: uploadedImageUrl }])
      .select()
      .single();

    if (postError) {
      setIsLoading(false);
      showError('Gönderi paylaşılamadı: ' + postError.message);
      return;
    }

    // 3. If poll exists, insert poll and options
    if (isCreatingPoll && postData) {
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .insert([{ post_id: postData.id, question: pollQuestion }])
        .select()
        .single();

      if (pollError) {
        showError('Anket oluşturulamadı: ' + pollError.message);
        setIsLoading(false);
        return;
      }

      if (pollData) {
        const optionsToInsert = pollOptions.map(opt => ({
          poll_id: pollData.id,
          option_text: opt,
        }));
        const { error: optionsError } = await supabase
          .from('poll_options')
          .insert(optionsToInsert);

        if (optionsError) {
          showError('Anket seçenekleri oluşturulamadı: ' + optionsError.message);
          setIsLoading(false);
          return;
        }
      }
    }

    setIsLoading(false);
    showSuccess('Gönderiniz başarıyla paylaşıldı!');
    resetForm();
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
            <Label>Resim Yükle (İsteğe Bağlı)</Label>
            <ImageUploader key={uploaderKey} onFileSelect={setImageFile} />
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