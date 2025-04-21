import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  backLink?: {
    label: string
    href: string
  }
}

export function PageHeader({ title, description, action, backLink }: PageHeaderProps) {
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        {backLink && (
          <Link
            href={backLink.href}
            className="mb-2 flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            {backLink.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-green-700">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button className="bg-green-700 hover:bg-green-600" asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
