import { ObjectId } from "mongoose";
import { IEmployee } from "../types/Empleado";
import { ICierreTPV } from "../types/TPV";

const FormatDate = (strDate: string): Date => {
    const dateParts = strDate.split(" ");
    const fecha = dateParts[0].split("/")

    const dia = Number(fecha[0])
    const mes = Number(fecha[1]) - 1
    const anyo = Number("20" + fecha[2])

    const tiempo = dateParts[1].split(":")
    const hora = Number(tiempo[0])
    const minuto = Number(tiempo[1])

    const fechaFin = new Date(anyo, mes, dia, hora, minuto)
    fechaFin.setDate(fechaFin.getDate() - 1)

    return fechaFin
}

export const CreateCierre = (jsonData: any, empleado: IEmployee & { _id: any; }, tpvID: ObjectId): ICierreTPV => {
    const horaApertura = FormatDate(jsonData.APERTURA + ":00");
    const horaCierre = FormatDate(jsonData.CIERRE);

    if (jsonData.CERRADO_POR) {
        const cierre = {
            tpv: tpvID,
            abiertoPor: jsonData.ABIERTO_POR || jsonData.abiertoPor,
            cerradoPor: jsonData.CERRADO_POR || jsonData.cerradoPor,
            apertura: horaApertura || jsonData.apertura,
            cierre: horaCierre || jsonData.cierre,
            cajaInicial: Number(jsonData.CAJA_INICIAL) || jsonData.cajaInicial,
            ventasEfectivo: Number(jsonData.VENTAS_EFECTIVO) || jsonData.ventasEfectivo,
            ventasTarjeta: Number(jsonData.VENTAS_TARJETA) || jsonData.ventasTarjeta,
            ventasTotales: Number(jsonData.VENTAS_TOTALES) || jsonData.ventasTotales,
            dineroEsperadoEnCaja: Number(jsonData.DINERO_ESPERADO_EN_CAJA) || jsonData.dineroEsperadoEnCaja,
            dineroRealEnCaja: Number(jsonData.DINERO_REAL_EN_CAJA) || jsonData.dineroRealEnCaja,
            dineroRetirado: Number(jsonData.DINERO_RETIRADO) || jsonData.dineroRetirado,
            fondoDeCaja: Number(jsonData.FONDO_DE_CAJA) || jsonData.fondoDeCaja,
            beneficio: -1,
            nota: jsonData.NOTA || "" || jsonData.nota,
        } as ICierreTPV;

        if (cierre.beneficio && cierre.beneficio < 0) {
            delete cierre.beneficio
        }

        return cierre;
    }

    const cierre: ICierreTPV = {
        tpv: tpvID,
        abiertoPor: empleado,
        cerradoPor: empleado,
        apertura: horaApertura,
        cierre: horaCierre,
        cajaInicial: Number(jsonData.CAJA_INICIAL),
        ventasEfectivo: Number(jsonData.VENTAS_EFECTIVO),
        ventasTarjeta: Number(jsonData.VENTAS_TARJETA),
        ventasTotales: Number(jsonData.VENTAS_TOTALES),
        dineroEsperadoEnCaja: Number(jsonData.DINERO_REAL_EN_CAJA),
        dineroRealEnCaja: Number(jsonData.DINERO_REAL_EN_CAJA),
        dineroRetirado: Number(jsonData.DINERO_RETIRADO),
        fondoDeCaja: Number(jsonData.FONDO_DE_CAJA),
        beneficio: Number(jsonData.BENEFICIO) || -1,
        nota: jsonData.NOTA || ""
    } as ICierreTPV;

    if (cierre.beneficio && cierre.beneficio < 0) {
        delete cierre.beneficio
    }

    return cierre;
}

export const CreateCierreList = (jsonDataArray: any, empleado: IEmployee & { _id: any; }, tpvID: ObjectId): ICierreTPV[] => {
    let cierreList: ICierreTPV[] = [];
    for (var i = 0; i < jsonDataArray.length; i++) {
        const p = CreateCierre(jsonDataArray[i], empleado, tpvID);

        cierreList.push(p);
    }

    return cierreList;
}