import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type SubscriptionPlan = 'free' | 'pro';

export interface UseSubscriptionReturn {
  plan: SubscriptionPlan;
  isPro: boolean;
  isLoading: boolean;
}

export const useSubscription = (user: User | null): UseSubscriptionReturn => {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionPlan = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Abonelik planı yüklenirken hata:', error);
      } else {
        // Veritabanından gelen değeri güvenli bir şekilde işliyoruz
        setPlan((data.subscription_plan as SubscriptionPlan) || 'free');
      }
      setIsLoading(false);
    };

    fetchSubscriptionPlan();
  }, [user]);

  return {
    plan,
    isPro: plan === 'pro',
    isLoading,
  };
};