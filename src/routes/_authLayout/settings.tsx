import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Building2, KeyRound, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/features/auth/hooks'
import { ProfileSettingsSection } from '@/features/settings/components/ProfileSettingsSection'
import { PasswordSettingsSection } from '@/features/settings/components/PasswordSettingsSection'
import { OrganizationSettingsSection } from '@/features/settings/components/OrganizationSettingsSection'

export const Route = createFileRoute('/_authLayout/settings')({
  component: SettingsPage,
})

type Tab = 'profile' | 'password' | 'organization'

const TABS: {
  id: Tab
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: KeyRound },
  {
    id: 'organization',
    label: 'Organization',
    icon: Building2,
    adminOnly: true,
  },
]

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const { canManageOrganization } = usePermissions()

  const visibleTabs = TABS.filter(
    (tab) => !tab.adminOnly || canManageOrganization,
  )

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-50">Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your profile, password, and organization preferences
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar nav */}
          <nav className="w-44 shrink-0">
            <ul className="space-y-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sky-500/10 text-sky-400'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Content panel */}
          <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 p-6">
            {activeTab === 'profile' && <ProfileSettingsSection />}
            {activeTab === 'password' && <PasswordSettingsSection />}
            {activeTab === 'organization' && canManageOrganization && (
              <OrganizationSettingsSection />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
