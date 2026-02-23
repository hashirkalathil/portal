import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Users, BarChart3, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/80 px-6 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Sabeel Institute</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-muted-foreground hover:text-primary">
              <Link href="/faculty/login">Faculty Login</Link>
            </Button>
            <Button asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
              <Link href="/login">
                Student Portal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden py-24 sm:py-32">
          {/* Background Gradients */}
          <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-secondary/20 blur-3xl opacity-50 mix-blend-multiply" />
          <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl opacity-50 mix-blend-multiply" />

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/10 bg-white px-4 py-1.5 text-sm font-medium text-primary shadow-sm mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Now available for Academic Year 2026
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl lg:text-8xl mb-8">
              The Modern Standard for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#2F855A] to-secondary">Academic Excellence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Streamline administration, empower faculty, and engage students with a unified, high-performance portal designed for the future of education.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-white/50 backdrop-blur-sm hover:bg-white border-primary/10 text-primary hover:text-primary-dark shadow-sm hover:shadow-md transition-all duration-300" asChild>
                <Link href="#features">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 bg-white/50 relative border-t border-border/40">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">Everything you need to run your institute</h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">Robust tools for every role, seamlessly integrated into one cohesive platform.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[700px]">
              {/* Card 1: Large Left */}
              <div className="md:row-span-2 relative overflow-hidden rounded-[2rem] border border-border/50 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-secondary/10 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                      <Users className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Role-Based Access</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Dedicated portals for Students, Faculty, and Admins. Each view is tailored to the user's specific needs and permissions.
                    </p>
                  </div>
                  <div className="mt-12 rounded-2xl border border-border/50 bg-background/50 p-6 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-border" />
                      <div className="h-3 w-32 rounded-full bg-border" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2.5 w-full rounded-full bg-white" />
                      <div className="h-2.5 w-3/4 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Top Middle */}
              <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-500">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground text-sm">Track attendance, grades, and financial health instantly with powered insights.</p>
              </div>

              {/* Card 3: Top Right */}
              <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-foreground p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 text-white group">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-foreground transition-all duration-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
                <p className="text-white/60 text-sm">Data encryption and secure authentication built-in for peace of mind.</p>
              </div>

              {/* Card 4: Bottom Wide */}
              <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group">
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Anywhere Access</h3>
                    <p className="max-w-md text-muted-foreground leading-relaxed">
                      Access your schedule, submit assignments, or check notices from any device, anywhere in the world.
                    </p>
                  </div>
                  {/* Decor */}
                  <div className="hidden sm:block absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                    <Clock className="h-48 w-48 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">&copy; {new Date().getFullYear()} Sabeel Institute. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/admin/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Admin Login</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
