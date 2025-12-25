"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create an account
        </h1>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full">Sign Up</Button>
        </form>

        {/* Divider */}
        <div className="my-4 text-center text-sm text-gray-500">
          — OR —
        </div>

        <Button variant="outline" className="w-full">
          Continue with Google
        </Button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}