import { PageHeader } from "@/components/page-header"
import { UsersList } from "@/components/users-list"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage system users"
        action={{
          label: "Add User",
          href: "/dashboard/users/new",
        }}
      />
      <UsersList />
    </div>
  )
}
