import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Link {
  id: number;
  title: string;
  url: string;
}

const UserPage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;

      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        setError('Kullanıcı bulunamadı.');
        setLoading(false);
        return;
      }
      setProfile(profileData);

      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('id, title, url')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (linksError) {
        setError('Linkler yüklenirken bir hata oluştu.');
      } else {
        setLinks(linksData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hata</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <header className="flex flex-col items-center text-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile?.username}`} alt={profile?.username} />
          <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">@{profile?.username}</h1>
      </header>

      <main className="space-y-4">
        {links.length > 0 ? (
          links.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="hover:bg-muted transition-colors">
                <CardContent className="p-4 text-center">
                  <p className="font-semibold text-lg">{link.title}</p>
                </CardContent>
              </Card>
            </a>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">Bu kullanıcının henüz eklenmiş bir linki yok.</p>
        )}
      </main>
    </div>
  );
};

export default UserPage;