
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Check, 
  MessageSquare, 
  ExternalLink,
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
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'reply';
  reportedBy: string;
  reason: string;
  content: string;
  date: Date;
  status: 'pending' | 'resolved' | 'reviewed';
}

export default function ReportedContent() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      contentId: "post123",
      contentType: "post",
      reportedBy: "user456",
      reason: "This post contains harmful advice that could be dangerous to those with anxiety disorders.",
      content: "I found this technique that helps with anxiety: just hold your breath for 3 minutes. Your body will naturally reset itself.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "2",
      contentId: "reply789",
      contentType: "reply",
      reportedBy: "user789",
      reason: "This reply contains inappropriate language and is offensive.",
      content: "That's a terrible idea! Only an idiot would think this way. You should be ashamed.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "3",
      contentId: "post456",
      contentType: "post",
      reportedBy: "user123",
      reason: "This post contains misinformation about depression treatments.",
      content: "I've discovered that you can cure depression by just avoiding all negative people. It's not a real illness, just a choice.",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "4",
      contentId: "reply234",
      contentType: "reply",
      reportedBy: "user567",
      reason: "This reply is promoting harmful behavior.",
      content: "When I feel down, I just stop eating for a few days. The hunger helps me focus on something else.",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: "pending"
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);

  const handleApproveReport = (id: string) => {
    setReports(prev => 
      prev.map(r => r.id === id ? {...r, status: 'resolved'} : r)
    );
    toast({
      title: "Report resolved",
      description: "The reported content has been removed",
    });
  };

  const handleDismissReport = (id: string) => {
    setReports(prev => 
      prev.map(r => r.id === id ? {...r, status: 'reviewed'} : r)
    );
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
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="divide-y">
              {pendingReports.map((report) => (
                <div key={report.id} className="p-4 md:p-5 hover:bg-muted/30">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
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
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between mt-2 pl-11">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="justify-start sm:justify-center"
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
                          className="flex-1 sm:flex-none"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Dismiss
                        </Button>
                        <Button 
                          variant="default"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReport?.contentType === 'post' ? 'Reported Post' : 'Reported Reply'}
            </DialogTitle>
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
                  <p className="text-sm mb-1.5"><strong>Reported by:</strong> {selectedReport.reportedBy}</p>
                  <p className="text-sm mb-1.5"><strong>Date:</strong> {selectedReport.date.toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Reason:</strong> {selectedReport.reason}</p>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setContentDialogOpen(false)}
            >
              Close
            </Button>
            {selectedReport && (
              <>
                <Button 
                  variant="outline" 
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
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    handleApproveReport(selectedReport.id);
                    setContentDialogOpen(false);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Remove Content
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
