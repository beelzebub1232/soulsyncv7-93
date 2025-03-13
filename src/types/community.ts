
export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  color: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  author: string;
  authorId: string;
  authorRole: string;
  date: Date;
  replies: number;
  likes: number;
  isAnonymous: boolean;
  images?: string[];
  videoLinks?: string[];
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  authorRole: string;
  date: Date;
  likes: number;
  isAnonymous: boolean;
}

export interface PostReport {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  date: Date;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface CommunityNotification {
  id: string;
  userId: string;
  type: 'post' | 'reply' | 'like' | 'mention' | 'report';
  message: string;
  date: Date;
  read: boolean;
  targetId?: string; // ID of post, reply, etc.
}

// Add missing types below

export interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'like' | 'report' | 'verification';
  content: string;
  relatedId: string;
  date: Date;
  read: boolean;
}

export interface ProfessionalVerification {
  id: string;
  userId: string;
  name: string;
  occupation: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
  reviewedDate?: Date;
}

export interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'reply';
  reportedBy: string;
  reason: string;
  date: Date;
  status: 'pending' | 'reviewed' | 'resolved';
}
