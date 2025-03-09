
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useForumPost } from './hooks/useForumPost';
import { PostDetail } from './components/PostDetail';
import { ReplyForm } from './components/ReplyForm';
import { ReplyCard } from './components/ReplyCard';
import { MessageSquare } from 'lucide-react';

export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const {
    post,
    replies,
    isLoading,
    replyContent,
    setReplyContent,
    isAnonymous,
    setIsAnonymous,
    handleSubmitReply
  } = useForumPost(postId);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse-soft text-center">
          <div className="h-10 w-10 rounded-full bg-mindscape-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return <Navigate to="/community" replace />;
  }
  
  return (
    <div className="space-y-6">
      <PostDetail post={post} />
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-mindscape-primary" />
          <span>Replies</span>
        </h2>
        
        <ReplyForm
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          onSubmit={handleSubmitReply}
        />
        
        {replies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No replies yet. Be the first to reply!</p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {replies.map((reply) => (
              <ReplyCard key={reply.id} reply={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
