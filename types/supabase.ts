export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      documentos: {
        Row: {
          created_at: string
          estatus: string
          fecha_vencimiento: string | null
          id: string
          nombre: string
          proveedor_id: string
          tipo_documento_id: string
          updated_at: string
          url_archivo: string
        }
        Insert: {
          created_at?: string
          estatus: string
          fecha_vencimiento?: string | null
          id?: string
          nombre: string
          proveedor_id: string
          tipo_documento_id: string
          updated_at?: string
          url_archivo: string
        }
        Update: {
          created_at?: string
          estatus?: string
          fecha_vencimiento?: string | null
          id?: string
          nombre?: string
          proveedor_id?: string
          tipo_documento_id?: string
          updated_at?: string
          url_archivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "vista_proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_tipo_documento_id_fkey"
            columns: ["tipo_documento_id"]
            isOneToOne: false
            referencedRelation: "tipos_documentos"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedores: {
        Row: {
          categoria_id: string | null
          created_at: string
          email: string
          estatus: string
          id: string
          nombre: string
          pais: string
          razon_social: string
          rfc: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          email: string
          estatus: string
          id?: string
          nombre: string
          pais: string
          razon_social: string
          rfc: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          email?: string
          estatus?: string
          id?: string
          nombre?: string
          pais?: string
          razon_social?: string
          rfc?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "proveedores_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_documentos: {
        Row: {
          created_at: string
          descripcion: string | null
          es_requerido: boolean
          id: string
          nombre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          es_requerido?: boolean
          id?: string
          nombre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          es_requerido?: boolean
          id?: string
          nombre?: string
          updated_at?: string
        }
        Relationships: []
      }
      transacciones: {
        Row: {
          created_at: string
          descripcion: string
          fecha: string
          id: string
          monto: number
          proveedor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion: string
          fecha: string
          id?: string
          monto: number
          proveedor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string
          fecha?: string
          id?: string
          monto?: number
          proveedor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transacciones_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacciones_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "vista_proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nombre: string
          rol: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nombre: string
          rol: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nombre?: string
          rol?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      vista_proveedores: {
        Row: {
          categoria: string | null
          created_at: string | null
          documentos_aptos: number | null
          documentos_no_aptos: number | null
          documentos_pendientes: number | null
          email: string | null
          estatus: string | null
          id: string | null
          nombre: string | null
          pais: string | null
          razon_social: string | null
          rfc: string | null
          telefono: string | null
          total_documentos: number | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      actualizar_estatus_documentos_vencidos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_proveedor_detalle: {
        Args: { _proveedor_id: string }
        Returns: {
          proveedor_id: string
          nombre: string
          razon_social: string
          rfc: string
          estatus: string
          email: string
          telefono: string
          pais: string
          created_at: string
          categoria_id: string
          categoria_nombre: string
          documento_id: string
          documento_nombre: string
          documento_url: string
          documento_fecha_vencimiento: string
          documento_estatus: string
          documento_tipo_id: string
          documento_tipo_nombre: string
          transaccion_id: string
          transaccion_descripcion: string
          transaccion_monto: number
          transaccion_fecha: string
        }[]
      }
      get_proveedores: {
        Args: {
          _limit?: number
          _offset?: number
          _estatus?: string
          _categoria_id?: string
        }
        Returns: {
          id: string
          nombre: string
          razon_social: string
          rfc: string
          estatus: string
          email: string
          telefono: string
          pais: string
          created_at: string
          categoria_id: string
          categoria_nombre: string
          documentos_count: number
          documentos_aptos: number
          documentos_no_aptos: number
        }[]
      }
      registrar_documento: {
        Args: {
          _proveedor_id: string
          _tipo_documento_id: string
          _nombre: string
          _url_archivo: string
          _fecha_vencimiento: string
          _estatus: string
        }
        Returns: string
      }
      registrar_proveedor: {
        Args: {
          _nombre: string
          _razon_social: string
          _rfc: string
          _estatus: string
          _email: string
          _telefono: string
          _pais: string
          _categoria_id: string
        }
        Returns: string
      }
      registrar_transaccion: {
        Args: {
          _proveedor_id: string
          _descripcion: string
          _monto: number
          _fecha: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos personalizados para facilitar el trabajo con la API
export type Proveedor = Database['public']['Tables']['proveedores']['Row'] & {
  categoria_nombre?: string;
  documentos_count?: number;
  documentos_aptos?: number;
  documentos_no_aptos?: number;
}

export type Documento = Database['public']['Tables']['documentos']['Row'] & {
  tipo_documento_nombre?: string;
}

export type Categoria = Database['public']['Tables']['categorias']['Row']

export type TipoDocumento = Database['public']['Tables']['tipos_documentos']['Row']

export type Transaccion = Database['public']['Tables']['transacciones']['Row']

export type ProveedorDetalle = {
  proveedor: Proveedor;
  documentos: Documento[];
  transacciones: Transaccion[];
} 