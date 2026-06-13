import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, ArrowRight } from "lucide-react";

const LoginChoice = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-3xl text-foreground">CareerPrep</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">
            Choose Your <span className="gradient-text">Portal</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Select how you want to access the platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Portal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-primary/20">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">User Portal</CardTitle>
                <CardDescription className="text-base">
                  For students and job seekers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Access AI-powered career assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Master skills with interactive courses
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Build professional network
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Track progress and achievements
                  </li>
                </ul>
                
                <Link to="/login">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25">
                    Continue as User
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Admin Portal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-secondary/20">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Admin Portal</CardTitle>
                <CardDescription className="text-base">
                  For platform administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Manage users and accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Monitor platform analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Control course content
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    System configuration
                  </li>
                </ul>
                
                <Link to="/admin/login">
                  <Button variant="outline" className="w-full border-secondary/50 hover:bg-secondary/10">
                    Continue as Admin
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            New to CareerPrep?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginChoice;
