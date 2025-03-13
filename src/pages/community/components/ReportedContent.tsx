
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Report } from "@/types/community";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ReportedContent() {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      contentId: "post123",
      contentType: "post",
      reportedBy: "user456",
      reason: "Inappropriate content",
      date: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "pending"
    },
    {
      id: "2",
      contentId: "reply789",
      contentType: "reply",
      reportedBy: "user123",
      reason: "Offensive language",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      status: "pending"
    }
  ]);

  const handleDismiss = (id: string) => {
    setReports(prev => 
      prev.map(r => r.id === id ? {...r, status: 'reviewed'} : r)
    );
    toast({
      title: "Report dismissed",
      description: "The report has been marked as reviewed",
    });
  };

  const openDeleteDialog = (id: string) => {
    setSelectedReportId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedReportId) {
      setReports(prev => 
        prev.map(r => r.id === selectedReportId ? {...r, status: 'resolved'} : r)
      );
      toast({
        title: "Content removed",
        description: "The reported content has been deleted",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (pendingReports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reported Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No reported content</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reported Content ({pendingReports.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingReports.map((report) => (
            <div key={report.id} className="card-primary p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {report.contentType === 'post' ? 'Post Reported' : 'Reply Reported'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Reported {formatDistanceToNow(report.date, { addSuffix: true })}
                  </p>
                </div>
                <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {report.status}
                </div>
              </div>

              <div className="bg-accent/50 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Reason for reporting</p>
                <p>{report.reason}</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDismiss(report.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Dismiss
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => openDeleteDialog(report.id)}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete Content
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
