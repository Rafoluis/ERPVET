import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { DOMImplementation, XMLSerializer } from "xmldom";
import { firmarXML } from "@/components/printer/signatureDigital";

const baseDir = path.join("C:", "Users", "Usuario", "Desktop", "2024-Tr");
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log("Carpeta base creada:", baseDir);
}

function generarXMLBoleta() {
    const ruc = "20100113612";
    const serie = "B001";
    const numero = "00000001";
    const tipoDocumento = "03"; // Boleta
    const fechaEmision = "2025-02-26";
    const horaEmision = "12:00:00";
    const moneda = "PEN";

    const doc = new DOMImplementation().createDocument("", "Invoice", null);
    const root = doc.documentElement;
    root.setAttribute("xmlns", "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2");
    root.setAttribute("Id", "SignatureSP");
    root.setAttribute("xmlns:cac", "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2");
    root.setAttribute("xmlns:cbc", "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2");
    root.setAttribute("xmlns:ext", "urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2");

    root.appendChild(createElementWithText(doc, "cbc:UBLVersionID", "2.1"));
    root.appendChild(createElementWithText(doc, "cbc:CustomizationID", "2.0"));
    root.appendChild(createProfileID(doc, "0101"));

    const ublExtensions = doc.createElement("ext:UBLExtensions");
    const ublExtension = doc.createElement("ext:UBLExtension");
    const extensionContent = doc.createElement("ext:ExtensionContent");
    ublExtension.appendChild(extensionContent);
    ublExtensions.appendChild(ublExtension);
    root.appendChild(ublExtensions);

    root.appendChild(createSignatureBlock(doc, ruc));
    root.appendChild(createElementWithText(doc, "cbc:ID", `${serie}-${numero}`));
    root.appendChild(createElementWithText(doc, "cbc:IssueDate", fechaEmision));
    root.appendChild(createElementWithText(doc, "cbc:IssueTime", horaEmision));
    root.appendChild(createInvoiceTypeCode(doc, tipoDocumento));
    root.appendChild(createCurrencyElement(doc, moneda));
    root.appendChild(createElementWithText(doc, "cbc:Note", "MIL OCHOCIENTOS CINCUENTA Y OCHO CON 59/100 Soles"));

    root.appendChild(createSupplier(doc, ruc));
    root.appendChild(createCustomer(doc));
    root.appendChild(createDocumentReferences(doc));
    root.appendChild(createTaxTotal(doc, moneda, "18.00"));
    root.appendChild(createLegalMonetaryTotal(doc, moneda));
    root.appendChild(createInvoiceLine(doc, moneda));

    return new XMLSerializer().serializeToString(doc);
}
function createSignatureBlock(doc: XMLDocument, ruc: string) {
    const signature = doc.createElement("cac:Signature");
    signature.appendChild(createElementWithText(doc, "cbc:ID", "SignatureSP"));
    const signatoryParty = doc.createElement("cac:SignatoryParty");
    const partyIdentification = doc.createElement("cac:PartyIdentification");
    partyIdentification.appendChild(createElementWithText(doc, "cbc:ID", ruc));
    signatoryParty.appendChild(partyIdentification);
    const partyName = doc.createElement("cac:PartyName");
    partyName.appendChild(createElementWithText(doc, "cbc:Name", "Empresa de Ejemplo S.A.C."));
    signatoryParty.appendChild(partyName);
    signature.appendChild(signatoryParty);
    const digitalSignatureAttachment = doc.createElement("cac:DigitalSignatureAttachment");
    const externalReference = doc.createElement("cac:ExternalReference");
    externalReference.appendChild(createElementWithText(doc, "cbc:URI", "#SignatureSP"));
    digitalSignatureAttachment.appendChild(externalReference);
    signature.appendChild(digitalSignatureAttachment);

    return signature;
}

function createElementWithText(doc: XMLDocument, tag: string, text: string) {
    const element = doc.createElement(tag);
    element.appendChild(doc.createTextNode(text));
    return element;
}

function createProfileID(doc: XMLDocument, value: string) {
    const element = doc.createElement("cbc:ProfileID");
    element.setAttribute("schemeName", "SUNAT:Identificador de Tipo de Operación");
    element.setAttribute("schemeAgencyName", "PE:SUNAT");
    element.setAttribute("schemeURI", "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo17");
    element.appendChild(doc.createTextNode(value));
    return element;
}

function createInvoiceTypeCode(doc: XMLDocument, value: string) {
    const element = doc.createElement("cbc:InvoiceTypeCode");
    element.setAttribute("listAgencyName", "PE:SUNAT");
    element.setAttribute("listName", "SUNAT:Identificador de Tipo de Documento");
    element.setAttribute("listURI", "urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01");
    element.appendChild(doc.createTextNode(value));
    return element;
}

