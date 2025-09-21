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
          <Route path="/" element={session ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/:username" element={<UserPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;