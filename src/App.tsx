import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import Home from "./pages/Home";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserPage from './pages/UserPage';
import NotFound from "./pages/NotFound";
import LandingPage from './pages/LandingPage';
import Pricing from './pages/Pricing'; // Yeni eklenen sayfa

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Ana sayfa: Giriş yapmamış kullanıcılar için LandingPage, giriş yapmışlar için Dashboard */}
          <Route path="/" element={session ? <Navigate to="/dashboard" /> : <LandingPage />} />
          {/* Yönetim paneli: Sadece giriş yapmış kullanıcılar erişebilir */}
          <Route path="/dashboard" element={session ? <Home /> : <Navigate to="/login" />} />
          {/* Giriş sayfası: Giriş yapmamış kullanıcılar erişebilir, giriş yapmışlar Dashboard'a yönlendirilir */}
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
          {/* Kayıt sayfası: Giriş yapmamış kullanıcılar erişebilir, giriş yapmışlar Dashboard'a yönlendirilir */}
          <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/dashboard" />} />
          {/* Kullanıcı profil sayfası */}
          <Route path="/:username" element={<UserPage />} />
          {/* Fiyatlandırma sayfası */}
          <Route path="/pricing" element={<Pricing />} />
          {/* Bulunamayan sayfalar */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;