'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, Pencil, Ban, Trash2, Lock, ShieldCheck, Mail, Loader2 } from 'lucide-react'
import type { AdminRole } from '@/types/admin'

interface User {
  id: string
  username: string
  email: string
  full_name: string | null
  avatar_url: string | null
  account_type: string | null
  country: string | null
  created_at: string
  banned: boolean | null
  suspended: boolean | null
  verified: boolean | null
  last_login: string | null
  developer_profiles: unknown[] | null
  company_profiles: unknown[] | null
  admin_roles: { role: string }[] | null
}

interface Props {
  users: User[]
  role: AdminRole
}

export function UserManagement({ users, role }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmAction, setConfirmAction] = useState<{ type: string; user?: User } | null>(null)
  const [loading, setLoading] = useState(false)

  const isSuperAdmin = role === 'super_admin'

  const handleAction = async (userId: string, action: string) => {
    setLoading(true)
    try {
      if (action === 'ban') {
        await supabase.from('users').update({ banned: true, suspended: false }).eq('id', userId)
        await supabase.from('audit_logs').insert({ admin_id: (await supabase.auth.getUser()).data.user?.id, action: 'ban_user', target_type: 'user', target_id: userId })
        toast.success('User banned')
      } else if (action === 'suspend') {
        await supabase.from('users').update({ suspended: true, banned: false }).eq('id', userId)
        toast.success('User suspended')
      } else if (action === 'unban') {
        await supabase.from('users').update({ banned: false, suspended: false }).eq('id', userId)
        toast.success('User restored')
      } else if (action === 'verify') {
        await supabase.from('users').update({ verified: true }).eq('id', userId)
        toast.success('User verified')
      } else if (action === 'delete' && isSuperAdmin) {
        await supabase.from('users').delete().eq('id', userId)
        toast.success('User deleted')
      }
      setConfirmAction(null)
      router.refresh()
    } catch (err) {
      toast.error('Action failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async (action: string) => {
    setLoading(true)
    const ids = Array.from(selected)
    const { data: { user } } = await supabase.auth.getUser()

    for (const id of ids) {
      if (action === 'suspend') {
        await supabase.from('users').update({ suspended: true }).eq('id', id)
      } else if (action === 'delete' && isSuperAdmin) {
        await supabase.from('users').delete().eq('id', id)
      }
      await supabase.from('audit_logs').insert({
        admin_id: user?.id,
        action: `bulk_${action}`,
        target_type: 'user',
        target_id: id,
      })
    }

    toast.success(`Bulk ${action} completed for ${ids.length} users`)
    setSelected(new Set())
    setLoading(false)
    router.refresh()
  }

  const columns: Column[] = [
    {
      key: 'avatar',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback>{(user.full_name ?? user.username)?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.full_name ?? user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'username',
      label: 'Username',
      render: (user) => <span className="text-muted-foreground">@{user.username}</span>,
    },
    {
      key: 'account_type',
      label: 'Type',
      render: (user) => (
        <Badge variant="outline" className="capitalize">
          {user.account_type ?? 'user'}
        </Badge>
      ),
    },
    {
      key: 'country',
      label: 'Country',
      render: (user) => <span className="text-muted-foreground">{user.country ?? '—'}</span>,
    },
    {
      key: 'created_at',
      label: 'Registered',
      render: (user) => <span className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>,
    },
    {
      key: 'verified',
      label: 'Verified',
      render: (user) => user.verified ? <Badge className="bg-emerald-500">Verified</Badge> : <Badge variant="outline">No</Badge>,
    },
    {
      key: 'banned',
      label: 'Status',
      render: (user) => {
        if (user.banned) return <Badge variant="destructive">Banned</Badge>
        if (user.suspended) return <Badge variant="secondary">Suspended</Badge>
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Active</Badge>
      },
    },
    {
      key: 'last_login',
      label: 'Last Login',
      render: (user) => <span className="text-sm text-muted-foreground">{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {user.banned ? (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500" onClick={() => setConfirmAction({ type: 'unban', user })}>
              <ShieldCheck className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" onClick={() => setConfirmAction({ type: 'suspend', user })}>
              <Ban className="h-3.5 w-3.5" />
            </Button>
          )}
          {isSuperAdmin && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => setConfirmAction({ type: 'delete', user })}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Verify">
            <ShieldCheck className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Send Email">
            <Mail className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">Manage all platform users</p>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">{selected.size} selected</span>
          <Button variant="outline" size="sm" onClick={() => handleBulkAction('suspend')} disabled={loading}>
            {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
            Suspend
          </Button>
          {isSuperAdmin && (
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction('delete')} disabled={loading}>
              {loading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            Send Notification
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name, email, username..."
      />

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === 'delete' ? 'Delete User' : 
               confirmAction?.type === 'suspend' ? 'Suspend User' :
               confirmAction?.type === 'unban' ? 'Restore User' : 'Confirm Action'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmAction?.type} {confirmAction?.user?.full_name ?? confirmAction?.user?.username}?
              {confirmAction?.type === 'delete' && ' This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button
              variant={confirmAction?.type === 'delete' ? 'destructive' : 'default'}
              onClick={() => confirmAction?.user && handleAction(confirmAction.user.id, confirmAction.type)}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
