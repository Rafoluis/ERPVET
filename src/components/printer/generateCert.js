import { exec } from "child_process";
import path from "path";

const certDir = path.join(process.cwd(), "cert");

exec(`mkdir "${certDir}"`, () => {
    exec('openssl genrsa -out cert/private_pkcs1.key 2048', (err, stdout, stderr) => {
        if (err) {
            console.error("Error generando clave:", stderr);
            return;
        }
        console.log("Clave generada.");
        exec('openssl req -new -key cert/private_pkcs1.key -out cert/request.csr', (err, stdout, stderr) => {
            if (err) {
                console.error("Error generando CSR:", stderr);
                return;
            }
            console.log("CSR generado.");
            exec('openssl x509 -req -days 365 -in cert/request.csr -signkey cert/private_pkcs1.key -out cert/certificate.pem', (err, stdout, stderr) => {
                if (err) {
                    console.error("Error generando certificado:", stderr);
                    return;
                }
                console.log("Certificado generado.");
            });
        });
    });
});
