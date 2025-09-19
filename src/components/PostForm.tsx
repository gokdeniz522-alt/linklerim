import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

export const PostForm = () => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !content.trim()) {
      showError('Kullanıcı adı ve gönderi içeriği boş olamaz.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.from('posts').insert([
      { username, content, image_url: imageUrl || null }
    ]);

    setIsLoading(false);

    if (error) {
      showError('Gönderi paylaşılamadı: ' + error.message);
    } else {
      showSuccess('Gönderiniz başarıyla paylaşıldı!');
      setUsername('');
      setContent('');
      setImageUrl('');
    }
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
            <Input 
              id="username" 
              placeholder="Kullanıcı adınızı girin..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Gönderiniz</Label>
            <Textarea 
              id="content" 
              placeholder="Ne düşünüyorsunuz?" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-url">Resim URL'si (İsteğe Bağlı)</Label>
            <Input 
              id="image-url" 
              placeholder="https://ornek.com/resim.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
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