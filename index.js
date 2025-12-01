let jumping=false;
let froze=false;
let store=[];
let score=0;
let lock=false;

let jump=new Audio("jump.mp3")
jump.preload="auto";
jump.volume=0.1;

let scoreup=new Audio("scoreup.mp3")
scoreup.preload="auto";
scoreup.volume=0.5;

let lose=new Audio("death.mp3")
lose.preload="auto";
lose.volume=0.5;

let click=new Audio("button.mp3")
click.preload="auto";
click.volume=0.5;

function button_click(){
    click.currentTime=0;
    click.play();
}

function lost(){
    lose.currentTime=0;
    lose.play();
}

function playjumpsound(){
    jump.currentTime=0;
    jump.play();
}
function playscoresound(){
    scoreup.currentTime=0;
    scoreup.play();
}

$(document).ready(function(){
    /*movement*/
    $(document).on("keyup",function(e){
        let key=e.key;
        if((key=="w"&&!jumping&&!froze)||(key==" "&&!jumping&&!froze)){
            jumping=true;
            let land=$("#rabbit").position().top;
            $("#rabbit").css({
                "top": land-150+"px"
            });
            playjumpsound();
            setTimeout(function(){
                $("#rabbit").css({
                    "top":land+"px"
                })
                setTimeout(function(){
                    jumping=false;  
                },365)
            },395);
        }

    })

    /*rabbit animation*/
    let toggle=false;
    setInterval(function(){
        if(toggle&&!froze){
            $("#rabbit").attr("src","rabbit1.png")
        }
        else if(!froze){
            $("#rabbit").attr("src","rabbit.png")
        }
        toggle=!toggle;
        
    },700)


    /*spawn obstacle randomly*/
    let duration=Math.random()*3000+(2000-score*1.2);
    let speed=7000
    setInterval(function(){
        if(froze==false){
            const carrot=$("<img src='carrot.png' class='carrot' />");
            store.push(carrot[0]);
            carrot.css({
                'position':'absolute',
                'left':'1300px',
                "top":"475px",
                'height':230+'px',
                'image-rendering':'pixelated',
            })
            $('body').append(carrot);
            carrot.animate({
                'left':'-=1500px'
            },speed-(score*1.3),function(){
                carrot.remove();
                lock=false;
                })

        }
    },duration)

    /*map running*/
    function animate_map(){
        if(!froze){
            $(".container").css({
                'background-position-x':'-='+(2+score*0.1)+'px',
                'width':'auto'
            })
            $("body").css({
                'background-position-x':'-='+(2+score*0.1)+'px',
                'width':'auto'
            })
        }
        requestAnimationFrame(animate_map);
    }
    requestAnimationFrame(animate_map);



    /*check collision*/
    let character=$("#rabbit")[0].getBoundingClientRect();
    let obstacle=0
    let gap=parseInt(obstacle.right)-454;
    setInterval(function(){
        character=$("#rabbit")[0].getBoundingClientRect();
        for(element in store){
            let obstacle=$(".carrot")[0].getBoundingClientRect();
            if(!froze&&character.top>=obstacle.top&&character.left>=obstacle.left-40&&character.right<=obstacle.right+40){
                console.log(1);
                froze=true;
                obstacle=$(".carrot")[0].getBoundingClientRect();
                $("#end-score").text("Final score: "+score);
                $(".carrot").stop(true,false);
                $(".container").stop(true,false);
                $(".screen").css({
                    "display":"flex"
                })
                lost();
            }
            else if(character.right>obstacle.right&&character.left>obstacle.right-150&&!lock){
                score+=1;
                scoreup.play();
                $("#score").text("Score: "+score)
                lock=true;
            }
        }
    },10)
    $("button").on("click",function(){
        button_click();
        setInterval(function(){
            location.reload();
        },200)
    })
})
