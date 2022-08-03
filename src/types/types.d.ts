export interface ProductoFind {
    find: {
        _id?: string
        nombre?: string
        ean?: string
    }
}

export interface ProductosFind {
    find?: {
        _ids?: string[]
        nombre?: string
        familia?: string
        proveedor?: string
        query?: string
    }
    limit?: number
}

export interface VentaFind {
    _id?: string
}

export interface VentasFind {
    find?: {
        _ids?: string[]
        clienteId?: string
        tipo?: string
        vendedorId?: string
        createdAt?: string
        tpv?: string
        fechaInicial?: string
        fechaFinal?: string
        query?: string
    }
    limit?: number
    order?: string
    offset?: number
}

export interface DevolucionFind {
    find?: {
        _ids?: string[]
        clienteId?: string
        vendedorId?: string
        createdAt?: string
        tpv?: string
        fechaInicial?: string
        fechaFinal?: string
        query?: string
    }
    limit?: number
    order?: string
    offset?: number
}

export interface EmpleadoFind {
    find: {
        _id?: string
        nombre?: string
        dni?: string
    }
}

export interface EmpleadosFind {
    find?: {
        _ids?: string[]
        nombre?: string
        rol?: string
        query?: string
    }
    limit?: number
}

export interface ClienteFind {
    find: {
        _id?: string
        nombre?: string
        nif?: string
    }
}

export interface ClientesFind {
    find?: {
        _ids?: string[]
        nombre?: string
        query?: string
    }
    limit?: number
}

export interface Credentials {
    loginValues: {
        email: string
        password: string
    }
}

export interface TPVFind {
    find: {
        _id?: ID!
        nombre?: string
        empleadoId: ID!
    }
}
export interface TPVsFind {
    find?: {
        libre: boolean
    }
}

export interface EmpleadoInput {
    _id: ID!
    nombre: string!
    apellidos: string!
    dni?: string
    rol: string!
    email: string!
}

export interface CierreTPVInput {
    _id: ID,
    tpv: ID!,
    cajaInicial: number!,
    abiertoPor: EmpleadoInput!,
    cerradoPor: EmpleadoInput!,
    apertura: string!,
    cierre: string,
    numVentas: number,
    ventasEfectivo: number!,
    ventasTarjeta: number!,
    ventasTotales: number!,
    dineroEsperadoEnCaja: number!,
    dineroRealEnCaja: number!,
    dineroRetirado: number!,
    fondoDeCaja: number!,
    nota: string,
}

export interface ProductoAddInput {
    nombre: string!
    proveedor: string
    familia: string
    precioVenta: number!
    precioCompra: number!
    iva: number!
    margen: number!
    promociones: [string]
    ean: string!
    cantidad: number
    cantidadRestock: number
    alta: Boolean!
    img: string
}

export interface ProductoUpdateInput {
    _id: ID!
    nombre: string
    proveedor: string
    familia: string
    precioVenta: number
    precioCompra: number
    iva: number
    margen: number
    promociones: [string]
    ean: string
    cantidad: number
    cantidadRestock: number
    alta: boolean
    img: string
}