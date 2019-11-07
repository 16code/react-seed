export default function Particle(opt) {
    this.x = opt.x || 0;
    this.y = opt.y || 0;
    this.vx = opt.vx || Math.random() - 0.5;
    this.vy = opt.vy || Math.random() - 0.5;
    this.size = opt.size || Math.random() * 3;
    this.life = opt.life || Math.random() * 5;

    this.dead = false;

    this.alpha = 1;
    this.rotate = 0;
    this.color = opt.color || 'rgba(244,244,244,.9)';

    this.update = update;
    this.render = render;
    // return this;
}

function update(ctx) {
    this.x += this.vx;
    this.y += this.vy;

    this.life -= 0.01;
    this.alpha -= 0.003;
    this.rotate += (Math.random() * 0.02) - 0.01; // prettier-ignore
    if (this.life < 0) {
        this.dead = true;
        this.alpha = 0;
        return;
    }
    this.render(ctx);
}

function render(ctx) {
    const dot = this;
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.globalAlpha = dot.alpha;
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
}
