
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Shield, Flag, Users, FileCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfessionalVerificationRequest, ForumPost, ForumReply, ReportedContent } from "@/types/community";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "../utils/dateUtils";

export function AdminPanel() {
  const { user, getProfessionalRequests, approveProfessional, rejectProfessional } = useUser();
  const { toast } = useToast();
  const [professionalRequests, setProfessionalRequests] = useState<ProfessionalVerificationRequest[]>([]);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [reportedPosts, setReportedPosts] = useState<ForumPost[]>([]);
  const [reportedReplies, setReportedReplies] = useState<ForumReply[]>([]);
  
  useEffect(() => {
    if (user?.role !== 'admin') return;
    
    // Load professional verification requests
    const requests = getProfessionalRequests();
    setProfessionalRequests(requests);
    
    // Load reported content
    const storedReports = localStorage.getItem('soulsync_reported_content');
    if (storedReports) {
      const parsedReports: ReportedContent[] = JSON.parse(storedReports);
      setReportedContent(parsedReports.filter(report => report.status === 'pending'));
      
      // Load the actual reported posts and replies
      const storedPosts = localStorage.getItem('soulsync_forum_posts');
      const storedReplies = localStorage.getItem('soulsync_forum_replies');
      
      if (storedPosts) {
        const parsedPosts: ForumPost[] = JSON.parse(storedPosts);
        const filteredPosts = parsedPosts.filter(post => 
          post.isReported && 
          parsedReports.some(report => report.contentId === post.id && report.contentType === 'post' && report.status === 'pending')
        );
        setReportedPosts(filteredPosts);
      }
      
      if (storedReplies) {
        const parsedReplies: ForumReply[] = JSON.parse(storedReplies);
        const filteredReplies = parsedReplies.filter(reply => 
          reply.isReported && 
          parsedReports.some(report => report.contentId === reply.id && report.contentType === 'reply' && report.status === 'pending')
        );
        setReportedReplies(filteredReplies);
      }
    }
  }, [user, getProfessionalRequests]);
  
  const handleApproveRequest = (requestId: string) => {
    approveProfessional(requestId);
    setProfessionalRequests(prevRequests => 
      prevRequests.filter(request => request.id !== requestId)
    );
  };
  
  const handleRejectRequest = (requestId: string) => {
    rejectProfessional(requestId);
    setProfessionalRequests(prevRequests => 
      prevRequests.filter(request => request.id !== requestId)
    );
  };
  
  const handleApproveContent = (reportId: string) => {
    // Mark the report as approved
    const updatedReports = reportedContent.map(report => 
      report.id === reportId 
        ? { ...report, status: 'approved', reviewDate: new Date(), reviewedBy: user?.id }
        : report
    );
    
    localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
    setReportedContent(updatedReports.filter(report => report.status === 'pending'));
    
    // Also update the post/reply
    const report = reportedContent.find(r => r.id === reportId);
    if (!report) return;
    
    if (report.contentType === 'post') {
      const storedPosts = localStorage.getItem('soulsync_forum_posts');
      if (storedPosts) {
        const parsedPosts: ForumPost[] = JSON.parse(storedPosts);
        const updatedPosts = parsedPosts.map(post => 
          post.id === report.contentId ? { ...post, isReported: false } : post
        );
        localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
        setReportedPosts(prevPosts => prevPosts.filter(post => post.id !== report.contentId));
      }
    } else {
      const storedReplies = localStorage.getItem('soulsync_forum_replies');
      if (storedReplies) {
        const parsedReplies: ForumReply[] = JSON.parse(storedReplies);
        const updatedReplies = parsedReplies.map(reply => 
          reply.id === report.contentId ? { ...reply, isReported: false } : reply
        );
        localStorage.setItem('soulsync_forum_replies', JSON.stringify(updatedReplies));
        setReportedReplies(prevReplies => prevReplies.filter(reply => reply.id !== report.contentId));
      }
    }
    
    toast({
      title: "Content approved",
      description: "The reported content has been approved and will remain visible."
    });
  };
  
  const handleRemoveContent = (reportId: string) => {
    // Mark the report as rejected
    const updatedReports = reportedContent.map(report => 
      report.id === reportId 
        ? { ...report, status: 'rejected', reviewDate: new Date(), reviewedBy: user?.id }
        : report
    );
    
    localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
    setReportedContent(updatedReports.filter(report => report.status === 'pending'));
    
    // Also remove the post/reply
    const report = reportedContent.find(r => r.id === reportId);
    if (!report) return;
    
    if (report.contentType === 'post') {
      const storedPosts = localStorage.getItem('soulsync_forum_posts');
      if (storedPosts) {
        const parsedPosts: ForumPost[] = JSON.parse(storedPosts);
        const updatedPosts = parsedPosts.filter(post => post.id !== report.contentId);
        localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
        setReportedPosts(prevPosts => prevPosts.filter(post => post.id !== report.contentId));
      }
    } else {
      const storedReplies = localStorage.getItem('soulsync_forum_replies');
      if (storedReplies) {
        const parsedReplies: ForumReply[] = JSON.parse(storedReplies);
        const updatedReplies = parsedReplies.filter(reply => reply.id !== report.contentId);
        localStorage.setItem('soulsync_forum_replies', JSON.stringify(updatedReplies));
        setReportedReplies(prevReplies => prevReplies.filter(reply => reply.id !== report.contentId));
      }
    }
    
    toast({
      title: "Content removed",
      description: "The reported content has been removed from the community."
    });
  };
  
  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized Access</CardTitle>
          <CardDescription>
            You do not have permission to access the Admin Panel.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Tabs defaultValue="professionals" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="professionals">
          <Shield className="h-4 w-4 mr-2" />
          Professional Verification
        </TabsTrigger>
        <TabsTrigger value="reports">
          <Flag className="h-4 w-4 mr-2" />
          Reported Content
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="professionals" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              Professional Verification Requests
            </CardTitle>
            <CardDescription>
              Review and verify professional account requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {professionalRequests.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No pending verification requests
              </div>
            ) : (
              <div className="space-y-4">
                {professionalRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{request.username}</h3>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                        </div>
                        <Badge>{formatRelativeTime(request.submissionDate)}</Badge>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div>
                          <span className="text-sm font-medium">Occupation: </span>
                          <span className="text-sm">{request.occupation}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Document: </span>
                          <a 
                            href={request.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <FileCheck className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reports" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Flag className="h-5 w-5 mr-2" />
              Reported Content
            </CardTitle>
            <CardDescription>
              Review and moderate reported posts and replies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportedPosts.length === 0 && reportedReplies.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No reported content to review
              </div>
            ) : (
              <div className="space-y-4">
                {reportedPosts.map((post) => {
                  const report = reportedContent.find(r => r.contentId === post.id && r.contentType === 'post');
                  if (!report) return null;
                  
                  return (
                    <div 
                      key={post.id} 
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{post.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.content}</p>
                          </div>
                          <Badge variant="destructive">Post</Badge>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <div>
                            <span className="text-sm font-medium">Author: </span>
                            <span className="text-sm">
                              {post.isAnonymous ? 'Anonymous' : post.author}
                              {post.authorRole === 'professional' && !post.isAnonymous && (
                                <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">
                                  Professional
                                </Badge>
                              )}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium">Category: </span>
                            <span className="text-sm">{post.categoryName}</span>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium">Report reason: </span>
                            <span className="text-sm text-destructive">{report.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 flex justify-end space-x-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveContent(report.id)}
                        >
                          Remove Content
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApproveContent(report.id)}
                        >
                          Approve Content
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {reportedReplies.map((reply) => {
                  const report = reportedContent.find(r => r.contentId === reply.id && r.contentType === 'reply');
                  if (!report) return null;
                  
                  return (
                    <div 
                      key={reply.id} 
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-muted-foreground line-clamp-2">{reply.content}</p>
                          <Badge variant="destructive">Reply</Badge>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <div>
                            <span className="text-sm font-medium">Author: </span>
                            <span className="text-sm">
                              {reply.isAnonymous ? 'Anonymous' : reply.author}
                              {reply.authorRole === 'professional' && !reply.isAnonymous && (
                                <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4">
                                  Professional
                                </Badge>
                              )}
                            </span>
                          </div>
                          
                          <div>
                            <span className="text-sm font-medium">Report reason: </span>
                            <span className="text-sm text-destructive">{report.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted p-3 flex justify-end space-x-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveContent(report.id)}
                        >
                          Remove Content
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApproveContent(report.id)}
                        >
                          Approve Content
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
