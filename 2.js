const daftarVoucher = [
    {
      kodeVoucher: "DumbWaysJos",
      minimalBelanja: 50000,
      persenDiskon: 21.1,
      maksimalDiskon: 20000,
    },
    {
      kodeVoucher: "DumbWaysMantap",
      minimalBelanja: 80000,
      persenDiskon: 30,
      maksimalDiskon: 40000,
    },
  ];
  
  function hitungVoucher(kodeVoucher, totalBelanja) {
    const voucherDitemukan = daftarVoucher.find(
      (voucher) => voucher.kodeVoucher.toLowerCase() === kodeVoucher.toLowerCase()
    );
  
    if (voucherDitemukan) {
      const memenuhiSyarat = totalBelanja >= voucherDitemukan.minimalBelanja;
      const diskon = memenuhiSyarat ? voucherDitemukan.persenDiskon : 0;
      const totalDiskon =
        (totalBelanja * diskon) / 100 > voucherDitemukan.maksimalDiskon
          ? voucherDitemukan.maksimalDiskon
          : (totalBelanja * diskon) / 100;
  
      const totalBayar = totalBelanja - totalDiskon;
  
      console.log("Uang yang harus dibayar: ", totalBayar);
      console.log("Diskon yang didapat: ", totalDiskon);
      console.log("Kembalian: ", totalBelanja - totalBayar);
    } else {
      console.log("Voucher tidak ditemukan");
    }
  }
  
  hitungVoucher("DumbWaysMantap", 100000);
  