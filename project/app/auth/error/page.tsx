"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-dark-bg">
      <div className="w-full max-w-sm">
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="text-red-500" size={24} />
              <CardTitle className="text-2xl">Erro de Autenticação</CardTitle>
            </div>
            <CardDescription>Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-primary hover:bg-primary-light">Voltar para Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
