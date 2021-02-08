class Drawer {
  constructor(canvasId) {
    this.state = 1;
    this.lastPos = 0;
    this.loop = false;
    this.times = []; // 10 seconds
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.drawTrack();
  }

  setTimes(times) {
    this.times = times
  }

  drawTrack() {
    this.ctx.fillStyle = "#ddd";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    // col
    this.ctx.moveTo(150, 0);
    this.ctx.lineTo(150, 400);
    this.ctx.moveTo(250, 0);
    this.ctx.lineTo(250, 400);
    this.ctx.moveTo(150 + 100 / 2, 0);
    this.ctx.lineTo(150 + 100 / 2, 150);

    this.ctx.moveTo(150 + 100 / 2, 250);
    this.ctx.lineTo(150 + 100 / 2, 400);

    // row
    this.ctx.moveTo(0, 150);
    this.ctx.lineTo(400, 150);
    this.ctx.moveTo(0, 250);
    this.ctx.lineTo(400, 250);

    this.ctx.moveTo(0, 150 + 100 / 2);
    this.ctx.lineTo(150, 150 + 100 / 2);

    this.ctx.moveTo(250, 150 + 100 / 2);
    this.ctx.lineTo(400, 150 + 100 / 2);

    this.ctx.stroke();
    this.ctx.closePath();

    // on center
    this.ctx.clearRect(149, 149, 102, 102);

    // add label
    this.ctx.fillStyle = "#333";
    this.ctx.font = "14px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText('J1', 117, 12, 25);
    this.ctx.fillText('J2', 363, 126, 25);
    this.ctx.fillText('J3', 270, 372, 25);
    this.ctx.fillText('J4', 12, 126, 25);
  }

  loadImage(source, width = 21, height = 59) {
    return new Promise((res) => {
      const img = new Image(width, height);
      img.src = source;
      img.onload = () => res(img);
    });
  }

  async drawImage() {
    const arrowUp = await this.loadImage("./arrow-up.svg");
    const arrowDown = await this.loadImage("./arrow-down.svg");
    const arrowLeft = await this.loadImage("./arrow-left.svg");
    const arrowRight = await this.loadImage("./arrow-right.svg");

    this.ctx.drawImage(arrowUp, 164.71, 41.03, 21, 59);
    this.ctx.drawImage(arrowUp, 164.71, 300, 21, 59);

    this.ctx.drawImage(arrowDown, 214.71, 44, 21, 59);
    this.ctx.drawImage(arrowDown, 214.71, 300, 21, 59);

    this.ctx.drawImage(arrowLeft, 44, 214.5, 59, 21);
    this.ctx.drawImage(arrowLeft, 300, 214.5, 59, 21);

    this.ctx.drawImage(arrowRight, 44, 164.5, 59, 21);
    this.ctx.drawImage(arrowRight, 300, 164.5, 59, 21);
  }

  drawCircle(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawLamp() {
    let vertical = ["red", "yellow", "green"][this.state];
    let horizontal = ["green", "yellow", "red"][this.state];

    this.drawCircle(225, 137, 5, vertical);
    this.drawCircle(258, 223, 5, horizontal);
    this.drawCircle(172, 258, 5, vertical);
    this.drawCircle(137, 173, 5, horizontal);
  }

  drawSecond(ms) {
    this.ctx.clearRect(293, 10, 100, 30);
    this.ctx.fillStyle = "red";
    this.ctx.font = "24px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(Math.round(ms / 1000), 314, 35, 70);
  }

  changeLamp(ms) {
    return new Promise((res) => {
      setTimeout(() => {
        if (this.state === 0 || this.state === 2) this.lastPos = this.state
        this.state += 1 * (this.lastPos === 2 ? -1 : 1)
        this.drawLamp(this.state)
        res(true)
      }, ms + 1000)
    })
  }

  drawInterval(ms) {
    let countdown = ms;

    let interval = setInterval(() => {
      this.drawSecond(countdown);
      if (countdown === 0) clearInterval(interval);
      countdown -= 1000;
    }, 1000);
  }

  async start() {
    this.drawImage();
    this.drawLamp();

    // draw 'detik'
    this.ctx.font = "24px sans-serif";
    this.ctx.fillStyle = "#666";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Detik", 293 + 70 / 2, 67, 70);

    for(let item of this.times) {
      let time = parseInt(item)*1000

      // show yellow lamp first
      if(this.state===1) {
        await (async () => {
          this.drawInterval(1000)
          return await this.changeLamp(1000)
        })()
      }

      // counter drawer
      this.drawInterval(time)
      

      // lamp changer
      await this.changeLamp(time);
    }

    return new Promise(res => res('finished'))
  }

  stop() {
    this.loop = false;
  }
}
