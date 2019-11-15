var canvas = document.getElementById('example');
const marioImage = document.getElementById('mario');
const marioBg = document.getElementById('mario-bg');
const marioTheme = document.getElementById('mario-theme');
const koopa = document.getElementById('koopa');

class MarioGame {
    constructor(canvas, backgroundSrc) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.intervalId;
        this.player;
        this.gravity = 5;
        this.floorYPos = canvas.height - 70;
        this.xPosBg = 0;
        this.xPosBg2 = canvas.width;
        this.backgroundSrc = backgroundSrc;
        this.enemies = [];
        this.frames = 0;
    }

    startGame() {
        this.createKeyEvents()
        this.player = new Mario(130, 24, 30, 30, marioImage);
        this.intervalId = setInterval(()=> {
            this.frames++;
            if (this.frames % 50 == 0) {
                this.enemies.push(new Unit(this.width, this.floorYPos - 20, 20, 20, koopa, 3))
            }
            this.enemies.forEach(koo=> {
                if(this.player.checkCollision(koo)){
                    this.endGame()
                }
            })
            this.draw();
        }, 100)
    }

    endGame(){
        clearInterval(this.intervalId);
        alert('Bowser gana')
    }

    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawBackground();
        this.player.drawItself(this.ctx, this.gravity, this.floorYPos)
        this.enemies.forEach(koo=> {
            koo.xPos-=koo.speed;
            koo.drawItself(this.ctx, this.gravity, this.floorYPos)
        })
    }

    createKeyEvents(){
        document.onkeydown = (event) => {
            switch(event.which) {
                case 37:
                    this.move(5)
                    break;
                case 39:
                    this.move(-5)
                    break;
                case 38:
                    this.player.jump();
                default:
                    break;
            }
        }
    }

    drawBackground() {
        if (this.xPosBg < 0) {
            this.xPosBg2 = this.xPosBg + this.width
        }
        if (this.xPosBg > 0) {
            this.xPosBg2 = this.xPosBg - this.width
        }
        if (this.xPosBg2 < 0) {
            this.xPosBg = this.xPosBg2 + this.width
        }
        if (this.xPosBg2 > 0) {
            this.xPosBg = this.xPosBg2 - this.width
        }
        this.ctx.drawImage(this.backgroundSrc, this.xPosBg, 0, this.width, this.height);
        this.ctx.drawImage(this.backgroundSrc, this.xPosBg2, 0, this.width, this.height);
    }

    move(value){
        this.xPosBg+=value;
        this.xPosBg2+=value;
        this.enemies.forEach(koo=> {
            koo.xPos+=value;
        })
    }
}

class Unit {
    constructor(xPos, yPos, width, height, imageSrc, speed) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc;
        this.speed = speed
    }

    drawItself(ctx, gravity, floorYPos){
        if (this.yPos + this.height < floorYPos) {
                this.yPos+=gravity;
            }
        if (this.yPos + this.height > floorYPos) {
            this.yPos = floorYPos - this.height;
        }
        ctx.drawImage(this.imageSrc, this.xPos, this.yPos, this.width, this.height);
    }
}

class Mario extends Unit {
    jump(){
        this.yPos-=50;
    }

    checkCollision(unit){
        if (this.xPos + this.width > unit.xPos && unit.xPos + unit.width > this.xPos && this.yPos < unit.yPos + unit.height && this.yPos + this.height > unit.yPos) {
            return true;
        }
        return false;
    }
}

let game = new MarioGame(canvas, marioBg);
game.startGame();