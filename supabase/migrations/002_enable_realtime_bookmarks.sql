-- Enable realtime for bookmarks so the list updates across tabs
alter publication supabase_realtime add table public.bookmarks;
