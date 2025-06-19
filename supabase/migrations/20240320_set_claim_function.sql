-- Create function to set claims
CREATE OR REPLACE FUNCTION set_claim(claim text, value text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.' || claim, value, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 