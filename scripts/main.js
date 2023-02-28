//Draw Chessboard Tiles
for(let i = 0; i < 64; i++){
    let div = document.createElement("div");
    

    if(i % 16 < 8){
        if(i % 2 == 0){
            div.style.backgroundColor = "rgb(235,235,211)";
        }else{
            div.style.backgroundColor = "rgb(116,148,84)";
        }
    }else{
        if(i % 2 != 0){
            div.style.backgroundColor = "rgb(235,235,211)";
        }else{
            div.style.backgroundColor = "rgb(116,148,84)";
        }
    }

    document.getElementById("chessboard").appendChild(div);
}