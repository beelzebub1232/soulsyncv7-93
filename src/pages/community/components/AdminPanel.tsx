
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { ProfessionalVerificationRequest, ReportedContent } from "@/types/community";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "../utils/dateUtils";
import { Shield, AlertTriangle, Check, X, ExternalLink } from "lucide-react";

export function AdminPanel() {
  const { user, getProfessionalRequests, approveProfessional, rejectProfessional } = useUser();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>("professionals");
  const [professionalRequests, setProfessionalRequests] = useState<ProfessionalVerificationRequest[]>([]);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  
  useEffect(() => {
    // Load professional verification requests
    if (user?.role === 'admin') {
      const requests = getProfessionalRequests();
      setProfessionalRequests(requests);
      
      // Load reported content
      const storedReports = localStorage.getItem('soulsync_reported_content');
      if (storedReports) {
        setReportedContent(JSON.parse(storedReports));
      }
    }
  }, [user, getProfessionalRequests]);
  
  const handleApproveVerification = (requestId: string) => {
    approveProfessional(requestId);
    
    // Update local state
    setProfessionalRequests(prev => 
      prev.filter(req => req.id !== requestId)
    );
    
    toast({
      title: "Professional approved",
      description: "Professional account has been verified successfully."
    });
  };
  
  const handleRejectVerification = (requestId: string) => {
    rejectProfessional(requestId);
    
    // Update local state
    setProfessionalRequests(prev => 
      prev.filter(req => req.id !== requestId)
    );
    
    toast({
      title: "Professional rejected",
      description: "Professional account verification has been rejected."
    });
  };
  
  const handleApproveReport = (reportId: string) => {
    const storedReports = localStorage.getItem('soulsync_reported_content');
    if (storedReports) {
      const reports: ReportedContent[] = JSON.parse(storedReports);
      const updatedReports = reports.map(report => 
        report.id === reportId ? 
          {
            ...report,
            status: "approved" as const,
            reviewDate: new Date(),
            reviewedBy: user?.id
          } : report
      );
      
      localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
      setReportedContent(updatedReports);
      
      toast({
        title: "Report approved",
        description: "The reported content has been approved and will remain visible."
      });
    }
  };
  
  const handleRejectReport = (reportId: string) => {
    const storedReports = localStorage.getItem('soulsync_reported_content');
    if (storedReports) {
      const reports: ReportedContent[] = JSON.parse(storedReports);
      const updatedReports = reports.map(report => 
        report.id === reportId ? 
          {
            ...report,
            status: "rejected" as const,
            reviewDate: new Date(),
            reviewedBy: user?.id
          } : report
      );
      
      localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
      setReportedContent(updatedReports);
      
      // If rejecting report, also remove or hide the content
      if (report.contentType === 'post') {
        const storedPosts = localStorage.getItem('soulsync_forum_posts');
        if (storedPosts) {
          const posts = JSON.parse(storedPosts);
          const updatedPosts = posts.filter((post: any) => post.id !== report.contentId);
          localStorage.setItem('soulsync_forum_posts', JSON.stringify(updatedPosts));
        }
      } else if (report.contentType === 'reply') {
        const storedReplies = localStorage.getItem('soulsync_forum_replies');
        if (storedReplies) {
          const replies = JSON.parse(storedReplies);
          const updatedReplies = replies.filter((reply: any) => reply.id !== report.contentId);
          localStorage.setItem('soulsync_forum_replies', JSON.stringify(updatedReplies));
        }
      }
      
      toast({
        title: "Report rejected",
        description: "The reported content has been removed."
      });
    }
  };
  
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Admin Access Required</h2>
        <p className="text-muted-foreground mt-2">You don't have permission to access this area.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="professionals" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>Professional Requests</span>
          </TabsTrigger>
          <TabsTrigger value="reported" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Reported Content</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="professionals" className="mt-4 space-y-4">
          {professionalRequests.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No pending professional verification requests.</p>
            </Card>
          ) : (
            professionalRequests.map(request => (
              <Card key={request.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{request.username}</h3>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                    <p className="mt-1">
                      <span className="font-medium">Occupation:</span> {request.occupation}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Submitted {formatRelativeTime(request.submissionDate)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs flex gap-1"
                      onClick={() => window.open(request.documentUrl, '_blank')}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Document
                    </Button>
                    
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleRejectVerification(request.id)}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveVerification(request.id)}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="reported" className="mt-4 space-y-4">
          {reportedContent.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No reported content to review.</p>
            </Card>
          ) : (
            reportedContent.map(report => (
              <Card key={report.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        Reported {report.contentType}
                      </h3>
                      <Badge variant="outline">ID: {report.contentId.substring(0, 8)}</Badge>
                    </div>
                    
                    <p className="mt-2">
                      <span className="font-medium">Reason:</span> {report.reason}
                    </p>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Reported {formatRelativeTime(report.date)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // Navigate to the content
                        // This would require additional implementation to navigate to the specific post/reply
                      }}
                    >
                      View Content
                    </Button>
                    
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleRejectReport(report.id)}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveReport(report.id)}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Keep
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
