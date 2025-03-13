
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  AlertTriangle
} from "lucide-react";

export function AdminLogin() {
  const { login } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    // Check for admin credentials
    if (email === "admin@gmail.com" && password === "123") {
      setIsLoading(true);
      
      try {
        // Use the existing login function but we'll specifically handle admin login
        await login(email, password);
        
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin dashboard.",
        });
        
        // Navigate to community page where admin panel is accessible
        navigate("/community");
      } catch (error) {
        setError("Authentication failed. Please try again.");
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Please check your admin credentials and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Invalid admin credentials");
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "Invalid admin credentials.",
      });
    }
  };
  
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 mb-4">
          <Shield className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold">Admin Access</h3>
        <p className="text-sm text-muted-foreground mt-1">Enter admin credentials to continue</p>
      </div>
      
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="text-sm font-medium">Admin Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-input bg-background/50 focus:border-mindscape-primary focus:ring-mindscape-primary/30"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 border-input bg-background/50 focus:border-mindscape-primary focus:ring-mindscape-primary/30"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full mt-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:opacity-90 transition-all"
        >
          {isLoading ? "Authenticating..." : "Admin Sign In"}
        </Button>
      </form>
    </div>
  );
}
