"use client"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Check, X, ArrowUpDown, MoreHorizontal, FileText, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChatContext } from "@/components/chat-provider"
import { useProveedores } from "@/hooks/useProveedores"
import { Proveedor, Categoria } from "@/types/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ProveedoresPage = () => {
  const router = useRouter()
  const { isChatOpen } = useChatContext()
  const { proveedores, categorias, loading, error, registrarProveedor } = useProveedores()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    razon_social: "",
    rfc: "",
    email: "",
    telefono: "",
    pais: "México",
    estatus: "apto",
    categoria_id: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Función para manejar cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Función para manejar cambios en los selectores
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Función para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const proveedorId = await registrarProveedor(formData)
      
      if (proveedorId) {
        // Reiniciar el formulario
        setFormData({
          nombre: "",
          razon_social: "",
          rfc: "",
          email: "",
          telefono: "",
          pais: "México",
          estatus: "apto",
          categoria_id: ""
        })
        
        // Cerrar el diálogo
        setIsDialogOpen(false)
        
        // Opcionalmente, redirigir a la página del nuevo proveedor
        // router.push(`/proveedores/${proveedorId}`)
      }
    } catch (error) {
      console.error("Error al registrar proveedor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Función para manejar el clic en una fila
  const handleRowClick = (proveedor: Proveedor) => {
    router.push(`/proveedores/${proveedor.id}`)
  }

  const columns: ColumnDef<Proveedor>[] = [
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation() // Prevenir que el clic en el botón de ordenar active el clic de la fila
              column.toggleSorting(column.getIsSorted() === "asc")
            }}
            className="flex items-center gap-1 hover:bg-[#2A2A2E]"
          >
            Nombre 
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "estatus",
      header: "Estatus",
      cell: ({ row }) => {
        const estatus = row.getValue("estatus") as string
        return (
          <Badge
            variant={estatus === "apto" ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {estatus === "apto" ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {estatus === "apto" ? "Apto" : "No Apto"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "categoria_nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation() // Prevenir que el clic en el botón de ordenar active el clic de la fila
              column.toggleSorting(column.getIsSorted() === "asc")
            }}
            className="flex items-center gap-1 hover:bg-[#2A2A2E]"
          >
            Categoría
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation() // Prevenir que el clic en el botón de ordenar active el clic de la fila
              column.toggleSorting(column.getIsSorted() === "asc")
            }}
            className="flex items-center gap-1 hover:bg-[#2A2A2E]"
          >
            Fecha de Registro
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const fecha = new Date(row.getValue("created_at") as string)
        return fecha.toLocaleDateString("es-ES")
      },
    },
    {
      id: "acciones",
      cell: ({ row }) => {
        const proveedor = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-[#2A2A2E]"
                onClick={(e) => e.stopPropagation()} // Evitar que el clic en el botón active el clic de la fila
              >
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#222226] border-[#2A2A2E]">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2A2A2E]" />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation() // Evitar que se propague el clic
                  router.push(`/proveedores/${proveedor.id}`)
                }}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#2A2A2E]"
              >
                <Eye className="h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()} // Evitar que se propague el clic
                className="flex items-center gap-2 cursor-pointer hover:bg-[#2A2A2E]"
              >
                <FileText className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const containerClass = `container mx-auto py-10 data-table-container px-4 ${isChatOpen ? 'chat-active' : ''}`

  if (loading) {
    return (
      <div className={containerClass}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        
        <Card className="mb-8 bg-[#222226] border-[#2A2A2E]">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={containerClass}>
        <Card className="bg-[#222226] border-[#2A2A2E]">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ocurrió un error al cargar los proveedores. Por favor, intenta de nuevo más tarde.</p>
            <Button className="mt-4 bg-[#3B82F6] hover:bg-[#2563EB]" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const proveedoresAptos = proveedores.filter(p => p.estatus === "apto").length
  const proveedoresNoAptos = proveedores.filter(p => p.estatus === "no_apto").length

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground mt-1">Gestiona y visualiza todos tus proveedores</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF5722] hover:bg-[#E64A19]">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-[#222226] border-[#2A2A2E] text-white">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Proveedor</DialogTitle>
              <DialogDescription className="text-gray-400">
                Completa el formulario para registrar un nuevo proveedor en el sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre comercial</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre de la empresa"
                      className="bg-[#1C1C1F] border-[#2A2A2E]"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razon_social">Razón social</Label>
                    <Input
                      id="razon_social"
                      name="razon_social"
                      placeholder="Razón social completa"
                      className="bg-[#1C1C1F] border-[#2A2A2E]"
                      value={formData.razon_social}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rfc">RFC</Label>
                    <Input
                      id="rfc"
                      name="rfc"
                      placeholder="RFC del proveedor"
                      className="bg-[#1C1C1F] border-[#2A2A2E]"
                      value={formData.rfc}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contacto@empresa.com"
                      className="bg-[#1C1C1F] border-[#2A2A2E]"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      placeholder="555-123-4567"
                      className="bg-[#1C1C1F] border-[#2A2A2E]"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Input
                      id="pais"
                      name="pais"
                      placeholder="País de origen"
                      className="bg-[#1C1C1F] border-[#2A2A2E]"
                      value={formData.pais}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estatus">Estatus</Label>
                    <Select 
                      name="estatus" 
                      value={formData.estatus} 
                      onValueChange={(value) => handleSelectChange('estatus', value)}
                    >
                      <SelectTrigger className="bg-[#1C1C1F] border-[#2A2A2E]">
                        <SelectValue placeholder="Seleccionar estatus" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222226] border-[#2A2A2E]">
                        <SelectItem value="apto">Apto</SelectItem>
                        <SelectItem value="no_apto">No apto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria_id">Categoría</Label>
                    <Select 
                      name="categoria_id" 
                      value={formData.categoria_id} 
                      onValueChange={(value) => handleSelectChange('categoria_id', value)}
                    >
                      <SelectTrigger className="bg-[#1C1C1F] border-[#2A2A2E]">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#222226] border-[#2A2A2E]">
                        {categorias.map((categoria: Categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#2A2A2E] hover:bg-[#2A2A2E]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#FF5722] hover:bg-[#E64A19]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-8 bg-[#222226] border-[#2A2A2E]">
        <CardHeader className="pb-3">
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Vista general de tus proveedores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col p-4 border border-[#2A2A2E] rounded-lg bg-[#1C1C1F]">
              <span className="text-sm text-muted-foreground">Total Proveedores</span>
              <span className="text-2xl font-bold">{proveedores.length}</span>
            </div>
            <div className="flex flex-col p-4 border border-[#2A2A2E] rounded-lg bg-[#1C1C1F]">
              <span className="text-sm text-muted-foreground">Proveedores Aptos</span>
              <span className="text-2xl font-bold">{proveedoresAptos}</span>
            </div>
            <div className="flex flex-col p-4 border border-[#2A2A2E] rounded-lg bg-[#1C1C1F]">
              <span className="text-sm text-muted-foreground">Proveedores No Aptos</span>
              <span className="text-2xl font-bold">{proveedoresNoAptos}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable 
        columns={columns} 
        data={proveedores}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default ProveedoresPage; 