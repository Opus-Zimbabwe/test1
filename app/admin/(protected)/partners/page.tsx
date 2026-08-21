import Image from "next/image"
import { requireAdminUser } from "@/lib/admin-session"
import { getPartners } from "@/lib/actions/partners"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { HandshakeIcon } from "lucide-react"
import { PartnerFormDialog } from "./partner-form-dialog"
import { DeletePartnerButton } from "./delete-partner-button"

export default async function AdminPartnersPage() {
  await requireAdminUser(["owner", "editor", "support"])
  const partners = await getPartners()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-dark">Partners</h1>
          <p className="text-sm text-muted-fg">
            Manage the logos shown in the &quot;Partners Who Trust Us&quot; section on the homepage.
          </p>
        </div>
        <PartnerFormDialog />
      </div>

      {partners.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HandshakeIcon />
            </EmptyMedia>
            <EmptyTitle>No partners yet</EmptyTitle>
            <EmptyDescription>Add your first partner logo to display it on the homepage.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Sort</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    {partner.logoUrl ? (
                      <Image
                        src={partner.logoUrl}
                        alt={`${partner.name} logo`}
                        width={40}
                        height={40}
                        className="size-10 rounded object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded bg-muted text-muted-fg">
                        <HandshakeIcon className="size-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-fg">
                    {partner.websiteUrl ?? "—"}
                  </TableCell>
                  <TableCell>{partner.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={partner.isPublished ? "default" : "secondary"}>
                      {partner.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <PartnerFormDialog partner={partner} />
                      <DeletePartnerButton id={partner.id} name={partner.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
