var leftMargin = (window.innerWidth / 2) - 500;
var blockCollisions = [false, false, false, false]; // left, right, top, bottom
var wallCollisions = [false, false, false, false]; // left, right, top, bottom
var cpuVert = 0; //multiply this value by two to get speed in pixels per millisecond
var cpuHoriz = 0;
var puckVert = 0;
var puckHoriz = Math.floor(Math.random() * 21) - 10;
var userSpeed = [0, 0]; //(x, y)
var terminate = false;
var s1x;
var s2x;
var s1y;
var s2y;
var userGoalCount = 0;
var cpuGoalCount = 0;
var difficulty;
var firstStart = false;

async function loadGoal()
{
    await sleep(500);
    document.getElementById("goalBoxLeft").style.marginLeft = window.getComputedStyle(document.getElementById("container")).marginLeft;
    document.getElementById("goalBoxLeft").style.display = "block";
    document.getElementById("goalBoxRight").style.marginLeft = parseInt(window.getComputedStyle(document.getElementById("container")).marginLeft) + 1005 + "px";
    document.getElementById("goalBoxRight").style.display = "block";
}

function getDifficulty()
{
    difficulty = parseInt((prompt("What difficulty would you like to play at? (1 - 5)")))
    if (difficulty != 1 && difficulty != 2 && difficulty != 3 && difficulty != 4 && difficulty != 5)
    {
        getDifficulty();
    }
}

