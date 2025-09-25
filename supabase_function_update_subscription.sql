-- Kullanıcı abonelik planını güncelleyen fonksiyon
CREATE OR REPLACE FUNCTION update_user_subscription(user_id UUID, new_plan TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET subscription_plan = new_plan
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonksiyonu herkesin çağırabilmesi için izin ver
GRANT EXECUTE ON FUNCTION update_user_subscription TO anon;
GRANT EXECUTE ON FUNCTION update_user_subscription TO authenticated;