import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { cn } from '@/lib/utils';
import { getYouTubeVideoId } from '@/utils/youtube';

type Theme = 'default' | 'minimalist' | 'glass' | 'neon' | 'retro';
type Layout = 'default' | 'sidebar-left' | 'modern-cover';
type YouTubeVisibility = 'visible' | 'hidden';
type YouTubePosition = 'default' | 'background' | 'bottom-right';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  background_type: 'none' | 'color' | 'image';
  background_value: string | null;
  profile_header_image_url: string | null;
  theme: Theme;
  layout: Layout;
  youtube_url: string | null;
  youtube_visibility: YouTubeVisibility;
  youtube_position: YouTubePosition;
}

interface Link {
  id: number;
  title: string;
  url: string;
  favicon_url: string | null;
}

const YouTubePlayer = ({ videoId, visibility, position }: { videoId: string; visibility: YouTubeVisibility; position: YouTubePosition }) => {
  // Güvenilir otomatik oynatma için mute=1 ve kullanıcı etkileşimi için controls=1 olarak güncellendi.
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&loop=1&playlist=${videoId}`;
  
  if (visibility === 'hidden') {
    return (
      <iframe
        className="absolute w-0 h-0 border-0 -z-10"
        src={src.replace('controls=1', 'controls=0')} // Gizli modda kontrollere gerek yok
        title="YouTube audio player"
        allow="autoplay"
      ></iframe>
    );
  }

  const positionClasses = {
    default: 'w-full aspect-video rounded-lg shadow-lg mt-8', // Linklerden sonra gelmesi için mt-8 eklendi
    background: 'fixed top-0 left-0 w-full h-full -z-10 object-cover',
    'bottom-right': 'fixed bottom-4 right-4 w-80 h-44 rounded-lg shadow-2xl z-50',
  };

  return (
    <div className={cn(positionClasses[position])}>
        <iframe
            className="w-full h-full"
            src={src}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        ></iframe>
    </div>
  );
};

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
        .select('id, username, avatar_url, bio, background_type, background_value, profile_header_image_url, theme, layout, youtube_url, youtube_visibility, youtube_position')
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

  const videoId = useMemo(() => {
    if (profile?.youtube_url) {
      return getYouTubeVideoId(profile.youtube_url);
    }
    return null;
  }, [profile?.youtube_url]);

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

  const theme = profile?.theme || 'default';
  const layout = profile?.layout || 'default';

  const themeClasses = {
    page: {
      default: '',
      minimalist: '',
      glass: '',
      neon: 'bg-gray-900 text-white',
      retro: 'bg-black font-mono text-green-400',
    },
    header: {
      default: 'rounded-lg',
      minimalist: '',
      glass: 'bg-white/10 backdrop-blur-md rounded-lg border border-white/20',
      neon: '',
      retro: '',
    },
    avatar: {
      default: 'border-4 border-white dark:border-gray-800',
      minimalist: 'border-2 border-gray-500 rounded-none',
      glass: 'border-4 border-white/50',
      neon: 'border-4 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.7)]',
      retro: 'border-2 border-green-400 rounded-none',
    },
    username: {
      default: 'text-3xl font-bold',
      minimalist: 'text-3xl font-semibold tracking-wider',
      glass: 'text-3xl font-bold',
      neon: 'text-3xl font-bold text-cyan-400 [text-shadow:_0_0_8px_theme(colors.cyan.400)]',
      retro: 'text-3xl font-normal',
    },
    bio: {
      default: 'text-muted-foreground',
      minimalist: 'text-gray-600 dark:text-gray-400',
      glass: 'text-gray-200',
      neon: 'text-pink-400',
      retro: 'text-green-400',
    },
    linkCard: {
      default: 'bg-background/80 hover:bg-muted transition-transform hover:scale-105 rounded-lg shadow-md',
      minimalist: 'border bg-background hover:bg-muted transition-colors rounded-none',
      glass: 'bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white hover:bg-white/30 transition-transform hover:scale-105',
      neon: 'bg-gray-800/50 border border-pink-500 rounded-lg hover:bg-gray-700/50 transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]',
      retro: 'border-2 border-green-400 rounded-none hover:bg-green-900/50 transition-colors flex items-center before:content-["_"] before:animate-pulse',
    },
    linkTitle: {
      default: 'font-semibold text-lg',
      minimalist: 'font-normal text-lg',
      glass: 'font-semibold text-lg',
      neon: 'font-semibold text-lg text-pink-400 [text-shadow:_0_0_5px_theme(colors.pink.400)]',
      retro: 'font-normal text-lg text-green-400',
    },
  };

  const pageBackgroundStyle: React.CSSProperties = {};
  let pageForcedClasses = themeClasses.page[theme];

  if (theme !== 'neon' && theme !== 'retro') {
    if (profile?.background_type === 'color' && profile.background_value) {
      pageBackgroundStyle.backgroundColor = profile.background_value;
    } else if (profile?.background_type === 'image' && profile.background_value) {
      pageBackgroundStyle.backgroundImage = `url(${profile.background_value})`;
      pageBackgroundStyle.backgroundSize = 'cover';
      pageBackgroundStyle.backgroundPosition = 'center';
      pageBackgroundStyle.backgroundRepeat = 'no-repeat';
      if (theme !== 'glass') {
        pageForcedClasses = 'text-white';
      }
    }
  }

  const headerBackgroundStyle: React.CSSProperties = {
    backgroundImage: profile?.profile_header_image_url ? `url(${profile.profile_header_image_url})` : 'none',
    backgroundColor: profile?.profile_header_image_url ? '' : 'hsl(var(--muted))',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const ProfileSectionDefault = () => (
    <header 
      className={cn(
        "flex flex-col items-center text-center p-6",
        profile?.profile_header_image_url && 'text-white',
        themeClasses.header[theme],
        profile?.profile_header_image_url ? 'bg-gray-800 bg-opacity-50' : '',
        layout === 'default' ? 'mb-8' : 'md:mb-0'
      )}
      style={profile?.profile_header_image_url ? headerBackgroundStyle : {}}
    >
      <Avatar className={cn("w-24 h-24 mb-4", themeClasses.avatar[theme])}>
        <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile?.username}`} alt={profile?.username || ''} />
        <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <h1 className={cn(themeClasses.username[theme])}>@{profile?.username}</h1>
      {profile?.bio && (
        <p className={cn("mt-2 max-w-md", themeClasses.bio[theme])}>{profile.bio}</p>
      )}
    </header>
  );

  const ProfileSectionModernCover = () => (
    <div className="mb-12">
      <div className={cn("w-full h-48 md:h-64 rounded-lg", themeClasses.header[theme])} style={headerBackgroundStyle}></div>
      <div className="flex items-center gap-4 px-4 -mt-12">
        <Avatar className={cn("w-24 h-24 md:w-32 md:h-32 flex-shrink-0", themeClasses.avatar[theme])}>
          <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile?.username}`} alt={profile?.username || ''} />
          <AvatarFallback>{profile?.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="pt-12">
          <h1 className={cn(themeClasses.username[theme])}>@{profile?.username}</h1>
          {profile?.bio && (
            <p className={cn("mt-1 max-w-md", themeClasses.bio[theme])}>{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );

  const LinksSection = () => (
    <main className="space-y-4 w-full px-4 md:px-0">
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
              <CardContent className="p-4 text-center flex items-center justify-center gap-3">
                {link.favicon_url && (
                  <img src={link.favicon_url} alt="Favicon" className="w-5 h-5 rounded-full" />
                )}
                <p className={cn(themeClasses.linkTitle[theme])}>{link.title}</p>
              </CardContent>
            </Card>
          </a>
        ))
      ) : (
        <p className={cn("text-center py-4", pageForcedClasses.includes('text-white') ? 'text-gray-200' : 'text-muted-foreground')}>Bu kullanıcının henüz eklenmiş bir linki yok.</p>
      )}
    </main>
  );

  const renderLayout = () => {
    const defaultVideoPlayer = videoId && profile?.youtube_position === 'default' && (
      <YouTubePlayer videoId={videoId} visibility={profile.youtube_visibility} position="default" />
    );

    switch (layout) {
      case 'modern-cover':
        return (
          <div className="max-w-2xl mx-auto">
            <ProfileSectionModernCover />
            <LinksSection />
            {defaultVideoPlayer}
          </div>
        );
      case 'sidebar-left':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 md:sticky md:top-8">
              <ProfileSectionDefault />
            </div>
            <div className="md:col-span-2">
              <LinksSection />
              {defaultVideoPlayer}
            </div>
          </div>
        );
      case 'default':
      default:
        return (
          <div className="max-w-2xl mx-auto">
            <ProfileSectionDefault />
            <LinksSection />
            {defaultVideoPlayer}
          </div>
        );
    }
  };
  
  const isFixedPositionVideo = videoId && profile && (profile.youtube_position === 'background' || profile.youtube_position === 'bottom-right');

  return (
    <div 
      className={cn("flex flex-col min-h-screen", pageForcedClasses)}
      style={pageBackgroundStyle}
    >
      {isFixedPositionVideo && <YouTubePlayer videoId={videoId} visibility={profile.youtube_visibility} position={profile.youtube_position} />}
      <div className="absolute top-8 right-8 z-10">
        <ThemeToggle />
      </div>
      <div className="container mx-auto py-8 max-w-4xl flex-grow">
        {renderLayout()}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default UserPage;