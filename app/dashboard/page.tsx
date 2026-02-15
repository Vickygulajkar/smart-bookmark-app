"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase";
import Navbar from "@/src/components/Navbar";
import BookmarkForm from "@/src/components/BookmarkForm";
import BookmarkList from "@/src/components/BookmarkList";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
      } else {
        setUser(data.user);
        fetchBookmarks();
      }
    };

    checkUser();
  }, []);

  // Real-time: sync bookmarks across tabs (e.g. add in one tab, see in another)
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async (title: string, url: string) => {
    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    if (error) {
      toast.error("Could not add bookmark", { description: error.message });
      return;
    }
    toast.success("Bookmark added", { description: title });
    fetchBookmarks();
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete bookmark", { description: error.message });
      return;
    }
    toast.success("Bookmark deleted");
    fetchBookmarks();
  };

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <Navbar />
      <BookmarkForm onAdd={addBookmark} />
      <BookmarkList bookmarks={bookmarks} onDelete={deleteBookmark} />
    </div>
  );
}
