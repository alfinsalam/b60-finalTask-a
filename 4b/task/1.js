function cekPrima(angka) {
    if (angka <= 1) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(angka); i++) {
        if (angka % i === 0) {
            return false;
        }
    }
    return true;
}

function gambarSegitigaSiku(sisi) {
    let angkaPrima = 2;

    for (let i = 0; i < sisi; i++) {
        for (let j = 0; j <= i; j++) {
            while (!cekPrima(angkaPrima)) {
                angkaPrima++;
            }

            process.stdout.write(angkaPrima + " ");
            angkaPrima++;
        }
        console.log(""); 
    }
}

gambarSegitigaSiku(7);
