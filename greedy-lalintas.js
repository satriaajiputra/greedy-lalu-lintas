class GreedyLalintas {

  /**
   * 
   * @param {Array} C himpunan kandidat // ["AAAA", "AABB", "ACAD", "DAAD"]
   */
  constructor(C = null, time = null) {
    this.time = time || {
      "A": 50, // sangat lambat
      "B": 40, // lambat
      "C": 30, // menengah
      "D": 20, // cepat
      "E": 10, // sangat cepat
    }

    // himpunan kandidat
    this.C = C || [
      "AAAA", "AABB", "ACAD", "DAAD",
    ]

    // data sensor setiap jalur
    this.dataSensor = []

    // nilai himpunan solusi kandidat
    // bentuk S = {himpunan: [], sr: xx}
    // sr = selisih rata-rata
    this.S = null
  }

  setDataSensor(data) {
    this.dataSensor = data
  }

  // clone himpunan kandidat
  cloneCandidate() {
    return Object.assign([], this.C)
  }

  // convert time to second
  convertTime(waktuLampu) {
    let waktu = []
    for(let i of waktuLampu) {
      waktu.push(this.time[i])
    }
    return waktu
  }

  count() {
    let tempCandidate = this.cloneCandidate()
    
    // delay lampu hijau terakhir
    let dht;
    
    // variabel untuk menyimpan nilai himp. kandidat terseleksi sementara
    let tempSelected = []
    
    // himpunan solusi sementara, digunakan untuk
    // perbandingan di fungsi kelayakan
    let tempS = []
    
    for(let n = 0; n < this.dataSensor.length; n++) {
      // tukar nilai himp. kandidat terseleksi sementara
      let lastCandidate = [...tempSelected]

      // isi tempSelected dengan nilai yang baru menggunakan
      // fungsi seleksi
      tempSelected = tempCandidate.shift()

      // fungsi obyektif

      // densitas antrian sementara
      let dap = []

      for(let i in tempSelected) {
        // waktu delay lampu hijau sementara
        let dhs = this.time[tempSelected[i]]

        // jika lastCandidate ada nilanya
        if(lastCandidate.length > 0) {
          dht = this.time[lastCandidate[i]]
        } else if(!this.S) {
          dht = this.time[tempSelected[i]]
        } else {
          dht = this.time[this.S.himpunan[i]]
        }

        // hitung kecepatan arus kendaraan yang masuk terakhir
        let vin = this.dataSensor[i].jin/dht

        // hitung kecepatan arus kendaraan yang keluar terakhir
        let vout = this.dataSensor[i].jout/dht

        // masukkan nilai perhitungan vin dan vout ke DAP
        dap.push(Math.abs((vin*dhs) - (vout*dhs)))  
      }

      // menghitung selisih rata-rata
      let sr = calculateCombination(dap, 2)

      // masukkan selisih rata-rata ke dalam himp. solusi sementara
      tempS.push({himpunan: tempSelected, sr})

      // akhir fungsi obyektif
    }

    // fungsi kelayakan
    // membandingkan nilai S. ambil nilai S dengan sr yang terkecil
    // sr = selisih rata-rata
    tempS.forEach(s => {
      if(!this.S) this.S = s
      else if(this.S.sr > s.sr) {
        this.S = s
      }
    })

    return {
      waktuLampu: this.S.himpunan,
      sr: this.S.sr,
    }
  }
}

// const time = {
//   "A": 50, // sangat lambat
//   "B": 40, // lambat
//   "C": 30, // menengah
//   "D": 20, // cepat
//   "E": 10 // sangat cepat
// };
// const C = [
//  "AAAA", "AABB", "ACAD", "DAAD",
// ];
// let jalur = [
//   [
//     {
//       jin: 150, jout: 100
//     },
//     {
//       jin: 100, jout: 75
//     },
//     {
//       jin: 120, jout: 70
//     },
//     {
//       jin: 110, jout: 80
//     }
//   ],
//   [
//     {
//       jin: 110, jout: 90
//     },
//     {
//       jin: 90, jout: 85
//     },
//     {
//       jin: 100, jout: 80
//     },
//     {
//       jin: 110, jout: 75
//     }
//   ]
// ];

// /// program
// function start() {
//   let S = null; // himpunan solusi S

//   for(let j in jalur) {
//     let candidate = [...C]
//     let lastTime;
//     let tempSelected = []; // himpunan bagian terseleksi sementara
//     let tempS = []; // himpunan solusi sementara

//     for(let c in C) {
//       let last = [...tempSelected]

//       // fungsi seleksi
//       tempSelected = candidate.shift()

//       // fungsi obyektif
//       let dap = [];

//       for(let i in tempSelected) {
//         let tempTime = time[tempSelected[i]]

//         if(last.length > 0) {
//           lastTime = time[last[i]]
//         } else if(!S) {
//           lastTime = time[tempSelected[i]]
//         } else {
//           lastTime = time[S.himpunan[i]]
//         }

//         let vin = jalur[j][i].jin/lastTime
//         let vout = jalur[j][i].jout/lastTime

//         // console.table({
//         //   dht: lastTime,
//         //   dhs: tempTime,
//         //   vin,
//         //   vout,
//         //   j
//         // })

//         dap.push(Math.abs((vin*tempTime) - (vout*tempTime)))  
//       }

//       let sr = calcCombination(dap, 2)

//       tempS.push({himpunan: tempSelected, sr})
//     }

//     // fungsi kelayakan
//     tempS.forEach(s => {
//       if(!S) S = s
//       else if(S.sr > s.sr) {
//         S = s
//       }
//     })

//     console.log('Waktu Lampu Hijau Untuk Siklus Ke-' + (parseInt(j)+1) + ':')

//     console.table({
//       J1: time[S.himpunan[0]] + ' detik',
//       J2: time[S.himpunan[1]] + ' detik',
//       J3: time[S.himpunan[2]] + ' detik',
//       J4: time[S.himpunan[3]] + ' detik',
//     })

//     console.log('Dengan selisih rata-rata: ', S.sr, '\n\n')

//     let totalWaktu = 0;
//     for(let w of S.himpunan) {
//       totalWaktu += time[w]
//     }

//     // await sleep(totalWaktu * 1000)
//   }

//   console.log('Siklus selesai');
// }

// start()