
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Check, 
  MessageSquare, 
  ExternalLink,
  X, 
  Flag
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Report } from "@/types/community";
import { useToast } from "@/hooks/use-toast";

export default function ReportedContent() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      contentId: "post123",
      contentType: "post",
      reportedBy: "user456",
      reason: "This post contains harmful advice that could be dangerous to those with anxiety disorders.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "2",
      contentId: "reply789",
      contentType: "reply",
      reportedBy: "user789",
      reason: "This reply contains inappropriate language and is offensive.",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "pending"
    }
  ]);

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
        <CardContent className="space-y-4">
          {pendingReports.map((report) => (
            <div key={report.id} className="border rounded-lg p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      Reported {report.contentType === 'post' ? 'Post' : 'Reply'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(report.date, { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="mt-2 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm mb-2 font-medium">Reason for report:</p>
                    <p className="text-sm text-muted-foreground">{report.reason}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-muted-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View Content
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDismissReport(report.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                      <Button 
                        variant="default"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleApproveReport(report.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Remove Content
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
