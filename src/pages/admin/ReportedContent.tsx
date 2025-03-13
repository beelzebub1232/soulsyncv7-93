
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Check, 
  MessageSquare, 
  X, 
  Flag,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Report } from "@/types/community";

export default function ReportedContent() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  // Load reported content from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem('soulsync_reported_content');
    if (savedReports) {
      try {
        const parsedReports = JSON.parse(savedReports);
        // Convert date strings to Date objects
        const processedReports = parsedReports.map((report: any) => ({
          ...report,
          date: new Date(report.date)
        }));
        setReports(processedReports);
      } catch (error) {
        console.error('Failed to parse reported content:', error);
        // Fallback to empty array
        setReports([]);
      }
    } else {
      // If no reports found, initialize with empty array
      setReports([]);
      localStorage.setItem('soulsync_reported_content', JSON.stringify([]));
    }
  }, []);

  const handleApproveReport = (id: string) => {
    // Mark the report as resolved
    const updatedReports = reports.map(r => 
      r.id === id ? {...r, status: 'resolved' as 'resolved'} : r
    );
    setReports(updatedReports);
    localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
    
    // Find the reported content and remove it
    const report = reports.find(r => r.id === id);
    if (report) {
      // If it's a post
      if (report.contentType === 'post') {
        const postsStorageKey = `soulsync_posts_${report.categoryId}`;
        const savedPosts = localStorage.getItem(postsStorageKey);
        if (savedPosts) {
          const posts = JSON.parse(savedPosts);
          const updatedPosts = posts.filter((post: any) => post.id !== report.contentId);
          localStorage.setItem(postsStorageKey, JSON.stringify(updatedPosts));
        }
      }
      // If it's a reply
      else if (report.contentType === 'reply') {
        const repliesStorageKey = `soulsync_replies_${report.postId}`;
        const savedReplies = localStorage.getItem(repliesStorageKey);
        if (savedReplies) {
          const replies = JSON.parse(savedReplies);
          const updatedReplies = replies.filter((reply: any) => reply.id !== report.contentId);
          localStorage.setItem(repliesStorageKey, JSON.stringify(updatedReplies));
        }
      }
    }
    
    toast({
      title: "Report resolved",
      description: "The reported content has been removed",
    });
  };

  const handleDismissReport = (id: string) => {
    const updatedReports = reports.map(r => 
      r.id === id ? {...r, status: 'reviewed' as 'reviewed'} : r
    );
    setReports(updatedReports);
    localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
    
    toast({
      title: "Report dismissed",
      description: "The reported content has been kept",
    });
  };

  const handleViewContent = (report: Report) => {
    setSelectedReport(report);
    setContentDialogOpen(true);
  };

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (pendingReports.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reported Content</h1>
          <p className="text-muted-foreground">Review and moderate reported content from the community.</p>
        </div>
        
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Flag className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Pending Reports</h3>
              <p className="text-muted-foreground">All content reports have been addressed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reported Content</h1>
        <p className="text-muted-foreground">Review and moderate reported content from the community.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Reports ({pendingReports.length})</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="divide-y">
              {pendingReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-muted/30">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              Reported {report.contentType === 'post' ? 'Post' : 'Reply'}
                            </p>
                            <Badge variant={report.contentType === 'post' ? 'default' : 'outline'} className="text-xs">
                              {report.contentType}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(report.date, { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="mt-2 p-3 bg-muted/50 rounded-md">
                          <p className="text-sm mb-2 font-medium">Reason for report:</p>
                          <p className="text-sm text-muted-foreground">{report.reason}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2 pl-11">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="justify-start"
                        onClick={() => handleViewContent(report)}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        View Reported Content
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDismissReport(report.id)}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Dismiss
                        </Button>
                        <Button 
                          variant="default"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-1"
                          onClick={() => handleApproveReport(report.id)}
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Remove Content
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Content Preview Dialog */}
      <Dialog open={contentDialogOpen} onOpenChange={setContentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.contentType === 'post' ? 'Reported Post' : 'Reported Reply'}
            </DialogTitle>
            <DialogDescription>
              Reported by: {selectedReport?.reportedBy}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReport && (
              <>
                <div className={cn(
                  "p-4 rounded-md border",
                  "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                )}>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm mb-1 font-medium">Content:</p>
                      <p className="text-sm">{selectedReport.content}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm mb-1.5"><strong>Date:</strong> {selectedReport.date.toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Reason:</strong> {selectedReport.reason}</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => setContentDialogOpen(false)}
              className="w-full"
            >
              Close
            </Button>
            {selectedReport && (
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    handleDismissReport(selectedReport.id);
                    setContentDialogOpen(false);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
                <Button 
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 flex-1"
                  onClick={() => {
                    handleApproveReport(selectedReport.id);
                    setContentDialogOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Remove Content
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
