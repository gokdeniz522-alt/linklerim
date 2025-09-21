import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { cn } from '@/lib/utils';

type Theme = 'default' | 'minimalist' | 'glass';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  background_type: 'none' | 'color' | 'image';
  background_value: string | null;
  profile_header_image_url: string | null;
  theme: Theme;
}

interface Link {
  id: number;
  title: string;
  url: string;
  favicon_url: string | null;
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
        .select('id, username, avatar_url, bio, background_type, background_value, profile_header_image_url, theme')
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
        .select('id, title, url, favicon_url')
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

  const handleLinkClick = async (linkId: number) => {
    try {
      await supabase.rpc('increment_link_click', {
        link_id_to_update: linkId,
      });
    } catch (error) {
      console.error('Error incrementing link click:', error);
    }
  };

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

  const pageBackgroundStyle: React.CSSProperties = {};
  let pageTextColorClass = '';

  if (profile?.background_type === 'color' && profile.background_value) {
    pageBackgroundStyle.backgroundColor = profile.background_value;
  } else if (profile?.background_type === 'image' && profile.background_value) {
    pageBackgroundStyle.backgroundImage = `url(${profile.background_value})`;
    pageBackgroundStyle.backgroundSize = 'cover';
    pageBackgroundStyle.backgroundPosition = 'center';
    pageBackgroundStyle.backgroundRepeat = 'no-repeat';
    pageTextColorClass = 'text-white';
  }

  const headerBackgroundStyle: React.CSSProperties = {};
  let headerTextColorClass = '';

  if (profile?.profile_header_image_url) {
    headerBackgroundStyle.backgroundImage = `url(${profile.profile_header_image_url})`;
    headerBackgroundStyle.backgroundSize = 'cover';
    headerBackgroundStyle.backgroundPosition = 'center';
    headerBackgroundStyle.backgroundRepeat = 'no-repeat';
    headerTextColorClass = 'text-white';
  }

  // Tema stilleri
  const theme = profile?.theme || 'default';
  const themeClasses = {
    linkCard: {
      default: 'hover:bg-muted transition-colors rounded-lg',
      minimalist: 'border bg-background hover:bg-muted transition-colors rounded-none',
      glass: 'bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors',
    },
    linkContent: {
      default: 'p-4 text-center flex items-center justify-center gap-3',
      minimalist: 'p-4 text-center flex items-center justify-center gap-3',
      glass: 'p-4 text-center flex items-center justify-center gap-3',
    },
  };

  return (
    <div 
      className={cn("flex flex-col min-h-screen", pageTextColorClass)}
      style={pageBackgroundStyle}
    >
      <div className="container mx-auto py-8 max-w-2xl relative flex-grow">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <header 
          className={cn(
            "flex flex-col items-center text-center mb-8 p-6",
            headerTextColorClass,
            theme === 'default' && 'rounded-lg',
            profile?.profile_header_image_url ? 'bg-gray-800 bg-opacity-50' : ''
          )}
          style={headerBackgroundStyle}
        >
          <Avatar className="w-24 h-24 mb-4 border-4 border-white dark:border-gray-800">
            <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile?.username}`} alt={profile?.username || ''} />
            <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">@{profile?.username}</h1>
          {profile?.bio && (
            <p className={cn("mt-2 max-w-md", profile?.profile_header_image_url ? 'text-gray-200' : 'text-muted-foreground')}>{profile.bio}</p>
          )}
        </header>

        <main className="space-y-4">
          {links.length > 0 ? (
            links.map(link => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block"
                onClick={() => handleLinkClick(link.id)}
              >
                <Card className={cn(themeClasses.linkCard[theme])}>
                  <CardContent className={cn(themeClasses.linkContent[theme])}>
                    {link.favicon_url && (
                      <img src={link.favicon_url} alt="Favicon" className="w-5 h-5 rounded-full" />
                    )}
                    <p className="font-semibold text-lg">{link.title}</p>
                  </CardContent>
                </Card>
              </a>
            ))
          ) : (
            <p className={cn("text-center py-4", pageTextColorClass === 'text-white' ? 'text-gray-200' : 'text-muted-foreground')}>Bu kullanıcının henüz eklenmiş bir linki yok.</p>
          )}
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default UserPage;