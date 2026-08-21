"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { bootstrapOwnerAccount } from "@/lib/actions/admin-users"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function SetupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await bootstrapOwnerAccount(formData)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    router.push("/admin/dashboard")
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input id="name" name="name" required autoComplete="name" />
            </Field>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </Field>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Spinner data-icon="inline-start" />}
              Create owner account
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
