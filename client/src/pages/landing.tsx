import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PwCLogo } from "@/components/pwc-logo";
import { ArrowRight, Play, ExternalLink, Users, Globe, TrendingUp, Award, Lightbulb, Target } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <PwCLogo size="sm" />
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Industries</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Research and Insights</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About us</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Careers</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-sm">
                Search
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  We unite expertise and tech{" "}
                  <span className="text-primary">so you can</span>{" "}
                  outthink, outpace and outperform
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Transform your business with our integrated approach combining deep industry knowledge with cutting-edge technology solutions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <Users className="h-12 w-12 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-600">Professional Team</p>
                      <p className="text-2xl font-bold text-gray-900">Working Together</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Catalysing value creation in Indian global capability centres
              </h2>
              <p className="text-gray-300 mb-6">
                PwC India's latest research reveals that value creation can be comprehensively faster when global capability centres (GCCs) are fully unleashed for bold new opportunities.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Click here to explore more
              </Button>
            </div>
            <div className="bg-primary/10 rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold text-primary mb-2">11-12%</div>
              <p className="text-lg">India GCCs set to generate value at CAGR between FY25-29</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Future Unplugged: Navigating what's next</h2>
            <p className="text-lg text-gray-600">Episode 3 | Featuring Saugata Gupta, CEO and Managing Director at Marico Ltd</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Featured Content */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full bg-primary/90 hover:bg-primary text-white">
                      <Play className="h-6 w-6 mr-2" />
                      Watch Episode
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge className="mb-3 bg-primary/10 text-primary">From the chairperson's desk</Badge>
                  <h3 className="text-xl font-bold mb-2">Future transformation. Navigating what's next</h3>
                  <p className="text-gray-600">
                    From macroeconomic challenges to changing consumer behavior and shifting investor priorities. This series offers an immersive glimpse into the evolving landscape of India Inc.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Cards */}
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-red-500 to-orange-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Transformation</h3>
                  <p className="text-sm text-gray-600">Transforming the way you do business</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lightbulb className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Sustainability</h3>
                  <p className="text-sm text-gray-600">Leading tomorrow's sustainability promise</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Trust</h3>
                  <p className="text-sm text-gray-600">Trust begins with real trusted offerings</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What's new</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500"></div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Container return operations</h3>
                <p className="text-xs text-gray-600">After 20 years of deregulation</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900"></div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Unlocking growth opportunities</h3>
                <p className="text-xs text-gray-600">In India's electronic manufacturing</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Perspectives on Your State</h3>
                <p className="text-xs text-gray-600">Our GPS: Building a resilient tomorrow</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-500"></div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Making the case for global workforce migration</h3>
                <p className="text-xs text-gray-600">Building stronger economies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Videos</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Explore the DIVERSE advantage with PwC India</h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-primary relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">AI Unplugged: 'Where AI meets business, innovation, and transformation'</h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Exclusive webcast on Income-Tax Bill 2024</h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gray-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-sm mb-2">Episode 3: Part 1: Data and automation leading AI transformation</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Transact to Transform</h2>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Transact to Transform with the PwC theme. Now by applying it, instead, we'll reinvent your business model and advance your sustainable growth strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Alumni</h3>
              <p className="text-primary-foreground/90">
                Enabling excellence. Connecting aspirations.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Careers</h3>
              <p className="text-primary-foreground/90">
                Opportunity to deliver on our shared purpose by making real impact.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}