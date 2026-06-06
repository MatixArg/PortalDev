'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/features/auth/auth-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companyProfileSchema, type CompanyProfileFormData } from '@/lib/validations/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function CompanyPage() {
  const { isAuthenticated, isLoading, user, userType } = useAuthContext()
  const [companyProfile, setCompanyProfile] = useState<Record<string, unknown> | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login')
  }, [isLoading, isAuthenticated, router])

  const form = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      company_name: '',
      description: '',
      website: '',
      size: '',
      industry: '',
      location: '',
      country: '',
    },
  })

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      const supabase = createClient()
      const { data: profileData } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (profileData) {
        setCompanyProfile(profileData)
        form.reset({
          company_name: (profileData as any).company_name || '',
          description: (profileData as any).description || '',
          website: (profileData as any).website || '',
          size: (profileData as any).size || '',
          industry: (profileData as any).industry || '',
          location: (profileData as any).location || '',
          country: (profileData as any).country || '',
        })
      }
    }
    fetchProfile()
  }, [user, form])

  async function onSubmit(formData: CompanyProfileFormData) {
    if (!user) return
    const supabase = createClient()
    const payload = {
      company_name: formData.company_name,
      description: formData.description || null,
      website: formData.website || null,
      size: formData.size || null,
      industry: formData.industry || null,
      location: formData.location || null,
      country: formData.country || null,
    }

    if (companyProfile) {
      const { error } = await supabase
        .from('company_profiles')
        .update(payload)
        .eq('user_id', user.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('Profile updated')
    } else {
      const { error } = await supabase
        .from('company_profiles')
        .insert({ user_id: user.id, ...payload })
      if (error) { toast.error('Failed to create'); return }
      toast.success('Company profile created')
    }
  }

  if (isLoading || !isAuthenticated) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Profile</h1>
        <p className="text-muted-foreground">Set up your company profile to find talent</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{companyProfile ? 'Edit Company' : 'Create Company Profile'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" {...form.register('company_name')} />
              {form.formState.errors.company_name && <p className="text-xs text-destructive">{form.formState.errors.company_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...form.register('description')} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://company.com" {...form.register('website')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Input id="size" placeholder="2-10 employees" {...form.register('size')} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="Technology" {...form.register('industry')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="San Francisco, CA" {...form.register('location')} />
              </div>
            </div>

            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
