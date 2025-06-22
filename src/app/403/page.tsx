"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Shield, Lock } from "lucide-react";
import Image from "next/image";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              width={30}
              height={30}
              alt="CreatorsLab logo"
            />
            <span className="text-white text-2xl font-semibold">
              creatorslab
            </span>
          </div>
        </div>

        {/* 403 Animation with Lock Icon */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-ping"></div>
            </div>
          </div>

          <div className="text-7xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text animate-pulse">
            403
          </div>
          <div className="absolute inset-0 text-7xl md:text-8xl font-bold text-red-500/20 blur-sm mt-16">
            403
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Access Forbidden
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            You don&apos;t have permission to access this resource. Please
            contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center space-x-2 bg-red-900/30 border border-red-800/50 rounded-full px-4 py-2 mb-8">
          <Shield className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm font-medium">
            Security Protected
          </span>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
          <h3 className="text-white font-semibold mb-3 flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>Need Access?</span>
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            If you need access to this resource, please contact your system
            administrator or check your user permissions.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-gray-500">Common solutions:</span>
            <span className="text-purple-400">Check permissions</span>
            <span className="text-gray-600">•</span>
            <span className="text-purple-400">Contact admin</span>
            <span className="text-gray-600">•</span>
            <span className="text-purple-400">Re-login</span>
          </div>
        </div>
      </div>
    </div>
  );
}
