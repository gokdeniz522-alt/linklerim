CREATE OR REPLACE FUNCTION public.increment_link_click(link_id_to_update integer)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
      UPDATE public.links
      SET click_count = click_count + 1
      WHERE id = link_id_to_update;
    END;
    $$;