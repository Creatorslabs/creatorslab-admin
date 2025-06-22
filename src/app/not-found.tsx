import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
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

        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-purple-500/20 blur-sm">
            404
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to another location.
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-500 rounded-full animate-ping"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
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

        {/* Search Suggestion */}
        <div className="mt-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-3">
            <Search className="w-5 h-5" />
            <span className="text-sm font-medium">
              Looking for something specific?
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/users"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Users
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/tasks"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Tasks
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/engagement"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              Engagement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
