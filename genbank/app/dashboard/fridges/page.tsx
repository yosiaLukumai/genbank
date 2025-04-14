import { FridgesList } from "@/components/fridges-list"
import { PageHeader } from "@/components/page-header"

export default function FridgesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fridges"
        description="Manage your coldroom fridges"
        action={{
          label: "Add Fridge",
          href: "/dashboard/fridges/new",
        }}
      />
      <FridgesList />
    </div>
  )
}
