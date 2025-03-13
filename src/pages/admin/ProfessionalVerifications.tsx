
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function ProfessionalVerifications() {
  const { toast } = useToast();
  const { pendingProfessionals, verifyProfessional, rejectProfessional } = useUser();

  if (pendingProfessionals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Professional Verifications</h1>
          <p className="text-muted-foreground">Review and approve professional account requests.</p>
        </div>
        
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Pending Verifications</h3>
              <p className="text-muted-foreground">All professional verification requests have been processed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Professional Verifications</h1>
        <p className="text-muted-foreground">Review and approve professional account requests.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Verification Requests ({pendingProfessionals.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingProfessionals.map((professional) => (
            <div key={professional.id} className="border rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{professional.username}</h3>
                  <p className="text-sm text-muted-foreground">{professional.occupation}</p>
                  <p className="text-sm text-muted-foreground">{professional.email}</p>
                </div>
              </div>

              {professional.identityDocument && (
                <div className="bg-accent/50 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Verification Document</p>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <a href={professional.identityDocument} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View Document
                    </a>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    rejectProfessional(professional.id);
                    toast({
                      title: "Professional Rejected",
                      description: `${professional.username}'s application has been rejected.`,
                    });
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => {
                    verifyProfessional(professional.id);
                    toast({
                      title: "Professional Approved",
                      description: `${professional.username} has been verified as a professional.`,
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
