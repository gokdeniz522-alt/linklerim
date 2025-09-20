import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Post } from '@/components/PostItem';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { showError, showSuccess } from '@/utils/toast';
import { format } from 'date-fns';
import { Trash2, LogOut, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/admin/login');
    } else {
      fetchPosts();
    }
  }, [navigate]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
    if (error) showError('Gönderiler yüklenemedi.');
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    // Adım 1: Gönderiye bağlı anketleri bul
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select('id')
      .eq('post_id', postToDelete.id);

    if (pollsError) {
      showError('Anketler aranırken hata oluştu: ' + pollsError.message);
      setPostToDelete(null);
      return;
    }

    // Adım 2: Anketler varsa, önce seçeneklerini sonra kendilerini sil
    if (polls && polls.length > 0) {
      const pollIds = polls.map(p => p.id);
      
      // Anket seçeneklerini sil
      const { error: optionsError } = await supabase.from('poll_options').delete().in('poll_id', pollIds);
      if (optionsError) {
        showError('Anket seçenekleri silinemedi: ' + optionsError.message);
        setPostToDelete(null);
        return;
      }
      
      // Anketleri sil
      const { error: pollDeleteError } = await supabase.from('polls').delete().in('id', pollIds);
      if (pollDeleteError) {
        showError('Anketler silinemedi: ' + pollDeleteError.message);
        setPostToDelete(null);
        return;
      }
    }

    // Adım 3: Gönderiye bağlı yorumları sil
    const { error: commentsError } = await supabase
      .from('comments')
      .delete()
      .eq('post_id', postToDelete.id);

    if (commentsError) {
      showError('Yorumlar silinemedi: ' + commentsError.message);
      setPostToDelete(null);
      return;
    }

    // Adım 4: Tüm bağlı veriler silindikten sonra gönderiyi sil
    const { error: postError } = await supabase.from('posts').delete().eq('id', postToDelete.id);

    if (postError) {
      showError('Gönderi silinemedi: ' + postError.message);
    } else {
      showSuccess('Gönderi ve tüm ilişkili verileri başarıyla silindi.');
      setPosts(posts.filter(p => p.id !== postToDelete.id));
    }
    setPostToDelete(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Paneli</h1>
          <p className="text-muted-foreground">Gönderileri yönetin.</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kullanıcı Adı</TableHead>
                <TableHead>İçerik</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.username}</TableCell>
                  <TableCell className="max-w-md truncate">{post.content}</TableCell>
                  <TableCell>{format(new Date(post.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setPostToDelete(post)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu gönderiyi ve ona bağlı tüm yorumları/anketleri kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;