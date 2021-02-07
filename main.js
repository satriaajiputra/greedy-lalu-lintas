let app;
document.addEventListener("DOMContentLoaded", (ev) => {
  app = new Vue({
    el: "#app",
    data: {
      monitoring: false,
      submitted: false,
      showCensorForm: false,
      drawer: null,
      chart: null,
      chartConfig: chartConfig,
      time: {
        A: 10, // sangat lambat
        B: 8, // lambat
        C: 5, // menengah
        D: 4, // cepat
        E: 2, // sangat cepat
      },
      // himpunan kandidat
      C: ["AAAA", "AABB", "ACAD", "DAAD"],
      greedyLalintas: null,
      solusiLampu: {},
      // censor data akan digunakan pada highcharts
      censorData: [
        {
          name: "Jalur 1",
          data: [],
        },
        {
          name: "Jalur 2",
          data: [],
        },
        {
          name: "Jalur 3",
          data: [],
        },
        {
          name: "Jalur 4",
          data: [],
        },
      ],
      // model untuk form input censor (JIN/JOUT)
      form: {
        j1in: 150,
        j1out: 100,
        j2in: 100,
        j2out: 75,
        j3in: 120,
        j3out: 70,
        j4in: 110,
        j4out: 80,
      },
    },
    watch: {
      async submitted() {
        console.log('executed')
        this.showCensorForm = false
        await this.updateCensor()
        this.showCensorForm = true;
      }
    },
    computed: {
      series() {
        return this.censorData.map((censor) => {
          let data = censor.data.map((data) => {
            return Math.abs(data.jin - data.jout);
          });

          return {
            name: censor.name,
            data,
          };
        });
      },
    },
    methods: {
      start() {
        this.monitoring = true;
        this.showCensorForm = true;
        this.submitted = false
      },
      sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
      submitCensor() {
        this.submitted = !this.submitted;
      },
      async updateCensor() {
        // validasi
        let error = false;
        for (let i in this.form) {
          if (this.form[i] < 0) error = true;
        }

        if (error) {
          alert("Semua nilai pada sensor harus diisi!");
          return this.updateCensor();
        }
        // end validasi

        // tambahkan input ke data sendor

        let dataSensor = [];

        for (let i in this.censorData) {
          i = parseInt(i);
          let jin = this.form[`j${i + 1}in`];
          let jout = this.form[`j${i + 1}out`];
          let result = {
            jin: parseInt(jin),
            jout: parseInt(jout),
          };

          this.censorData[i].data.push(result);
          dataSensor.push(result);
        }

        // count waktu
        this.greedyLalintas.setDataSensor(dataSensor);
        this.solusiLampu = this.greedyLalintas.count();

        // update chart
        this.updateChart();

        // start monitoring on canvas
        this.drawer.setTimes(
          this.greedyLalintas.convertTime(this.solusiLampu.waktuLampu)
        );
        await this.drawer.start();
      },
      updateChart() {
        this.series.forEach((item, i) => {
          this.chart.series[i].update({
            data: item.data,
          });
        });
      },
    },
    created() {
      this.greedyLalintas = new GreedyLalintas(this.C, this.time);
    },
    mounted() {
      this.drawer = new Drawer("stage");
      this.chartConfig.series = this.series;
      this.chart = Highcharts.chart(this.$refs.chart, chartConfig);
    },
  });
});
