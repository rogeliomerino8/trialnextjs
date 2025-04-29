import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Proveedor, Categoria, ProveedorDetalle, Documento, TipoDocumento, Transaccion } from '@/types/supabase'

interface UseProveedoresOptions {
  limit?: number
  offset?: number
  estatus?: 'apto' | 'no_apto' | null
  categoriaId?: string | null
}

interface DetalleProveedorItem {
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
  documento_id?: string
  documento_nombre?: string
  documento_url?: string
  documento_fecha_vencimiento?: string
  documento_estatus?: string
  documento_tipo_id?: string
  documento_tipo_nombre?: string
  transaccion_id?: string
  transaccion_descripcion?: string
  transaccion_monto?: number
  transaccion_fecha?: string
}

export const useProveedores = (options: UseProveedoresOptions = {}) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)

  const { limit = 100, offset = 0, estatus = null, categoriaId = null } = options

  const fetchProveedores = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener proveedores usando la función RPC
      const { data: proveedoresData, error: proveedoresError } = await supabase
        .rpc('get_proveedores', {
          _limit: limit,
          _offset: offset,
          _estatus: estatus,
          _categoria_id: categoriaId
        })

      if (proveedoresError) throw proveedoresError

      // Obtener el total de proveedores para la paginación - usando select con count
      let query = supabase.from('proveedores').select('*', { count: 'exact', head: true })
      
      if (estatus !== null) {
        query = query.eq('estatus', estatus)
      }
      
      if (categoriaId !== null) {
        query = query.eq('categoria_id', categoriaId)
      }
      
      const { count: totalCount, error: countError } = await query

      if (countError) throw countError

      // Convertir los datos de proveedores a un formato compatible con el tipo Proveedor
      const formattedProveedoresData = proveedoresData?.map(data => ({
        ...data,
        updated_at: data.created_at // Asumiendo que el campo updated_at no está disponible, se utiliza created_at como un placeholder
      })) || [];

      setProveedores(formattedProveedoresData)
      setCount(totalCount || 0)
    } catch (err) {
      console.error('Error al cargar proveedores:', err)
      setError('Error al cargar los proveedores')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      console.log("-------------- DEPURACIÓN CATEGORÍAS --------------")
      console.log("Iniciando fetchCategorias")
      
      // Comprobar que la conexión a supabase esté funcionando
      console.log("Conexión a Supabase:", supabase !== null ? "OK" : "ERROR")
      
      const { data, error: categoriasError } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre')

      console.log("Respuesta de Supabase:", { data, error: categoriasError })
      
      if (categoriasError) {
        console.error('Error específico al cargar categorías:', categoriasError)
        throw categoriasError
      }

      console.log("Categorías obtenidas:", data)
      console.log("Número de categorías:", data ? data.length : 0)
      
      if (data && data.length > 0) {
        console.log("Primera categoría:", data[0])
      } else {
        console.log("No hay categorías en la respuesta, intentando insertar por defecto...")
      }

      // Si no hay categorías, insertar algunas por defecto
      if (!data || data.length === 0) {
        console.log("No hay categorías, insertando categorías por defecto...")
        await insertDefaultCategorias()
        return fetchCategorias() // Volver a intentar cargar las categorías
      }

      console.log("Estableciendo categorías en el estado:", data)
      setCategorias(data || [])
      console.log("Estado actualizado con categorías")
      console.log("-------------- FIN DEPURACIÓN CATEGORÍAS --------------")
    } catch (err) {
      console.error('Error al cargar categorías:', err)
      setError('Error al cargar las categorías')
    }
  }

  // Función para insertar categorías por defecto
  const insertDefaultCategorias = async () => {
    try {
      console.log("Intentando insertar categorías por defecto mediante función RPC...")
      
      // En lugar de intentar insertar directamente, vamos a comprobar
      // si existe una función RPC para insertar categorías
      const { data, error } = await supabase.rpc('insertar_categorias_por_defecto');

      if (error) {
        console.error('Error al insertar categorías por defecto usando RPC:', error);
        console.log('Alternativa: necesitas crear una función RPC en Supabase llamada insertar_categorias_por_defecto');
        
        // Intento directo que probablemente fallará debido a las políticas RLS
        const defaultCategorias = [
          { nombre: 'Tecnología', descripcion: 'Proveedores de servicios tecnológicos y hardware' },
          { nombre: 'Alimentos', descripcion: 'Proveedores de alimentos y bebidas' },
          { nombre: 'Servicios', descripcion: 'Proveedores de servicios generales' },
          { nombre: 'Construcción', descripcion: 'Materiales y servicios de construcción' }
        ];
        
        try {
          const { error: directError } = await supabase
            .from('categorias')
            .insert(defaultCategorias);
            
          if (directError) {
            const errorMessage = directError.message || 'Error sin detalle';
            const errorDetails = directError.details || 'Sin detalles adicionales';
            console.error(`Error también al insertar directamente: ${errorMessage}`, directError);
            console.log(`Detalles del error: ${errorDetails}`);
            console.log('IMPORTANTE: Debes permitir inserciones en la tabla categorias o crear la función RPC mencionada');
          }
        } catch (directInsertError) {
          console.error('Excepción al intentar insertar directamente:', directInsertError);
          console.log('IMPORTANTE: Verifica las políticas RLS de la tabla categorias');
          console.log('Revisa la documentación en docs/supabase-setup.md para solucionar este problema');
        }
      } else {
        console.log("Categorías por defecto insertadas correctamente mediante RPC:", data)
      }
    } catch (err) {
      console.error('Error al insertar categorías por defecto:', err)
      console.log('Revisa la documentación en docs/supabase-setup.md para solucionar este problema');
    }
  }

  const getProveedorDetalle = async (id: string): Promise<ProveedorDetalle | null> => {
    try {
      setLoading(true)
      setError(null)

      // Obtener detalles usando la función RPC
      const { data, error: detalleError } = await supabase
        .rpc('get_proveedor_detalle', { _proveedor_id: id })

      if (detalleError) throw detalleError

      if (!data || data.length === 0) {
        return null
      }

      // Procesar los datos para crear un objeto estructurado
      const proveedor: Proveedor = {
        id: data[0].proveedor_id,
        nombre: data[0].nombre,
        razon_social: data[0].razon_social,
        rfc: data[0].rfc,
        estatus: data[0].estatus,
        email: data[0].email,
        telefono: data[0].telefono || '',
        pais: data[0].pais,
        created_at: data[0].created_at,
        updated_at: '', // No viene en la consulta
        categoria_id: data[0].categoria_id,
        categoria_nombre: data[0].categoria_nombre
      }

      // Agrupar documentos únicos
      const documentosMap = new Map<string, Documento>()
      const transaccionesMap = new Map<string, Transaccion>()

      data.forEach((item: DetalleProveedorItem) => {
        if (item.documento_id) {
          documentosMap.set(item.documento_id, {
            id: item.documento_id,
            nombre: item.documento_nombre || '',
            proveedor_id: item.proveedor_id,
            tipo_documento_id: item.documento_tipo_id || '',
            url_archivo: item.documento_url || '',
            fecha_vencimiento: item.documento_fecha_vencimiento || null,
            estatus: item.documento_estatus || 'pendiente',
            created_at: '', // No viene en la consulta
            updated_at: '', // No viene en la consulta
            tipo_documento_nombre: item.documento_tipo_nombre
          })
        }

        if (item.transaccion_id) {
          transaccionesMap.set(item.transaccion_id, {
            id: item.transaccion_id,
            proveedor_id: item.proveedor_id,
            descripcion: item.transaccion_descripcion || '',
            monto: item.transaccion_monto || 0,
            fecha: item.transaccion_fecha || '',
            created_at: '', // No viene en la consulta
            updated_at: '' // No viene en la consulta
          })
        }
      })

      return {
        proveedor,
        documentos: Array.from(documentosMap.values()),
        transacciones: Array.from(transaccionesMap.values())
      }
    } catch (err) {
      console.error('Error al cargar detalle del proveedor:', err)
      setError('Error al cargar los detalles del proveedor')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getTiposDocumentos = async (): Promise<TipoDocumento[]> => {
    try {
      const { data, error } = await supabase
        .from('tipos_documentos')
        .select('*')
        .order('nombre')

      if (error) throw error

      return data || []
    } catch (err) {
      console.error('Error al cargar tipos de documentos:', err)
      setError('Error al cargar los tipos de documentos')
      return []
    }
  }

  const registrarProveedor = async (proveedorData: Omit<Proveedor, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      const { data, error } = await supabase.rpc('registrar_proveedor', {
        _nombre: proveedorData.nombre,
        _razon_social: proveedorData.razon_social,
        _rfc: proveedorData.rfc,
        _estatus: proveedorData.estatus,
        _email: proveedorData.email,
        _telefono: proveedorData.telefono || '',
        _pais: proveedorData.pais,
        _categoria_id: proveedorData.categoria_id || undefined
      })

      if (error) throw error
      // Actualizar la lista de proveedores después de registrar uno nuevo
      await fetchProveedores()
      
      return data
    } catch (err) {
      console.error('Error al registrar proveedor:', err)
      setError('Error al registrar el proveedor')
      return null
    }
  }

  const registrarDocumento = async (documentoData: {
    proveedorId: string;
    tipoDocumentoId: string;
    nombre: string;
    urlArchivo: string;
    fechaVencimiento?: string;
    estatus: 'apto' | 'no_apto' | 'pendiente';
  }): Promise<string | null> => {
    try {
      const { data, error } = await supabase.rpc('registrar_documento', {
        _proveedor_id: documentoData.proveedorId,
        _tipo_documento_id: documentoData.tipoDocumentoId,
        _nombre: documentoData.nombre,
        _url_archivo: documentoData.urlArchivo,
        _fecha_vencimiento: documentoData.fechaVencimiento || undefined,
        _estatus: documentoData.estatus
      })

      if (error) throw error
      
      return data
    } catch (err) {
      console.error('Error al registrar documento:', err)
      setError('Error al registrar el documento')
      return null
    }
  }

  const registrarTransaccion = async (transaccionData: {
    proveedorId: string;
    descripcion: string;
    monto: number;
    fecha: string;
  }): Promise<string | null> => {
    try {
      const { data, error } = await supabase.rpc('registrar_transaccion', {
        _proveedor_id: transaccionData.proveedorId,
        _descripcion: transaccionData.descripcion,
        _monto: transaccionData.monto,
        _fecha: transaccionData.fecha
      })

      if (error) throw error
      
      return data
    } catch (err) {
      console.error('Error al registrar transacción:', err)
      setError('Error al registrar la transacción')
      return null
    }
  }

  // Cargar proveedores y categorías al iniciar
  useEffect(() => {
    console.log("useEffect en useProveedores ejecutado")
    fetchProveedores()
    fetchCategorias()
  }, [limit, offset, estatus, categoriaId])

  return {
    proveedores,
    categorias,
    loading,
    error,
    count,
    refetch: fetchProveedores,
    getProveedorDetalle,
    getTiposDocumentos,
    registrarProveedor,
    registrarDocumento,
    registrarTransaccion
  }
} 