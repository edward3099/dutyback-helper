import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroBackground } from '@/components/ui/HeroBackground';
import SplitText from '@/components/ui/SplitText';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ScrollStack, ScrollStackItem } from '@/components/ui/ScrollStack';
import AnimatedList from '@/components/ui/AnimatedList';
import FadeContent from '@/components/ui/FadeContent';
import ReactBitsSpotlightCard from '@/components/ui/ReactBitsSpotlightCard';
import HowItWorksMagicBento from '@/components/ui/HowItWorksMagicBento';
import RealPerformanceCards from '@/components/ui/RealPerformanceCards';
import { 
  CheckCircle, 
  ArrowRight, 
  FileText, 
  Clock, 
  Shield, 
  HelpCircle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <HeroBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <SplitText
              text="Reclaim Your Overpaid Import VAT & Duty"
              tag="h1"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              splitType="words"
              delay={150}
              duration={0.8}
              ease="power3.out"
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-50px"
              textAlign="center"
            />
            <SplitText
              text="Get back the money you're owed from courier overcharges. Our guided process routes you to the correct HMRC process and helps you gather the right evidence."
              tag="p"
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              splitType="words"
              delay={100}
              duration={0.6}
              ease="power2.out"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.3}
              rootMargin="-100px"
              textAlign="center"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/wizard">
                  Start Your Claim
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <HelpCircle className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <ScrollReveal
              className="text-3xl sm:text-4xl font-bold mb-4"
              enableBlur={true}
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              Real Performance Data
            </ScrollReveal>
            <FadeContent fadeDirection="up" delay={0.2}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how our users are successfully reclaiming their overpaid import charges
              </p>
            </FadeContent>
          </div>
          <RealPerformanceCards />
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/stats">
                View Detailed Statistics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal
              className="text-3xl sm:text-4xl font-bold mb-4"
              enableBlur={true}
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              How It Works
            </ScrollReveal>
            <FadeContent fadeDirection="up" delay={0.2}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our simple 3-step process guides you through reclaiming your overpaid import charges
              </p>
            </FadeContent>
          </div>
          
          <HowItWorksMagicBento />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <ScrollReveal
              className="text-3xl sm:text-4xl font-bold mb-4"
              enableBlur={true}
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              Simple Pricing
            </ScrollReveal>
            <FadeContent fadeDirection="up" delay={0.2}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start free, pay only when you're ready to submit your claim
              </p>
            </FadeContent>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ReactBitsSpotlightCard variant="vat">
              <Card>
                <CardHeader>
                  <CardTitle>Free Triage</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">£0</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Route identification
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Courier templates
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Basic guidance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ReactBitsSpotlightCard>
            
            <ReactBitsSpotlightCard variant="channel" isSelected={true}>
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Basic Claim Pack</CardTitle>
                  <CardDescription>Most popular choice</CardDescription>
                  <div className="text-3xl font-bold">£9</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Complete claim pack
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Evidence checklist
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      HMRC guidance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ReactBitsSpotlightCard>
            
            <ReactBitsSpotlightCard variant="claim">
              <Card>
                <CardHeader>
                  <CardTitle>Premium Pack + QC</CardTitle>
                  <CardDescription>For high-value claims</CardDescription>
                  <div className="text-3xl font-bold">£19</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Everything in Basic
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Quality check
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Reminder system
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ReactBitsSpotlightCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal
              className="text-3xl sm:text-4xl font-bold mb-4"
              enableBlur={true}
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              Ready to Reclaim Your Money?
            </ScrollReveal>
            <FadeContent fadeDirection="up" delay={0.2}>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who have successfully reclaimed their overpaid import charges
              </p>
            </FadeContent>
            <FadeContent fadeDirection="up" delay={0.4}>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/wizard">
                  Start Your Claim Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </FadeContent>
          </div>
        </div>
      </section>
    </div>
  );
}
