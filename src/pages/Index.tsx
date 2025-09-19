import { useEffect, useState } from 'react';
import { PostForm } from '@/components/PostForm';
import { PostItem, Post } from '@/components/PostItem';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { MadeWithDyad } from '@/components/made-with-dyad';

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
  }, []);

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Anonim Gönderi Platformu</h1>
        <p className="text-muted-foreground mt-2">Kayıt olmadan düşüncelerini paylaş.</p>
      </header>
      
      <main className="flex flex-col items-center space-y-8">
        <PostForm onPostCreated={fetchPosts} />

        <div className="w-full max-w-2xl space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-center">Son Gönderiler</h2>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 w-full">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map(post => <PostItem key={post.id} post={post} />)
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