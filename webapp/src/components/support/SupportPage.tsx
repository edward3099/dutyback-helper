"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Search, 
  Calendar, 
  FileText, 
  Mail, 
  HelpCircle, 
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Copy,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface PolicyChange {
  id: string;
  date: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'deadline' | 'process' | 'documentation' | 'fees';
}

interface EscalationTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: 'hmrc' | 'courier' | 'seller' | 'general';
}

interface HelpSection {
  id: string;
  title: string;
  content: string;
  category: 'getting-started' | 'troubleshooting' | 'advanced' | 'legal';
}

export function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Mock data - in a real app, this would come from an API
  const lastCheckedDate = new Date('2024-01-15');
  const currentDate = new Date();
  const daysSinceLastCheck = Math.floor((currentDate.getTime() - lastCheckedDate.getTime()) / (1000 * 60 * 60 * 24));

  const policyChanges: PolicyChange[] = [
    {
      id: '1',
      date: '2024-01-10',
      title: 'HMRC Deadline Extension for Low-Value Claims',
      description: 'HMRC has extended the deadline for low-value claims from 30 days to 45 days.',
      impact: 'high',
      category: 'deadline'
    },
    {
      id: '2',
      date: '2024-01-05',
      title: 'New Documentation Requirements for Overpayment Claims',
      description: 'Additional proof of payment required for overpayment claims over £100.',
      impact: 'medium',
      category: 'documentation'
    },
    {
      id: '3',
      date: '2023-12-20',
      title: 'Royal Mail Process Update',
      description: 'Royal Mail has updated their internal process for handling duty refund requests.',
      impact: 'low',
      category: 'process'
    }
  ];

  const escalationTemplates: EscalationTemplate[] = [
    {
      id: '1',
      title: 'HMRC Escalation - Overdue Claim',
      description: 'Template for escalating overdue claims to HMRC',
      template: `Subject: Urgent: Overdue Duty Refund Claim - [Claim Reference]

Dear HMRC Duty Refund Team,

I am writing to escalate my duty refund claim which has exceeded the standard processing time.

Claim Details:
- Reference: [Your Claim Reference]
- Submission Date: [Date]
- Courier: [Courier Name]
- Amount: £[Amount]
- Current Status: [Status]

I submitted this claim on [Date] and have not received any updates despite following up on [Previous Follow-up Date]. The claim is now [X] days overdue.

Could you please:
1. Provide an update on the current status
2. Expedite the review process
3. Confirm the expected resolution timeline

I have attached all required documentation and am available for any additional information needed.

Thank you for your urgent attention to this matter.

Best regards,
[Your Name]
[Contact Information]`,
      category: 'hmrc'
    },
    {
      id: '2',
      title: 'Courier Escalation - Missing Documentation',
      description: 'Template for requesting missing documentation from couriers',
      template: `Subject: Request for Missing Documentation - [Courier Name]

Dear [Courier Name] Customer Service,

I am following up on my previous request for documentation required for a duty refund claim.

Original Request Details:
- Date: [Date]
- Reference: [Reference]
- Items: [Item Description]
- Tracking Number: [Tracking Number]

Required Documentation:
- [List specific documents needed]

I have been unable to locate this information through your standard channels and require your assistance to obtain the necessary documentation for my HMRC duty refund claim.

Could you please:
1. Provide the requested documentation
2. Confirm the process for obtaining these documents
3. Provide a timeline for delivery

This is urgent as I have a deadline of [Deadline Date] for my refund claim.

Thank you for your assistance.

Best regards,
[Your Name]
[Contact Information]`,
      category: 'courier'
    }
  ];

  const helpSections: HelpSection[] = [
    {
      id: '1',
      title: 'How to Start a New Claim',
      content: 'To start a new claim, click the "Start New Claim" button on the dashboard. You\'ll be guided through a step-by-step process to collect all necessary information and documentation.',
      category: 'getting-started'
    },
    {
      id: '2',
      title: 'What Documents Do I Need?',
      content: 'The required documents vary by claim type:\n\n• Overpayment: Proof of payment, invoice, customs declaration\n• Rejected Import: Rejection notice, proof of return, customs declaration\n• Withdrawal: Withdrawal notice, proof of return\n• Low Value: Invoice, customs declaration (if applicable)',
      category: 'getting-started'
    },
    {
      id: '3',
      title: 'My Claim is Overdue - What Should I Do?',
      content: 'If your claim is overdue:\n\n1. Check the status in your dashboard\n2. Contact HMRC directly using our escalation template\n3. Gather any additional documentation that might be needed\n4. Consider seeking professional advice if the amount is significant',
      category: 'troubleshooting'
    },
    {
      id: '4',
      title: 'How Long Do Claims Take?',
      content: 'Processing times vary by courier and claim type:\n\n• DHL: 10-14 days average\n• FedEx: 12-16 days average\n• UPS: 8-12 days average\n• Royal Mail: 14-20 days average\n\nComplex cases may take longer.',
      category: 'troubleshooting'
    }
  ];

  const filteredPolicyChanges = useMemo(() => {
    if (!searchQuery) return policyChanges;
    return policyChanges.filter(change => 
      change.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      change.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, policyChanges]);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return escalationTemplates;
    return escalationTemplates.filter(template => 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, escalationTemplates]);

  const filteredHelpSections = useMemo(() => {
    if (!searchQuery) return helpSections;
    return helpSections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, helpSections]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'process': return 'bg-blue-100 text-blue-800';
      case 'documentation': return 'bg-purple-100 text-purple-800';
      case 'fees': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support & Updates</h1>
          <p className="text-gray-600">Get help, check policy updates, and find escalation templates</p>
        </div>

        {/* Last Checked Date Alert */}
        <Alert className={`mb-8 ${daysSinceLastCheck > 7 ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>GOV.UK Guidance Last Checked:</strong> {lastCheckedDate.toLocaleDateString()}
                <span className="ml-2 text-sm">
                  ({daysSinceLastCheck} days ago)
                </span>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Check Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search support content, templates, or policy changes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="policy-updates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="policy-updates">Policy Updates</TabsTrigger>
            <TabsTrigger value="escalation-templates">Escalation Templates</TabsTrigger>
            <TabsTrigger value="help-docs">Help Documentation</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          {/* Policy Updates Tab */}
          <TabsContent value="policy-updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Policy Changes
                </CardTitle>
                <CardDescription>
                  Latest updates to HMRC guidance and courier processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPolicyChanges.map((change) => (
                    <div key={change.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{change.title}</h3>
                        <div className="flex gap-2">
                          <Badge className={getImpactColor(change.impact)}>
                            {change.impact.toUpperCase()}
                          </Badge>
                          <Badge className={getCategoryColor(change.category)}>
                            {change.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{change.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(change.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Escalation Templates Tab */}
          <TabsContent value="escalation-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Escalation Email Templates
                </CardTitle>
                <CardDescription>
                  Pre-written templates for escalating claims and requesting documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{template.title}</h3>
                          <p className="text-gray-600 text-sm">{template.description}</p>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                          {template.template}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(template.template)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Template
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Help Documentation Tab */}
          <TabsContent value="help-docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Help Documentation
                </CardTitle>
                <CardDescription>
                  Frequently asked questions and step-by-step guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredHelpSections.map((section) => (
                    <div key={section.id} className="border rounded-lg">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                        {expandedSections.has(section.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {expandedSections.has(section.id) && (
                        <div className="px-4 pb-4">
                          <div className="text-gray-700 whitespace-pre-line">
                            {section.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <Button className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Chat with our support team in real-time during business hours.
                  </p>
                  <Button variant="outline" className="w-full">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
