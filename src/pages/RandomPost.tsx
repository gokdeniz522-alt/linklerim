import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, PostItem } from '@/components/PostItem';
import { Button } from '@/components/ui/button';
import { Loader2, Home, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const PostSkeleton = () => (
  <div className="w-full max-w-2xl rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-6 flex items-center space-x-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="px-6 pb-6 space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="aspect-video w-full rounded-md" />
    </div>
    <div className="p-6 pt-0">
       <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

const RandomPostPage = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomPost = async () => {
    setIsLoading(true);
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
      return <PostSkeleton />;
    }

    if (!post) {
      return <p className="text-muted-foreground">Gönderi bulunamadı veya bir hata oluştu.</p>;
    }

    return <PostItem post={post} />;
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 flex flex-col items-center min-h-screen">
      <header className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rastgele Keşfet</h1>
          <p className="text-muted-foreground">Platformdaki gönderiler arasında gezinin.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfa
          </Link>
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        {renderContent()}
      </main>

      <footer className="w-full max-w-2xl flex justify-center pb-8">
        <Button onClick={fetchRandomPost} disabled={isLoading} size="lg" className="w-full sm:w-auto">
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