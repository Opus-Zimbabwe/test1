"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createProject, updateProject } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Project = {
  id: number
  title: string
  slug: string
  summary: string | null
  description: string | null
  location: string | null
  category: string | null
  status: string
  coverImageUrl: string | null
  sortOrder: number
  isPublished: boolean
}

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(project?.status ?? "draft")
  const isEdit = !!project

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    formData.set("status", status)
    const result = isEdit
      ? await updateProject(project!.id, formData)
      : await createProject(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    toast.success(isEdit ? "Project updated" : "Project created")
    if (!isEdit && result?.id) {
      router.push(`/admin/projects/${result.id}`)
    } else {
      router.push("/admin/projects")
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!error}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input id="title" name="title" required defaultValue={project?.title} />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input id="location" name="location" defaultValue={project?.location ?? ""} />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Input
              id="category"
              name="category"
              placeholder="e.g. Web Design, Software"
              defaultValue={project?.category ?? ""}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="summary">Summary</FieldLabel>
          <Textarea
            id="summary"
            name="summary"
            rows={2}
            placeholder="Short description shown on project cards"
            defaultValue={project?.summary ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Full description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={6}
            placeholder="Detailed case study content"
            defaultValue={project?.description ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="coverImageUrl">Cover image URL</FieldLabel>
          <Input
            id="coverImageUrl"
            name="coverImageUrl"
            placeholder="https://... (upload via Media, then paste URL)"
            defaultValue={project?.coverImageUrl ?? ""}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="sortOrder">Sort order</FieldLabel>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={project?.sortOrder ?? 0}
            />
          </Field>
        </div>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="isPublished">Published</FieldLabel>
            <FieldDescription>Visible on the public Projects page.</FieldDescription>
          </FieldContent>
          <Switch
            id="isPublished"
            name="isPublished"
            defaultChecked={project ? project.isPublished : false}
          />
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {isEdit ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  )
}
