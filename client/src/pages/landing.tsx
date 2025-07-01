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
                <a href="/dashboard" className="text-sm font-medium text-pwc-orange hover:text-pwc-dark transition-colors font-semibold">Applications</a>
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
      <section className="relative overflow-hidden bg-pwc-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-charter text-pwc-dark leading-tight">
                  We unite expertise and tech{" "}
                  <span className="text-pwc-orange">so you can</span>{" "}
                  outthink, outpace and outperform
                </h1>
                <p className="text-lg text-helvetica text-pwc-dark leading-relaxed">
                  Transform your business with our integrated approach combining deep industry knowledge with cutting-edge technology solutions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-pwc-orange hover:bg-pwc-orange/90 text-white px-8 py-3 text-helvetica font-semibold" onClick={() => window.location.href = '/dashboard'}>
                  View Applications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3 text-helvetica font-semibold border-pwc-orange text-pwc-orange hover:bg-pwc-orange hover:text-white">
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
      <section className="pwc-section-spacing bg-pwc-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-charter text-white">
                Catalysing value creation in Indian global capability centres
              </h2>
              <p className="text-lg text-helvetica text-gray-300 mb-8 leading-relaxed">
                PwC India's latest research reveals that value creation can be comprehensively faster when global capability centres (GCCs) are fully unleashed for bold new opportunities.
              </p>
              <Button className="bg-pwc-orange hover:bg-pwc-orange/90 text-white text-helvetica font-semibold pwc-shadow">
                Click here to explore more
              </Button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center pwc-shadow-lg">
              <div className="text-6xl font-bold text-pwc-orange mb-4 text-charter">11-12%</div>
              <p className="text-lg text-helvetica text-white">India GCCs set to generate value at CAGR between FY25-29</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="pwc-section-spacing bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-charter text-pwc-dark mb-6">Future Unplugged: Navigating what's next</h2>
            <p className="text-xl text-helvetica text-pwc-dark/80">Episode 3 | Featuring Saugata Gupta, CEO and Managing Director at Marico Ltd</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Featured Content */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden pwc-shadow-lg">
                <div className="aspect-video bg-pwc-light relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full bg-pwc-orange/90 hover:bg-pwc-orange text-white text-helvetica font-semibold">
                      <Play className="h-6 w-6 mr-2" />
                      Watch Episode
                    </Button>
                  </div>
                </div>
                <CardContent className="p-8">
                  <Badge className="mb-4 bg-pwc-orange/10 text-pwc-orange text-helvetica font-semibold">From the chairperson's desk</Badge>
                  <h3 className="text-2xl font-bold mb-4 text-charter text-pwc-dark">Future transformation. Navigating what's next</h3>
                  <p className="text-pwc-dark/80 text-helvetica leading-relaxed">
                    From macroeconomic challenges to changing consumer behavior and shifting investor priorities. This series offers an immersive glimpse into the evolving landscape of India Inc.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Cards */}
            <div className="space-y-6">
              <Card className="overflow-hidden pwc-shadow">
                <div className="aspect-video bg-pwc-orange relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-charter text-pwc-dark">Transformation</h3>
                  <p className="text-sm text-helvetica text-pwc-dark/80">Transforming the way you do business</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden pwc-shadow">
                <div className="aspect-video bg-pwc-dark relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lightbulb className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-charter text-pwc-dark">Sustainability</h3>
                  <p className="text-sm text-helvetica text-pwc-dark/80">Leading tomorrow's sustainability promise</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden pwc-shadow">
                <div className="aspect-video bg-pwc-light relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="h-12 w-12 text-pwc-orange" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 text-charter text-pwc-dark">Trust</h3>
                  <p className="text-sm text-helvetica text-pwc-dark/80">Trust begins with real trusted offerings</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="pwc-section-spacing bg-pwc-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-charter text-pwc-dark mb-16">What's new</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-pwc-orange"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-3 text-charter text-pwc-dark">Container return operations</h3>
                <p className="text-xs text-helvetica text-pwc-dark/80">After 20 years of deregulation</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-pwc-dark"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-3 text-charter text-pwc-dark">Unlocking growth opportunities</h3>
                <p className="text-xs text-helvetica text-pwc-dark/80">In India's electronic manufacturing</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-gradient-to-br from-pwc-orange to-pwc-dark"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-3 text-charter text-pwc-dark">Perspectives on Your State</h3>
                <p className="text-xs text-helvetica text-pwc-dark/80">Our GPS: Building a resilient tomorrow</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-pwc-orange"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-3 text-charter text-pwc-dark">Making the case for global workforce migration</h3>
                <p className="text-xs text-helvetica text-pwc-dark/80">Building stronger economies</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="pwc-section-spacing bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-charter text-pwc-dark mb-16">Videos</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-pwc-dark relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-2 text-charter text-pwc-dark">Explore the DIVERSE advantage with PwC India</h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-pwc-orange relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-2 text-charter text-pwc-dark">AI Unplugged: 'Where AI meets business, innovation, and transformation'</h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-gradient-to-br from-pwc-orange to-pwc-dark relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-2 text-charter text-pwc-dark">Exclusive webcast on Income-Tax Bill 2024</h3>
              </CardContent>
            </Card>

            <Card className="overflow-hidden pwc-shadow">
              <div className="aspect-video bg-pwc-light relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-8 w-8 text-pwc-orange" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-2 text-charter text-pwc-dark">Episode 3: Part 1: Data and automation leading AI transformation</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pwc-section-spacing bg-pwc-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="inline-flex items-center space-x-6 mb-8">
                <div className="w-16 h-16 bg-pwc-orange rounded-xl flex items-center justify-center pwc-shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-charter text-white">Transact to Transform</h2>
              </div>
              <p className="text-xl text-helvetica text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Transact to Transform with the PwC theme. Now by applying it, instead, we'll reinvent your business model and advance your sustainable growth strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="pwc-container-spacing bg-pwc-orange text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-charter text-white">Alumni</h3>
              <p className="text-lg text-helvetica text-white/90">
                Enabling excellence. Connecting aspirations.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-charter text-white">Careers</h3>
              <p className="text-lg text-helvetica text-white/90">
                Opportunity to deliver on our shared purpose by making real impact.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}