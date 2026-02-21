"use client";

import React from "react";
import {
  Search,
  Mail,
  MessageSquare,
  PhoneCall,
  BookOpen,
  CreditCard,
  UserCircle,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HelpAndSupportPage() {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "You can reset your password by going to the Settings page, selecting the Security tab, and clicking on 'Update Password'. You will need to enter your current password.",
    },
    {
      question: "Where can I find my invoices?",
      answer:
        "All your past invoices are located under the Billing section in your account dashboard. You can download them as PDF files.",
    },
    {
      question: "How do I contact technical support?",
      answer:
        "You can reach our technical support team 24/7 via the live chat widget in the bottom right corner, or by emailing support@example.com.",
    },
    {
      question: "Can I upgrade my subscription plan later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and applied to your next billing cycle.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-10 bg-slate-50/50 min-h-screen">
      {/* ===== HERO SECTION & SEARCH ===== */}
      <div className="text-center max-w-2xl mx-auto space-y-6 pt-8 pb-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          How can we help you?
        </h1>
        <p className="text-slate-500 text-lg">
          Search our knowledge base or browse categories to find the answers you
          need.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search for articles, guides, and FAQs..."
            className="pl-10 py-6 text-base rounded-xl shadow-sm border-slate-200"
          />
          <Button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg">
            Search
          </Button>
        </div>
      </div>

      {/* ===== HELP CATEGORIES ===== */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <UserCircle size={24} />
              </div>
              <CardTitle className="text-lg">Account Setup</CardTitle>
              <CardDescription>
                Manage your profile and preferences.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CreditCard size={24} />
              </div>
              <CardTitle className="text-lg">Billing & Payments</CardTitle>
              <CardDescription>
                Invoices, payment methods, and plans.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <CardTitle className="text-lg">User Guides</CardTitle>
              <CardDescription>
                Step-by-step tutorials and documentation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200 group">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Settings size={24} />
              </div>
              <CardTitle className="text-lg">Troubleshooting</CardTitle>
              <CardDescription>
                Fix common technical issues and bugs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* ===== FAQs ===== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-semibold text-slate-900 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span> {faq.question}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed pl-4">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CONTACT US ===== */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Still need help?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-slate-50 rounded-full text-slate-600">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Live Chat</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Available 24/7 for urgent issues.
                </p>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-slate-50 rounded-full text-slate-600">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Email Support</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Get a response within 24 hours.
                </p>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-slate-50 rounded-full text-slate-600">
                <PhoneCall size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Phone Support</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Mon-Fri from 9am to 5pm.
                </p>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Call Us
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
