import { SignedXml } from "xml-crypto";
import { DOMParser, XMLSerializer } from "xmldom";
import fs from "fs";
import path from "path";

const privateKeyPath = path.join(process.cwd(), "cert", "private_pkcs1.key");
const certificatePath = path.join(process.cwd(), "cert", "certificate.pem");

if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certificatePath)) {
    throw new Error("El archivo de clave privada o certificado no existe en la carpeta cert");
}

const privateKey = fs.readFileSync(privateKeyPath, "utf8").replace(/\r/g, "").trim();
const certificate = fs.readFileSync(certificatePath, "utf8").replace(/\r/g, "").trim();

export function firmarXML(xmlString: string): string {
    const sig = new SignedXml();
    const doc = new DOMParser().parseFromString(xmlString, "text/xml");

    sig.addReference("//*[local-name(.)='Invoice']", [
        "http://www.w3.org/2000/09/xmldsig#enveloped-signature"
    ], "http://www.w3.org/2001/04/xmlenc#sha256", "", "", "#SignatureSP");

    sig.signingKey = privateKey;
    sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";
    sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";

    sig.keyInfoProvider = {
        getKeyInfo: function () {
            const certBase64 = certificate
                .replace(/-----BEGIN CERTIFICATE-----/g, "")
                .replace(/-----END CERTIFICATE-----/g, "")
                .replace(/\n/g, "");
            return `<ds:X509Data><ds:X509Certificate>${certBase64}</ds:X509Certificate></ds:X509Data>`;
        },
    };

    console.log("XML antes de firmar:", new XMLSerializer().serializeToString(doc));

    sig.computeSignature(new XMLSerializer().serializeToString(doc), {
        prefix: "ds",
        location: {
            reference: "//*[local-name(.)='ExtensionContent']",
            action: "prepend",
        },
        attrs: {
            Id: "SignatureSP",
        },
    });

    return sig.getSignedXml();
}
