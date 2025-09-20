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
import { MediaUploader } from './MediaUploader';
import { VideoUploader } from '@api.video/video-uploader';

const IMGBB_API_KEY = '0b87ea4254783f6f403eaf07eb33b76d';
const API_VIDEO_KEY = 'YTMX7u744uGYqOWI0ab7uQLyhlmPh04FXFEpGDiMHFt';
const API_VIDEO_BASE_URL = 'https://sandbox.api.video';

interface PostFormProps {
  onPostCreated: () => void;
}

export const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(Date.now());

  // Poll state
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const handleFileSelect = (file: File | null, fileType: 'image' | 'video' | null) => {
    setMediaFile(file);
    setMediaType(fileType);
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
    setMediaFile(null);
    setMediaType(null);
    setIsCreatingPoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setUploaderKey(Date.now());
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

    setIsLoading(true);
    let uploadedImageUrl: string | null = null;
    let uploadedVideoPlayerUrl: string | null = null;

    if (mediaFile) {
      if (mediaType === 'image') {
        const formData = new FormData();
        formData.append('image', mediaFile);
        try {
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
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
      } else if (mediaType === 'video') {
        try {
          // Adım 1: Video nesnesi oluştur ve videoId al
          const createResponse = await fetch(`${API_VIDEO_BASE_URL}/videos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_VIDEO_KEY}`
            },
            body: JSON.stringify({ title: `Gönderi - ${username}` })
          });

          if (!createResponse.ok) {
            const errorBody = await createResponse.json();
            throw new Error(`Video kaydı oluşturulamadı: ${errorBody.title || 'API Hatası'}`);
          }
          const videoData = await createResponse.json();
          const videoId = videoData.videoId;

          if (!videoId) {
            throw new Error('API\'den geçerli bir videoId alınamadı.');
          }

          // Adım 2: Alınan videoId ile dosyayı yükle
          const uploader = new VideoUploader({ apiKey: API_VIDEO_KEY, baseUri: API_VIDEO_BASE_URL });
          const video = await uploader.uploadWithVideoId(videoId, mediaFile);
          uploadedVideoPlayerUrl = video.assets.iframe;

        } catch (error) {
          setIsLoading(false);
          showError(`Video yükleme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.'}`);
          console.error("Video upload process error:", error);
          return;
        }
      }
    }

    // 3. Gönderiyi Supabase'e kaydet
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ username, content, image_url: uploadedImageUrl, video_player_url: uploadedVideoPlayerUrl }])
      .select().single();

    if (postError) {
      setIsLoading(false);
      showError('Gönderi paylaşılamadı: ' + postError.message);
      return;
    }

    // 4. Anket varsa, anketi ve seçenekleri kaydet
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
            <Label>Resim veya Video Yükle (İsteğe Bağlı)</Label>
            <MediaUploader key={uploaderKey} onFileSelect={handleFileSelect} />
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