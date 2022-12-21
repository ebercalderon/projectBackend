import JwtValidatorDefs from "./schema/authentication/jwtValidatorDefs";
import LoginDefs from "./schema/authentication/loginDefs";
import ClienteDefs from "./schema/cliente/clienteDefs";
import DevolucionDefs from "./schema/devolucion/devolucionDefs";
import EmpleadoDefs from "./schema/empleado/empleadoDefs";
import fileDefs from "./schema/file/fileDefs";
import MermaDefs from "./schema/merma/mermaDefs";
import productoDefs from "./schema/producto/productoDefs";
import ProveedorDefs from "./schema/proveedor/proveedorDefs";
import CierreTpvDefs from "./schema/tpv/cierreTpvDefs";
import TpvDefs from "./schema/tpv/tpvDefs";
import VentaDefs from "./schema/venta/ventaDefs";

// Sin FileUpload, se hace mediante REST
const TypeDefs = [
    productoDefs,
    ClienteDefs,
    VentaDefs,
    EmpleadoDefs,
    TpvDefs,
    CierreTpvDefs,
    LoginDefs,
    JwtValidatorDefs,
    fileDefs,
    DevolucionDefs,
    ProveedorDefs,
    MermaDefs
];

export default TypeDefs