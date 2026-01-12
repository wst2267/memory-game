const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// โหลดภาพหัว
const headImg = new Image();
headImg.src = "assets/love.png"; // PNG โปร่งใส

const particles = [];
const particleCount = 60;

for(let i=0;i<particleCount;i++){
  particles.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: Math.random()*20 + 15, // ขนาดรูป
    dx: (Math.random()-0.5)*0.5,
    dy: (Math.random()-0.5)*0.5,
    alpha: Math.random()*0.5 + 0.3,
    angle: Math.random()*360,  // มุมหมุน
    dAngle: (Math.random()-0.5)*0.02 // ความเร็วหมุน
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let p of particles){
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x + p.size/2, p.y + p.size/2);
    ctx.rotate(p.angle);
    
    // Glow effect รอบหัว
    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 10;

    ctx.drawImage(headImg, -p.size/2, -p.size/2, p.size, p.size);
    ctx.restore();

    // Update position
    p.x += p.dx;
    p.y += p.dy;
    p.angle += p.dAngle;

    // Wrap around
    if(p.x < -p.size) p.x = canvas.width;
    if(p.x > canvas.width) p.x = -p.size;
    if(p.y < -p.size) p.y = canvas.height;
    if(p.y > canvas.height) p.y = -p.size;
  }

  requestAnimationFrame(draw);
}

// เริ่มวาดเมื่อโหลดภาพแล้ว
headImg.onload = () => draw();

window.addEventListener("resize", ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
