"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PlusIcon, PencilIcon } from "lucide-react"
import { createPartner, updatePartner } from "@/lib/actions/partners"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

type Partner = {
  id: number
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  sortOrder: number
  isPublished: boolean
}

export function PartnerFormDialog({ partner }: { partner?: Partner }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isEdit = !!partner

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = isEdit
      ? await updatePartner(partner!.id, formData)
      : await createPartner(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    toast.success(isEdit ? "Partner updated" : "Partner added")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <Button variant="ghost" size="icon" aria-label={`Edit ${partner!.name}`}>
              <PencilIcon />
            </Button>
          ) : (
            <Button>
              <PlusIcon data-icon="inline-start" />
              Add partner
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit partner" : "Add partner"}</DialogTitle>
          <DialogDescription>
            Partners appear in the &quot;Partners Who Trust Us&quot; section on the homepage.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} id="partner-form">
          <FieldGroup>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" name="name" required defaultValue={partner?.name} />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </Field>
            <Field>
              <FieldLabel htmlFor="logoUrl">Logo URL</FieldLabel>
              <Input
                id="logoUrl"
                name="logoUrl"
                placeholder="https://... (upload via Media, then paste URL)"
                defaultValue={partner?.logoUrl ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="websiteUrl">Website URL</FieldLabel>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                placeholder="https://example.com"
                defaultValue={partner?.websiteUrl ?? ""}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sortOrder">Sort order</FieldLabel>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={partner?.sortOrder ?? 0}
              />
              <FieldDescription>Lower numbers appear first.</FieldDescription>
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor="isPublished">Published</FieldLabel>
                <FieldDescription>Visible on the public homepage.</FieldDescription>
              </FieldContent>
              <Switch
                id="isPublished"
                name="isPublished"
                defaultChecked={partner ? partner.isPublished : true}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={loading}>
              {isEdit ? "Save changes" : "Add partner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
