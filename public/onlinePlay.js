document.getElementById("random").addEventListener("click", startRandom);



function startRandom(){
  document.getElementById("random").removeEventListener("click", startRandom);
  fetch("/queingrandom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
    },
  })
  .then(response => response.json() )
  .then((data) => {
    if(data == "error"){
      console.log("error");
      location.href = 'http://213.229.25.14:3000/login';
    }else if(data == "ok"){
      location.href = "/playOnline"
      showNotification("Success", "You are now in the queue");
      
    }else{
      console.log(data)
    }
  }) 
  .catch(err => console.log(err));   
}


 