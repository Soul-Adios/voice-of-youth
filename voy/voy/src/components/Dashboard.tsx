import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PostCard } from "./PostCard";
import { toast } from "@/hooks/use-toast";
import { TrendingUp, Clock, MessageSquare, Filter } from "lucide-react";
import { fetchPosts } from "@/utils/api";

interface Post {
  id: number;
  message: string;
  category: string;
  upvotes: number;
  created_at: string;
  is_hidden: boolean;
}

export const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'upvotes'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModeration, setShowModeration] = useState(false);

  const categories = ['all', 'Education', 'Corruption', 'Environment', 'Equality', 'Mental Health', 'Innovation'];

  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      const normalized = data.map((p: any) => ({
        id: p.id,
        message: p.message,
        category: p.category,
        upvotes: p.upvotes,
        created_at: p.timestamp,
        is_hidden: false, // Django doesn't have this
      }));

      let filtered = normalized;
      if (filterCategory !== "all") {
        filtered = filtered.filter((post) => post.category === filterCategory);
      }

      if (sortBy === "recent") {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else {
        filtered.sort((a, b) => b.upvotes - a.upvotes);
      }

      setPosts(filtered);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Failed to Load Posts",
        description: "Could not load posts from server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [sortBy, filterCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Loading voices from the community...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalUpvotes = posts.reduce((sum, p) => sum + p.upvotes, 0);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Community Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{posts.length}</p>
              <p className="text-sm text-muted-foreground">Total Voices</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{totalUpvotes}</p>
              <p className="text-sm text-muted-foreground">Total Upvotes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold">{categories.length - 1}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters & Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Label>Sort by:</Label>
                <Select value={sortBy} onValueChange={(v: 'recent' | 'upvotes') => setSortBy(v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="upvotes">Most Upvoted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label>Category:</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={showModeration} onCheckedChange={setShowModeration} />
                <Label>Moderation Mode</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        {posts.length === 0 ? (
          <Card><CardContent className="p-12 text-center">No posts available</CardContent></Card>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={loadPosts} showModerationControls={showModeration} />
          ))
        )}
      </div>
    </div>
  );
};
