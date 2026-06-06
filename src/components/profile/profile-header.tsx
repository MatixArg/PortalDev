import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MapPin, Globe, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/shared/icons'
import { getInitials } from '@/utils/formatters'
import type { DeveloperProfile } from '@/types/profile'

interface ProfileHeaderProps {
  profile: DeveloperProfile
}

const availabilityLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  available: { label: 'Available', variant: 'default' },
  open: { label: 'Open to work', variant: 'secondary' },
  busy: { label: 'Busy', variant: 'outline' },
  unavailable: { label: 'Unavailable', variant: 'destructive' },
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const availability = availabilityLabels[profile.availability] || availabilityLabels.unavailable

  return (
    <div className="relative">
      <div className="h-48 w-full rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border" />

      <div className="relative -mt-20 px-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left sm:gap-6">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || profile.username} />
            <AvatarFallback className="text-3xl">{getInitials(profile.display_name || profile.username)}</AvatarFallback>
          </Avatar>

          <div className="mt-4 flex-1 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username}
              </h1>
              <Badge variant={availability.variant} className="mt-1 sm:mt-0 w-fit">
                {availability.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">@{profile.username}</p>
            {profile.bio && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{profile.bio}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </a>
              )}
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                  <GithubIcon className="h-3.5 w-3.5" />
                  GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                  <LinkedinIcon className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              )}
              {profile.portfolio_url && (
                <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
