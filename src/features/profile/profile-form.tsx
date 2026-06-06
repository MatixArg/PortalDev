'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateDeveloperProfile } from '@/services/profile-service'
import { toast } from 'sonner'
import type { DeveloperProfile } from '@/types/profile'

interface ProfileFormProps {
  profile: DeveloperProfile
  onSuccess: () => void
}

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      display_name: profile.display_name || '',
      bio: profile.bio || '',
      location: profile.location || '',
      country: profile.country || '',
      website: profile.website || '',
      portfolio_url: profile.portfolio_url || '',
      github_url: profile.github_url || '',
      linkedin_url: profile.linkedin_url || '',
      availability: profile.availability,
      experience_level: profile.experience_level || undefined,
    },
  })

  async function onSubmit(data: ProfileFormData) {
    const { error } = await updateDeveloperProfile(profile.user_id, data)
    if (error) {
      toast.error('Failed to update profile')
      return
    }
    toast.success('Profile updated')
    onSuccess()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" {...form.register('first_name')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" {...form.register('last_name')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input id="display_name" {...form.register('display_name')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={3} {...form.register('bio')} />
            <p className="text-xs text-muted-foreground">{form.watch('bio')?.length || 0}/500</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="San Francisco, CA" {...form.register('location')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="United States" {...form.register('country')} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://example.com" {...form.register('website')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portfolio_url">Portfolio URL</Label>
              <Input id="portfolio_url" placeholder="https://portfolio.dev" {...form.register('portfolio_url')} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" placeholder="https://github.com/username" {...form.register('github_url')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" placeholder="https://linkedin.com/in/username" {...form.register('linkedin_url')} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                value={form.watch('availability')}
                onValueChange={(v) => form.setValue('availability', v as ProfileFormData['availability'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="open">Open to work</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select
                value={form.watch('experience_level') || ''}
                onValueChange={(v) => form.setValue('experience_level', v as ProfileFormData['experience_level'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="mid">Mid-Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit">Save changes</Button>
        </form>
      </CardContent>
    </Card>
  )
}
