import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';
import { showError } from '@/utils/toast';
import { Loader2, Send } from 'lucide-react';
import { Comment } from './CommentItem';

interface CommentFormProps {
  postId: number;
  onCommentAdded: (newComment: Comment) => void;
}

export const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !content.trim()) {
      showError('Kullanıcı adı ve yorum boş olamaz.');
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, username, content }])
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      showError('Yorum eklenemedi: ' + error.message);
    } else if (data) {
      setUsername('');
      setContent('');
      onCommentAdded(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 pt-4">
      <Input
        placeholder="Kullanıcı adınız..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="text-sm"
      />
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Yorumunuzu yazın..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="text-sm"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="sr-only">Gönder</span>
        </Button>
      </div>
    </form>
  );
};