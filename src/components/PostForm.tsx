import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2, Plus, Trash2, Vote, CheckCircle2, XCircle } from 'lucide-react';
import { Separator } from './ui/separator';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import type { OutputFileEntry } from '@uploadcare/react-uploader';

// Sizin sağladığınız Public Key kullanılıyor
const UPLOADCARE_PUBLIC_KEY = '7c5f7d59601cdb95af16';

interface PostFormProps {
  onPostCreated: () => void;
}

export const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(Date.now());

  // Poll state
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const handleUploadSuccess = (e: CustomEvent<OutputFileEntry[]>) => {
    const file = e.detail[0];
    if (file) {
      if (file.isImage) {
        setUploadedImageUrl(file.cdnUrl);
        setUploadedVideoUrl(null);
      } else if (file.mimeType?.startsWith('video/')) {
        setUploadedVideoUrl(file.cdnUrl);
        setUploadedImageUrl(null);
      }
    }
  };

  const handleRemoveMedia = () => {
    setUploadedImageUrl(null);
    setUploadedVideoUrl(null);
    setUploaderKey(Date.now());
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
    setUploadedImageUrl(null);
    setUploadedVideoUrl(null);
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

    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert([{ username, content, image_url: uploadedImageUrl, video_player_url: uploadedVideoUrl }])
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

  const hasMedia = uploadedImageUrl || uploadedVideoUrl;

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
            {hasMedia ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{uploadedImageUrl ? 'Resim' : 'Video'} başarıyla eklendi.</span>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={handleRemoveMedia}>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <FileUploaderRegular
                key={uploaderKey}
                pubkey={UPLOADCARE_PUBLIC_KEY}
                maxFiles={1}
                imgOnly={false}
                sourceList="local, url, camera, dropbox, gdrive"
                onFileUploadSuccess={handleUploadSuccess}
                classNameUploader="uc-light"
              />
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