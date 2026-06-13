import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin credentials (in production, these should be verified against a secure backend)
  const ADMIN_EMAIL = "admin@careerprep.com";
  const ADMIN_PASSWORD = "admin123";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!email.trim() || !password) return;

      // Verify admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session in localStorage
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', email);
        toast.success("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid admin credentials");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = email.trim().length > 0 && password.length > 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-foreground">CareerPrep Admin</span>
          </Link>
        </div>

        <Card className="border-border/60 bg-background/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Access the admin dashboard with your credentials
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@careerprep.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Demo Credentials:</strong><br />
                  Email: admin@careerprep.com<br />
                  Password: admin123
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in as Admin"}
              </Button>

              <div className="text-sm text-muted-foreground">
                <span>Not an admin? </span>
                <Link to="/login" className="text-primary underline underline-offset-4">
                  User Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
