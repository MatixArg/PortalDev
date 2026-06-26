'use client'

import Link from 'next/link'
import { useAuthContext } from '@/features/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/utils/formatters'
import { Code2, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { isAuthenticated, user, userType, signOut } = useAuthContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">PortalDev</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/developers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Developers
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} alt="Avatar" />
                    <AvatarFallback>{getInitials(user?.user_metadata?.full_name as string)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.user_metadata?.full_name as string}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/projects">Projects</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/github">GitHub</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  {userType === 'company' && (
                    <DropdownMenuItem>
                      <Link href="/dashboard/company">Company Profile</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Create profile</Button>
              </Link>
            </div>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t md:hidden">
          <div className="space-y-2 px-4 py-4">
            <Link href="/developers" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Developers
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="block text-sm font-medium text-destructive">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
                <Link href="/auth/register" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
                  Create profile
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
