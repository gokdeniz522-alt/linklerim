import { useEffect, useState } from 'react';
import { PostForm } from '@/components/PostForm';
import { PostItem, Post } from '@/components/PostItem';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    if (error) {
      console.error('Error fetching posts:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('realtime posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts((currentPosts) => {
            const postExists = currentPosts.some(p => p.id === (payload.new as Post).id);
            if (postExists) {
              return currentPosts;
            }
            return [payload.new as Post, ...currentPosts];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 relative">
      <div className="absolute top-8 right-4 md:right-8">
        <ThemeToggle />
      </div>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Anonim Gönderi Platformu</h1>
        <p className="text-muted-foreground mt-2">Kayıt olmadan düşüncelerini paylaş.</p>
      </header>
      
      <main className="flex flex-col items-center space-y-8">
        <PostForm onPostSuccess={fetchPosts} />

        <div className="w-full">
          <div className="flex justify-center items-center text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Son Gönderiler</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchPosts}
              disabled={isLoading}
              className="ml-2"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Gönderileri Yenile</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start space-x-4 w-full p-6 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {posts.map(post => <PostItem key={post.id} post={post} />)}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Henüz hiç gönderi yok. İlk gönderiyi sen paylaş!</p>
          )}
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;