function createCurrencyElement(doc: XMLDocument, currency: string) {
    const element = doc.createElement("cbc:DocumentCurrencyCode");
    element.setAttribute("listID", "ISO 4217 Alpha");
    element.setAttribute("listName", "Currency");
    element.setAttribute("listAgencyName", "United Nations Economic Commission for Europe");
    element.appendChild(doc.createTextNode(currency));
    return element;
}

function createSupplier(doc: XMLDocument, ruc: string) {
    const supplier = doc.createElement("cac:AccountingSupplierParty");
    const party = doc.createElement("cac:Party");
    party.appendChild(createElementWithText(doc, "cbc:RegistrationName", "Empresa de Ejemplo S.A.C."));
    const taxScheme = doc.createElement("cac:PartyTaxScheme");
    taxScheme.appendChild(createElementWithText(doc, "cbc:CompanyID", ruc));
    const registrationAddress = doc.createElement("cac:RegistrationAddress");
    registrationAddress.appendChild(createElementWithText(doc, "cbc:AddressTypeCode", "0001"));
    taxScheme.appendChild(registrationAddress);
    party.appendChild(taxScheme);
    supplier.appendChild(party);
    return supplier;
}

function createCustomer(doc: XMLDocument) {
    const customer = doc.createElement("cac:AccountingCustomerParty");
    const party = doc.createElement("cac:Party");
    party.appendChild(createElementWithText(doc, "cbc:RegistrationName", "Cliente Ejemplo"));
    party.appendChild(createElementWithText(doc, "cbc:ID", "20600000001"));
    customer.appendChild(party);
    return customer;
}

function createDocumentReferences(doc: XMLDocument) {
    const references = doc.createElement("cac:DespatchDocumentReference");
    references.appendChild(createElementWithText(doc, "cbc:ID", "031-002020"));
    references.appendChild(createElementWithText(doc, "cbc:DocumentTypeCode", "09"));
    return references;
}

function createTaxTotal(doc: XMLDocument, currency: string, amount: string) {
    const taxTotal = doc.createElement("cac:TaxTotal");
    const taxAmount = createElementWithText(doc, "cbc:TaxAmount", amount);
    taxAmount.setAttribute("currencyID", currency);
    taxTotal.appendChild(taxAmount);

    const taxSubtotal = doc.createElement("cac:TaxSubtotal");
    const subTaxAmount = createElementWithText(doc, "cbc:TaxAmount", amount);
    subTaxAmount.setAttribute("currencyID", currency);
    taxSubtotal.appendChild(subTaxAmount);
    const taxCategory = doc.createElement("cac:TaxCategory");
    taxCategory.appendChild(createElementWithText(doc, "cbc:ID", "S"));
    taxCategory.appendChild(createElementWithText(doc, "cbc:Name", "IGV"));
    taxCategory.appendChild(createElementWithText(doc, "cbc:TaxTypeCode", "VAT"));
    taxCategory.appendChild(createElementWithText(doc, "cbc:Percent", "18.00"));

    const taxScheme = doc.createElement("cac:TaxScheme");
    taxScheme.appendChild(createElementWithText(doc, "cbc:ID", "1000"));
    taxScheme.appendChild(createElementWithText(doc, "cbc:Name", "IGV"));
    taxScheme.appendChild(createElementWithText(doc, "cbc:TaxTypeCode", "VAT"));
    taxCategory.appendChild(taxScheme);

    taxSubtotal.appendChild(taxCategory);
    taxTotal.appendChild(taxSubtotal);

    return taxTotal;
}

function createLegalMonetaryTotal(doc: XMLDocument, currency: string) {
    const total = doc.createElement("cac:LegalMonetaryTotal");
    const lineExtensionAmount = doc.createElement("cbc:LineExtensionAmount");
    lineExtensionAmount.setAttribute("currencyID", currency);
    lineExtensionAmount.appendChild(doc.createTextNode("100.00"));
    total.appendChild(lineExtensionAmount);
    const taxInclusiveAmount = doc.createElement("cbc:TaxInclusiveAmount");
    taxInclusiveAmount.setAttribute("currencyID", currency);
    taxInclusiveAmount.appendChild(doc.createTextNode("118.00"));
    total.appendChild(taxInclusiveAmount);
    const payableAmount = doc.createElement("cbc:PayableAmount");
    payableAmount.setAttribute("currencyID", currency);
    payableAmount.appendChild(doc.createTextNode("118.00"));
    total.appendChild(payableAmount);
    return total;
}

