import Link from 'next/link'
import { Code2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <span className="font-semibold">PortalDev</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Build your reputation with projects, not words.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/developers" className="text-sm text-muted-foreground hover:text-foreground">Developers</Link></li>
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground">Create Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">Sign In</Link></li>
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground">Register</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li><span className="text-sm text-muted-foreground">Privacy</span></li>
              <li><span className="text-sm text-muted-foreground">Terms</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PortalDev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
