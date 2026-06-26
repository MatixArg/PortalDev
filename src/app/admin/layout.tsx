export const dynamic = 'force-dynamic'

import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminGuard } from '@/components/admin/admin-guard'
import { CommandPaletteProvider } from '@/components/admin/command-palette-provider'
import { Breadcrumbs } from '@/components/admin/breadcrumbs'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <CommandPaletteProvider>
        <div className="flex min-h-[calc(100vh-4rem)]">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8">
              <Breadcrumbs />
              {children}
            </div>
          </div>
        </div>
      </CommandPaletteProvider>
    </AdminGuard>
  )
}