function createInvoiceLine(doc: XMLDocument, currency: string) {
    const line = doc.createElement("cac:InvoiceLine");
    line.appendChild(createElementWithText(doc, "cbc:ID", "1"));
    line.appendChild(createElementWithText(doc, "cbc:InvoicedQuantity", "1"));

    const lineExtensionAmount = createElementWithText(doc, "cbc:LineExtensionAmount", "100.00");
    lineExtensionAmount.setAttribute("currencyID", currency);
    line.appendChild(lineExtensionAmount);

    const pricingReference = doc.createElement("cac:PricingReference");
    const alternativeConditionPrice = doc.createElement("cac:AlternativeConditionPrice");
    const priceAmount = createElementWithText(doc, "cbc:PriceAmount", "118.00");
    priceAmount.setAttribute("currencyID", currency);
    alternativeConditionPrice.appendChild(priceAmount);
    alternativeConditionPrice.appendChild(createElementWithText(doc, "cbc:PriceTypeCode", "01"));
    pricingReference.appendChild(alternativeConditionPrice);
    line.appendChild(pricingReference);

    const price = doc.createElement("cac:Price");
    const priceAmountNode = createElementWithText(doc, "cbc:PriceAmount", "100.00");
    priceAmountNode.setAttribute("currencyID", currency);
    price.appendChild(priceAmountNode);
    line.appendChild(price);

    const taxTotal = createTaxTotal(doc, currency, "18.00");
    line.appendChild(taxTotal);

    return line;
}

function crearArchivoZIP(xmlData: string, fileName: string): Promise<string> {
    console.log("entro a crear archivo")
    return new Promise((resolve, reject) => {
        const baseDir = path.join("C:", "Users", "Usuario", "Desktop", "2024-Tr");
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
            console.log("Carpeta base creada en ZIP:", baseDir);
        }
        const zipPath = path.join(baseDir, `${fileName}.zip`);
        const xmlPath = path.join(baseDir, `${fileName}.xml`);

        fs.writeFileSync(xmlPath, xmlData);
        console.log("XML guardado en:", xmlPath);

        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => {
            console.log("Archivo ZIP creado, tamaño:", fs.statSync(zipPath).size, "bytes");
            if (fs.existsSync(zipPath)) {
                resolve(zipPath);
            } else {
                reject(new Error("El archivo ZIP no se creó correctamente"));
            }
        });
        archive.on("error", (err) => {
            console.error("Error en archivado:", err);
            reject(err);
        });

        archive.pipe(output);
        archive.append(fs.createReadStream(xmlPath), { name: `${fileName}.xml` });
        archive.finalize();
    });
}

async function obtenerTokenSunat(): Promise<string> {
    const client_id = "ada5aba8-1495-4c69-991f-b28d065733b5";
    const client_secret = "vI6cef6giA+scRYn7rhTQg==";
    const tokenResponse = await fetch(
        `https://api-seguridad.sunat.gob.pe/v1/clientesextranet/${client_id}/oauth2/token/`,
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                scope: "https://api.sunat.gob.pe/v1/contribuyente/contribuyentes",
                client_id,
                client_secret,
            }),
        }
    );
    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Error obteniendo token: ${errorText}`);
    }
    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

async function enviarBoleta(zipPath: string, accessToken: string): Promise<any> {
    const zipBuffer = fs.readFileSync(zipPath);
    const response = await fetch(
        "https://api-sire.sunat.gob.pe/v1/contribuyente/migeigv/libros/rvierce/receptorpropuesta/web/propuesta/upload",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/zip",
                Authorization: `Bearer ${accessToken}`,
                SOAPAction: "",
            },
            body: zipBuffer,
        }
    );
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al enviar boleta: ${errorText}`);
    }
    return response.json();
}

export async function POST(req: NextRequest) {
    try {
        const ruc = "10716191953";
        const tipoComprobante = "03";
        const serie = "B001";
        const numero = "00000001";
        const fileName = `${ruc}-${tipoComprobante}-${serie}-${numero}`;

        console.log("Generando XML para boleta:", fileName);
        let xmlData = generarXMLBoleta();

        console.log("Firmando el XML");
        xmlData = firmarXML(xmlData);

        console.log("Creando archivo ZIP");
        const zipPath = await crearArchivoZIP(xmlData, fileName);

        console.log("Token de acceso");
        const accessToken = await obtenerTokenSunat();
        console.log("Token obtenido");

        console.log("Enviando archivo ZIP, tamaño:", fs.statSync(zipPath).size, "bytes");
        const responseData = await enviarBoleta(zipPath, accessToken);

        console.log("Boleta enviada exitosamente");
        return NextResponse.json(responseData);
    } catch (error: any) {
        console.error("Error en API de boleta:", error);
        return NextResponse.json({ error: "Error en API de boleta", details: error.message }, { status: 500 });
    }
}
