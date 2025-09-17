import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, MessageSquare, Trophy, Calendar, Users } from "lucide-react";
import { fetchPosts } from "@/utils/api";

interface Post {
  id: number;
  message: string;
  category: string;
  upvotes: number;
  created_at: string;
  is_hidden: boolean;
}

export const Analytics = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPosts();
        setPosts(
          data.map((p: any) => ({
            id: p.id,
            message: p.message,
            category: p.category,
            upvotes: p.upvotes,
            created_at: p.timestamp,
            is_hidden: false,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  
  if (loading) {
    return <p className="text-center py-10">Analyzing community data...</p>;
  }

  const totalPosts = posts.length;
  const totalUpvotes = posts.reduce((s, p) => s + p.upvotes, 0);
  const avgUpvotes = totalPosts > 0 ? (totalUpvotes / totalPosts).toFixed(1) : "0";
  const topPosts = [...posts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Community Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card><CardContent className="p-6"><p className="text-2xl font-bold">{totalPosts}</p><p>Total Posts</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-2xl font-bold">{totalUpvotes}</p><p>Total Upvotes</p></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-2xl font-bold">{avgUpvotes}</p><p>Avg Upvotes</p></CardContent></Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Most Upvoted Posts</CardTitle></CardHeader>
            <CardContent>
              {topPosts.map((p) => (
                <div key={p.id} className="p-3 mb-2 border rounded">
                  <Badge>{p.category}</Badge> - {p.message} ({p.upvotes} 👍)
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
