
import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import { cn } from "@/lib/utils";
import { Heart, ShieldCheck, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-mindscape-primary to-purple-400 shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-display font-semibold tracking-tight">
            Welcome to SoulSync
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Your personal mental well-being companion
          </p>
        </div>
        
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setMode("login")}
              className={cn(
                "py-2 px-4 text-sm font-medium rounded-full transition-all",
                mode === "login" 
                  ? "bg-mindscape-primary text-white" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={cn(
                "py-2 px-4 text-sm font-medium rounded-full transition-all",
                mode === "register" 
                  ? "bg-mindscape-primary text-white" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              Create Account
            </button>
          </div>
          
          <div className="bg-card px-4 py-8 sm:px-8 shadow sm:rounded-xl sm:px-8 border border-border/50 animate-enter">
            {mode === "login" ? <Login /> : <Register />}
          </div>
          
          <div className="mt-4 text-center space-y-3">
            <div className="flex justify-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => navigate('/auth/professional')}
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-xs">Professional Login</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => navigate('/auth/admin')}
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs">Admin Login</span>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
