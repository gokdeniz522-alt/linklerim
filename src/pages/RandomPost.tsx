import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, PostItem } from '@/components/PostItem';
import { Button } from '@/components/ui/button';
import { Loader2, Home, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const RandomPostPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomPost = async () => {
    setIsLoading(true);
    // RPC (Remote Procedure Call) ile veritabanı fonksiyonunu çağırıyoruz
    const { data, error } = await supabase.rpc('get_random_post').single();

    if (error) {
      console.error('Error fetching random post:', error);
      setPost(null);
    } else {
      setPost(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRandomPost();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-2xl">
            <div className="flex items-start space-x-4 w-full p-6 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
      );
    }

    if (!post) {
      return <p className="text-muted-foreground">Gönderi bulunamadı veya bir hata oluştu.</p>;
    }

    return <PostItem post={post} />;
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 flex flex-col items-center min-h-screen">
      <header className="w-full max-w-2xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Rastgele Keşfet</h1>
        <Button asChild variant="outline" size="icon">
          <Link to="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Ana Sayfa</span>
          </Link>
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {renderContent()}
      </main>

      <footer className="py-8">
        <Button onClick={fetchRandomPost} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Shuffle className="mr-2 h-5 w-5" />
          )}
          Başka Bir Gönderi Göster
        </Button>
      </footer>
    </div>
  );
};

export default RandomPostPage;