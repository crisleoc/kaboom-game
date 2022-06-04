import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"

kaboom({
    background: [142, 236, 245],
    font: "sinko",
})

loadSprite("AlienGreen1R", "./art/Characters/character_0000_R.png")
loadSprite("AlienGreen2R", "./art/Characters/character_0001_R.png")
loadSprite("AlienGreen1L", "./art/Characters/character_0000_L.png")
loadSprite("AlienGreen2L", "./art/Characters/character_0001_L.png")

let score = 0;
let lvl = 1;
let playerVelocity = 300
let value = 0
let objVelocity = 0


scene("game", () => {

    score = 0;
    lvl = 1;
    playerVelocity = 300
    value = 0
    objVelocity = 0

    const AlienGreen = add([
        sprite("AlienGreen1R"),
        pos(500, height() - 50),
        scale(2),
        area(),
        body(),
    ])

    onKeyPress("space", () => {
        if (AlienGreen.isGrounded()) {
            AlienGreen.jump(700 + value)
        }
    })

    keyDown('d', () => {
        AlienGreen.use(sprite('AlienGreen1R'))
        AlienGreen.move(playerVelocity, 0)
        wait(rand(0.1), () => {
            AlienGreen.use(sprite('AlienGreen2R'))
        })
        wait(rand(0.1), () => {
            AlienGreen.use(sprite('AlienGreen1R'))
        })
    })
    keyDown('a', () => {
        AlienGreen.use(sprite('AlienGreen1L'))
        AlienGreen.move(-playerVelocity, 0)
        wait(rand(0.1), () => {
            AlienGreen.use(sprite('AlienGreen2L'))
        })
        wait(rand(0.1), () => {
            AlienGreen.use(sprite('AlienGreen1L'))
        })
    })

    // AlienGreen.action(() => {
    //     camPos(AlienGreen.pos)
    // })

    add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(2),
        area(),
        solid(),
        color(255, 243, 176),
    ])

    // loop(1, () => {
    // })

    function spawnObjects() {
        add([
            "roca",
            rect(rand(20 + value, 200 + value), rand(20 + value, 70 + value)),
            area(),
            outline(2),
            pos(width(), height() - 48),
            origin("botleft"),
            color(173, 181, 189),
            move(LEFT, 240 + objVelocity),
            solid(),
        ])
        add([
            "cactus",
            rect(rand(20, 30 + (value / 10)), rand(20 + value, 100 + value)),
            area(),
            outline(2),
            pos(width() + rand(0, 100), height() - 48),
            origin("botleft"),
            color(118, 200, 147),
            move(LEFT, 240 + objVelocity),
            solid(),
        ])
        wait(rand(1, 2.5), () => {
            spawnObjects()
        })
    }

    spawnObjects()

    AlienGreen.onCollide("roca", () => {
        shake()
    })

    AlienGreen.onCollide("cactus", () => {
        addKaboom(AlienGreen.pos)
        go("lose")
    })

    const scoreLabel = add([
        text(`Score: ${score}`, {
            size: 40,
        }),
        pos(24, 24)
    ])

    const lvlLabel = add([
        text(`Lvl: ${lvl}`, {
            size: 40,
        }),
        pos(width() - 250, 24)
    ])

    onUpdate(() => {
        score++
        scoreLabel.text = `Score: ${score}`
        if (score % 500 == 0) {
            destroyAll("roca")
            destroyAll("cactus")
            lvl++
            lvlLabel.text = `Lvl: ${lvl}`
            playerVelocity += 10
            objVelocity += 10
            value += 10
        }
    })
})

scene("lose", () => {
    add([
        text(`Game Over\nScore: ${score}\nLvl: ${lvl}\nPress enter to restart`, { size: 40 }),
        pos(center()),
        origin("center"),
    ])

    keyPress("enter", () => {
        go("game")
    })
})

scene("start", () => {
    add([
        text(`Click the screen to start\nRight: press A\nLeft: press D\nJump: press space bar`, { size: 40 }),
        pos(center()),
        origin("center"),
    ])

    onClick(() => {
        go("game")
    })
})

go("start")