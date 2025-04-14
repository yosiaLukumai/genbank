import { AddUserForm } from "@/components/add-user-form"
import { PageHeader } from "@/components/page-header"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New User"
        description="Add a new user to the system"
        backLink={{
          label: "Back to users",
          href: "/dashboard/users",
        }}
      />
      <div className="rounded-lg border bg-white p-6 shadow">
        <AddUserForm />
      </div>
    </div>
  )
}
