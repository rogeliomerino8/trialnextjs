"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, FileText, Upload, ArrowLeft, Eye } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"
import { useRouter } from "next/navigation"
import { use } from "react"

type Documento = {
  id: string
  nombre: string
  fechaVencimiento: string
  estatus: "apto" | "no_apto"
}

type ProveedorDetalle = {
  id: string
  nombre: string
  estatus: "apto" | "no_apto"
  razonSocial: string
  rfc: string
  pais: string
  email: string
  telefono: string
  categoria: string
  fechaRegistro: string
  documentos: Documento[]
  historialTransacciones?: {
    id: string
    fecha: string
    descripcion: string
    monto: number
  }[]
}

// En Next.js 15, params es una Promise
const ProveedorDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  
  // Utilizamos use() para resolver la Promise de params
  const resolvedParams = use(params)
  const proveedorId = resolvedParams.id

  // Datos de ejemplo
  const proveedor: ProveedorDetalle = {
    id: proveedorId,
    nombre: "Empresa Ejemplo S.A.",
    estatus: "apto",
    razonSocial: "Empresa Ejemplo Sociedad Anónima",
    rfc: "EJE123456789",
    pais: "México",
    email: "contacto@empresaejemplo.com",
    telefono: "+52 55 1234 5678",
    categoria: "Servicios",
    fechaRegistro: "2023-05-15",
    documentos: [
      {
        id: "1",
        nombre: "Acta Constitutiva",
        fechaVencimiento: "2024-12-31",
        estatus: "apto",
      },
      {
        id: "2",
        nombre: "Comprobante de Domicilio",
        fechaVencimiento: "2024-06-30",
        estatus: "no_apto",
      },
      {
        id: "3",
        nombre: "Constancia Fiscal",
        fechaVencimiento: "2024-09-15",
        estatus: "apto",
      },
      {
        id: "4",
        nombre: "Estados Financieros",
        fechaVencimiento: "2024-05-20",
        estatus: "apto",
      },
    ],
    historialTransacciones: [
      {
        id: "t1",
        fecha: "2024-01-15",
        descripcion: "Compra de materiales",
        monto: 45000,
      },
      {
        id: "t2",
        fecha: "2024-02-20",
        descripcion: "Servicio de mantenimiento",
        monto: 12800,
      },
      {
        id: "t3",
        fecha: "2024-03-10",
        descripcion: "Compra de equipos",
        monto: 78500,
      },
    ]
  }

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: "Proveedores", href: "/proveedores" },
    { label: proveedor.nombre, href: `/proveedores/${proveedorId}` },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.push("/proveedores")}
          className="h-8 w-8 border-[#2A2A2E] hover:bg-[#2A2A2E] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{proveedor.nombre}</h1>
            <Badge
              variant={proveedor.estatus === "apto" ? "default" : "destructive"}
            >
              {proveedor.estatus === "apto" ? "Apto" : "No Apto"}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-[#2A2A2E] bg-[#222226]">{proveedor.categoria}</Badge>
            <p className="text-sm text-muted-foreground">
              Registrado: {new Date(proveedor.fechaRegistro).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
        
        <div className="space-x-2">
          <Button variant="outline" className="border-[#2A2A2E] hover:bg-[#2A2A2E] hover:text-white">
            <FileText className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
            <Upload className="mr-2 h-4 w-4" />
            Subir Documentos
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#222226] p-1">
          <TabsTrigger 
            value="general" 
            className="data-[state=active]:bg-[#2A2A2E] data-[state=active]:text-white"
          >
            Información General
          </TabsTrigger>
          <TabsTrigger 
            value="documentos" 
            className="data-[state=active]:bg-[#2A2A2E] data-[state=active]:text-white"
          >
            Documentos
          </TabsTrigger>
          <TabsTrigger 
            value="transacciones" 
            className="data-[state=active]:bg-[#2A2A2E] data-[state=active]:text-white"
          >
            Transacciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-[#222226] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Razón Social</p>
                    <p className="font-medium">{proveedor.razonSocial}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RFC</p>
                    <p className="font-medium">{proveedor.rfc}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">País</p>
                    <p className="font-medium">{proveedor.pais}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email de Contacto</p>
                    <p className="font-medium">{proveedor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{proveedor.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categoría</p>
                    <p className="font-medium">{proveedor.categoria}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentos">
          <Card className="bg-[#222226] border-[#2A2A2E]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documentos</CardTitle>
              <Button size="sm" className="bg-[#3B82F6] hover:bg-[#2563EB]">
                <Upload className="mr-2 h-4 w-4" />
                Subir Documento
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proveedor.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-[#2A2A2E] rounded-lg hover:bg-[#2A2A2E] transition-colors"
                  >
                    <div>
                      <p className="font-medium">{doc.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Vence: {new Date(doc.fechaVencimiento).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={doc.estatus === "apto" ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {doc.estatus === "apto" ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {doc.estatus === "apto" ? "Apto" : "No Apto"}
                      </Badge>
                      <Button variant="outline" size="sm" className="border-[#2A2A2E] hover:bg-[#1C1C1F]">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transacciones">
          <Card className="bg-[#222226] border-[#2A2A2E]">
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proveedor.historialTransacciones?.map((transaccion) => (
                  <div
                    key={transaccion.id}
                    className="flex items-center justify-between p-4 border border-[#2A2A2E] rounded-lg hover:bg-[#2A2A2E] transition-colors"
                  >
                    <div>
                      <p className="font-medium">{transaccion.descripcion}</p>
                      <p className="text-sm text-muted-foreground">
                        Fecha: {new Date(transaccion.fecha).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$ {transaccion.monto.toLocaleString("es-MX")}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-[#1C1C1F]">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProveedorDetailPage 