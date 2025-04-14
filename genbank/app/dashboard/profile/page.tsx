import { ProfileView } from "@/components/profile-view"
import { PageHeader } from "@/components/page-header"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="View and manage your account information" />
      <ProfileView />
    </div>
  )
}
