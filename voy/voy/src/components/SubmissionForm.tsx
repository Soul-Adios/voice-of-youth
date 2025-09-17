import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createPost } from "@/utils/api";
import { MessageSquare, Send } from "lucide-react";

const categories = ["Education", "Corruption", "Environment", "Equality", "Mental Health", "Innovation"];

export const SubmissionForm = () => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !category) {
      toast({ title: "Missing info", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await createPost(message, category);
      toast({ title: "Submitted!", description: "Your message was shared." });
      setMessage(""); setCategory("");
    } catch (err) {
      toast({ title: "Failed to submit", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader><CardTitle>Share Your Voice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your thoughts..." />
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : <><Send className="h-4 w-4 mr-2" /> Submit</>}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
