import { jwtValidatorResolver } from "./schema/authentication/jwtValidatorResolver";
import { loginResolver } from "./schema/authentication/loginResolver";
import { addClienteResolver, clienteResolver, clientesResolver, deleteClienteResolver, updateClienteResolver } from "./schema/cliente/clienteResolver";
import { addDevolucionResolver, deleteDevolucionResolver, devolucionesResolver, devolucionResolver, updateDevolucionResolver } from "./schema/devolucion/devolucionResolver";
import { addEmpleadoResolver, deleteEmpleadoResolver, empleadoResolver, empleadosResolver, updateEmpleadoResolver } from "./schema/empleado/empleadoResolver";
import { uploadCierresFileResolver, uploadProductoFileResolver, uploadVentasFileResolver } from "./schema/file/fileResolvers";
import { addProductoResolver, deleteProductoResolver, productoResolver, productosResolver, updateProductoResolver } from "./schema/producto/productoResolver";
import { addProveedorResolver, deleteProveedorResolver, proveedoresResolver, updateProveedorResolver } from "./schema/proveedor/proveedorResolvers";
import { addCierreTpvResolver, cierreTpvResolver, cierreTpvsResolver, deleteCierreTpvResolver, updateCierreTpvResolver } from "./schema/tpv/cierreTpvResolver";
import { addTpvResolver, deleteTpvResolver, freeTpvResolver, ocupyTpvResolver, tpvResolver, tpvsResolver, updateTpvResolver } from "./schema/tpv/tpvResolver";
import { addVentaResolver, deleteVentaResolver, updateVentaResolver, ventaResolver, ventasResolver } from "./schema/venta/ventaResolver";

const Resolvers = {
    Query: {
        producto: productoResolver,
        productos: productosResolver,
        venta: ventaResolver,
        ventas: ventasResolver,
        cliente: clienteResolver,
        clientes: clientesResolver,
        empleado: empleadoResolver,
        empleados: empleadosResolver,
        login: loginResolver,
        tpv: tpvResolver,
        tpvs: tpvsResolver,
        cierreTPV: cierreTpvResolver,
        cierresTPVs: cierreTpvsResolver,
        validateJwt: jwtValidatorResolver,
        devolucion: devolucionResolver,
        devoluciones: devolucionesResolver,
        proveedores: proveedoresResolver
    },
    Mutation: {
        addProducto: addProductoResolver,
        addProductosFile: uploadProductoFileResolver,
        deleteProducto: deleteProductoResolver,
        updateProducto: updateProductoResolver,

        addCliente: addClienteResolver,
        deleteCliente: deleteClienteResolver,
        updateCliente: updateClienteResolver,

        addVenta: addVentaResolver,
        addVentasFile: uploadVentasFileResolver,
        deleteVenta: deleteVentaResolver,
        updateVenta: updateVentaResolver,

        addEmpleado: addEmpleadoResolver,
        deleteEmpleado: deleteEmpleadoResolver,
        updateEmpleado: updateEmpleadoResolver,

        addTPV: addTpvResolver,
        deleteTPV: deleteTpvResolver,
        updateTPV: updateTpvResolver,
        ocupyTPV: ocupyTpvResolver,
        freeTPV: freeTpvResolver,

        addCierreTPV: addCierreTpvResolver,
        addCierresFile: uploadCierresFileResolver,
        deleteCierreTPV: deleteCierreTpvResolver,
        updateCierreTPV: updateCierreTpvResolver,

        addDevolucion: addDevolucionResolver,
        deleteDevolucion: deleteDevolucionResolver,
        updateDevolucion: updateDevolucionResolver,

        addProveedor: addProveedorResolver,
        deleteProveedor: deleteProveedorResolver,
        updateProveedor: updateProveedorResolver
    }
};

export default Resolvers