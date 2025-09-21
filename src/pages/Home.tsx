import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hoş Geldin, {user.email}</h1>
        <Button onClick={handleLogout} variant="outline">Çıkış Yap</Button>
      </header>
      <main className="mt-8">
        <p>Burası linklerini yöneteceğin alan olacak.</p>
      </main>
    </div>
  );
};

export default Home;