const obj = {updatePaddlePosition: async function(event)
{
    document.getElementById("userPaddle").style.marginLeft = event.clientX - leftMargin - 25;
    document.getElementById("userPaddle").style.marginTop = event.clientY - 25;
}
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start()
{
    if (firstStart == false)
    {
        getDifficulty();
    }
    firstStart = true;
    document.getElementById("container").addEventListener('mousemove', event => obj.updatePaddlePosition(event));
    updatePositions();
    calculateUserPaddleSpeed();
    await sleep(10);
}

function updatePositions()
{
    updateCpuSpeed();
    puckHoriz = .99 * puckHoriz;
    puckVert = .99 * puckVert;

    document.getElementById("cpuPaddle").style.marginLeft = parseInt(window.getComputedStyle(document.getElementById("cpuPaddle")).marginLeft) + cpuHoriz + "px";
    document.getElementById("cpuPaddle").style.marginTop = parseInt(window.getComputedStyle(document.getElementById("cpuPaddle")).marginTop) + cpuVert + "px";
    document.getElementById("puck").style.marginLeft = parseInt(window.getComputedStyle(document.getElementById("puck")).marginLeft) + puckHoriz + "px";
    document.getElementById("puck").style.marginTop = parseInt(window.getComputedStyle(document.getElementById("puck")).marginTop) + puckVert + "px";
    checkIfTouchingWall(document.getElementById("puck"));
    if (wallCollisions[0] || wallCollisions[1])
    {
        puckHoriz = puckHoriz * -1;
    }
    if (wallCollisions[2] || wallCollisions[3])
    {
        puckVert = puckVert * -1;
    }
    for (var i = 0; i < 4; i++)
    {
        wallCollisions[i] = false;
    }
    checkIfTouching(document.getElementById("puck"), document.getElementById("cpuPaddle"));
    if ((blockCollisions[0] || blockCollisions[1]) && (blockCollisions[2] || blockCollisions[3]))
    {
        if (cpuHoriz != 0)
        {
            puckHoriz = (Math.abs(puckHoriz) + Math.abs(cpuHoriz)) * (Math.abs(cpuHoriz) / cpuHoriz);
        }
        else
        {
            puckHoriz = puckHoriz * -1;
        }
        if (cpuVert != 0)
        {
            puckVert = (Math.abs(puckVert) + Math.abs(cpuVert)) * (Math.abs(cpuVert) / cpuVert);
        }
        else
        {
            puckVert = puckVert * -1;
        }
    }
    checkIfTouching(document.getElementById("puck"), document.getElementById("userPaddle"));
    if ((blockCollisions[0] || blockCollisions[1]) && (blockCollisions[2] || blockCollisions[3]))
    {
        if (userSpeed[0] != 0)
        {
            puckHoriz = (Math.abs(puckHoriz) + Math.abs(userSpeed[0])) * (Math.abs(userSpeed[0]) / userSpeed[0]);
        }
        else
        {
            puckHoriz = puckHoriz * -1;
        }
        if (userSpeed[1] != 0)
        {
            puckVert = (Math.abs(puckVert) + Math.abs(userSpeed[1])) * (Math.abs(userSpeed[1]) / userSpeed[1]);
        }
        else
        {
            puckVert = puckVert * -1;
        }
    }


    if (terminate == false)
    {
        requestAnimationFrame(updatePositions);
    }
    else
    {
        document.getElementById("container").removeEventListener('mousemove', event => obj.updatePaddlePosition(event));
    }
}

function checkIfTouching(object1, object2)
{
    x1 = false;
    x2 = false;
    y1 = false;
    y2 = false;
    const obj1 = object1.getBoundingClientRect();
    const obj2 = object2.getBoundingClientRect();
    if (obj1.top < obj2.bottom && ((obj2.bottom - obj1.top) < 51))
    {
        y1 = true;
    }
    else
    {
        if (obj2.top < obj1.bottom && ((obj1.bottom - obj2.top) < 51))
        {
            y2 = true;
        }
    }
    if (obj1.left < obj2.right && ((obj2.right - obj1.left) < 51))
    {
        x1 = true;
    }
    else
    {
        if (obj2.left < obj1.right && ((obj1.right - obj2.left) < 51))
        {
            x2 = true
        }
    }
    blockCollisions[0] = x1;
    blockCollisions[1] = x2;
    blockCollisions[2] = y1;
    blockCollisions[3] = y2;
}

function checkIfTouchingWall(object)
{
    const obj = object.getBoundingClientRect();
    if (obj.top < 5)
    {
        wallCollisions[2] = true;
    }
    if (obj.left < 5 + leftMargin)
    {
        wallCollisions[0] = true;
        checkForGoal();
    }
    if (obj.right > 995 + leftMargin)
    {
        wallCollisions[1] = true;
        checkForGoal();
    }
    if (obj.bottom > 495)
    {
        wallCollisions[3] = true;
    }
}

async function calculateUserPaddleSpeed()
{
    s1x = parseInt(window.getComputedStyle(document.getElementById("userPaddle")).marginLeft);
    s1y = parseInt(window.getComputedStyle(document.getElementById("userPaddle")).marginTop);
    await sleep(50).then(() => {
        s2x = parseInt(window.getComputedStyle(document.getElementById("userPaddle")).marginLeft);
        s2y = parseInt(window.getComputedStyle(document.getElementById("userPaddle")).marginTop);
        userSpeed[0] = ((s2x - s1x) / 5);
        userSpeed[1] = ((s2y - s1y) / 5);
        if (terminate == false)
        {
            calculateUserPaddleSpeed();
        }
        });
}

function checkForGoal()
{
    if (wallCollisions[0] == true && 200 < parseInt(window.getComputedStyle(document.getElementById("puck")).marginTop) && parseInt(window.getComputedStyle(document.getElementById("puck")).marginTop) < 300)
    {
        userGoalCount++;
        goalIsScored("User");
    }
    else
    {
        if (wallCollisions[1] == true && 200 < parseInt(window.getComputedStyle(document.getElementById("puck")).marginTop) && parseInt(window.getComputedStyle(document.getElementById("puck")).marginTop) < 300)
        {
            cpuGoalCount++;
            goalIsScored("Cpu");
        }
    }
}

async function goalIsScored(whoScored)
{
    document.getElementById("messageBox").innerHTML = whoScored + " Scores";
    updateScoreboard();
    terminate = true;

    await sleep(1000);

    document.getElementById("messageBox").innerHTML = "Starting in 3";

    await sleep(1000);

    document.getElementById("messageBox").innerHTML = "Starting in 2";

    await sleep(1000);

    document.getElementById("messageBox").innerHTML = "Starting in 1";

    await sleep(1000);

    document.getElementById("puck").style.marginLeft = "497px";
    document.getElementById("puck").style.marginTop = "247px";
    document.getElementById("cpuPaddle").style.marginLeft = "50px";
    document.getElementById("cpuPaddle").style.marginTop = "200px";

    terminate = false;
    start();

    document.getElementById("messageBox").innerHTML = "";
    puckHoriz = Math.floor(Math.random() * 21) - 10;
    puckVert = 0;
}

function updateScoreboard()
{
    document.getElementById("scoreboard").innerHTML = "User Score: " + userGoalCount + "<br>" + "Cpu Score: " + cpuGoalCount;
}

function updateCpuSpeed()
{
    const cpuPaddleLeft = parseInt(window.getComputedStyle(document.getElementById("cpuPaddle")).marginLeft);
    const cpuPaddleTop = parseInt(window.getComputedStyle(document.getElementById("cpuPaddle")).marginTop);
    const puckLeft = parseInt(window.getComputedStyle(document.getElementById("puck")).marginLeft);
    const puckTop = parseInt(window.getComputedStyle(document.getElementById("puck")).marginTop);

    if (cpuPaddleLeft < puckLeft)
    {
        cpuHoriz = difficulty;
    }
    else
    {
        cpuHoriz = -difficulty;
    }
    if (cpuPaddleTop < puckTop)
    {
        cpuVert = difficulty;
    }
    else
    {
        cpuVert = -difficulty;
    }
}

loadGoal();