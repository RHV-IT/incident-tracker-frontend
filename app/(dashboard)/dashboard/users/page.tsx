"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Building,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  disabled: boolean;
}

export default function SuperAdminUsersPage() {
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();

  // 1. Search for a user account profile by email query parameters
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsSearching(true);
    setFoundUser(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_apiurl}/user?email=${searchEmail.trim()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.replace("/login");
        return;
      }

      if (res.status === 403) {
        toast.error("Access Forbidden: Superadmin permissions required.");
        return;
      }

      if (res.status === 404) {
        toast.error("No account found registered with that email address.");
        return;
      }

      if (!res.ok)
        throw new Error("Server error while executing query lookup.");

      const data: UserProfile = await res.json();
      setFoundUser(data);
      toast.success("User account record located successfully.");
    } catch (err) {
      toast.error("Failed to query target user profile.");
    } finally {
      setIsSearching(false);
    }
  };

  // 2. Toggle access constraints via enable/disable backend paths
  const toggleUserStatus = async (action: "enable" | "disable") => {
    if (!foundUser) return;

    setIsMutating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_apiurl}/auth/${action}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email: foundUser.email }),
        },
      );

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.replace("/login");
        return;
      }

      if (res.status === 403) {
        toast.error("Action denied. Your account lacks superadmin privileges.");
        return;
      }

      if (!res.ok)
        throw new Error(`Failed to execute system ${action} directive.`);

      const updatedUser: UserProfile = await res.json();
      setFoundUser(updatedUser);
      toast.success(`User account has been successfully ${action}d.`);
    } catch (err) {
      toast.error(`Error requesting account status modification.`);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          User Access Management
        </h1>
        <p className="text-muted-foreground">
          Administrative terminal restricted to superadmins. Query accounts
          globally to switch live access constraints.
        </p>
      </div>

      {/* Lookup Card Block */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status Filter Search</CardTitle>
          <CardDescription>
            Locate staff profiles using their unique workspace email
            identification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchUser} className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="colleague@hospital.org"
                className="pl-9"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                disabled={isSearching || isMutating}
              />
            </div>
            <Button type="submit" disabled={isSearching || isMutating}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Querying...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search User
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Target Result Profile View */}
      {foundUser && (
        <Card className="border-t-4 border-t-primary animate-in fade-in-50 duration-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">
                  {foundUser.name}
                </CardTitle>
                <CardDescription>
                  System Reference Account #{foundUser.id}
                </CardDescription>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  foundUser.disabled
                    ? "bg-destructive/10 text-destructive border border-destructive/20"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {foundUser.disabled
                  ? "Account Disabled"
                  : "Active Access Authorized"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Email
                  </span>
                  <span className="text-sm font-medium break-all">
                    {foundUser.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Department
                  </span>
                  <span className="text-sm font-medium uppercase">
                    {foundUser.department || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Role Tier
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {foundUser.role}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/10 px-6 py-4 flex justify-end gap-3 border-t">
            {foundUser.disabled ? (
              <Button
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={() => toggleUserStatus("enable")}
                disabled={isMutating}
              >
                {isMutating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}
                Authorize & Enable Account
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="gap-2"
                onClick={() => toggleUserStatus("disable")}
                disabled={isMutating}
              >
                {isMutating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserX className="h-4 w-4" />
                )}
                Revoke & Disable Account
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
