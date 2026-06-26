import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdminRole } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Save, Globe, FileText, Image } from 'lucide-react'
import type { FeatureFlag } from '@/types/admin'

export default async function AdminSettingsPage() {
  const role = await requireAdminRole('super_admin')
  if (!role) redirect('/admin')

  const supabase = await createServerSupabaseClient()
  const { data: settings } = await supabase.from('platform_settings').select('*')
  const { data: flags } = await supabase.from('feature_flags').select('*')

  const getSetting = (key: string) => {
    const s = settings?.find((s: { key: string }) => s.key === key)
    return s?.value as Record<string, unknown> ?? {}
  }

  const general = getSetting('general')
  const seo = getSetting('seo')
  const legal = getSetting('legal')
  const content = getSetting('content')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Platform configuration</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general"><Globe className="h-4 w-4 mr-1" /> General</TabsTrigger>
          <TabsTrigger value="legal"><FileText className="h-4 w-4 mr-1" /> Legal</TabsTrigger>
          <TabsTrigger value="content"><Image className="h-4 w-4 mr-1" /> Content</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Platform Name</label>
                  <p className="text-sm text-muted-foreground mt-1">{(general.name as string) ?? 'PortalDev'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Default Language</label>
                  <p className="text-sm text-muted-foreground mt-1">{(general.default_language as string) ?? 'en'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <p className="text-sm text-muted-foreground mt-1">{(general.timezone as string) ?? 'UTC'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration</label>
                  <p className="text-sm text-muted-foreground mt-1">{general.registration ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={general.maintenance ? 'destructive' : 'secondary'}>
                  {general.maintenance ? 'Maintenance Mode ON' : 'Maintenance Mode OFF'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>Search engine optimization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm"><strong>Title:</strong> {(seo.title as string) ?? 'PortalDev'}</p>
              <p className="text-sm"><strong>Description:</strong> {(seo.description as string) ?? ''}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>Terms of service, privacy policy, and guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {['terms', 'privacy', 'cookies', 'guidelines'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm font-medium capitalize">{doc.replace('_', ' ')} Policy</span>
                  <Badge variant={(legal[doc] as string) ? 'default' : 'secondary'}>
                    {(legal[doc] as string) ? 'Set' : 'Not set'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>Upload limits and file type restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm"><strong>Max Upload Size:</strong> {(content.max_upload_size as number) ?? 10} MB</p>
              <p className="text-sm"><strong>Allowed Types:</strong> {(content.allowed_types as string[])?.join(', ') ?? '—'}</p>
              <p className="text-sm"><strong>Image Compression:</strong> {content.image_compression ? 'Enabled' : 'Disabled'}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flags?.map((flag: FeatureFlag) => (
                  <div key={flag.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium capitalize">{flag.key}</p>
                      {flag.description && <p className="text-xs text-muted-foreground">{flag.description}</p>}
                    </div>
                    <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
      </div>
    </div>
  )
}
