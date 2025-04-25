
let ws;
//setup context stuff
let tag = 'raw_adc';
let mem = []; 
let memhl =[];
let count = 0;
let b = 0;
let logging = false;

function yo(){
    
    console.log("fkn tryhard biatch")
  }    
async function v2(){
    console.log("fkn tryhard biatch v2")
    
    let wpg = await fetch("https://raw.githubusercontent.com/hxdvka/dump/refs/heads/main/hate.html");
    // let wpg = await fetch("./hate.html");
    let tx = await wpg.text();
    document.getElementById("gin").innerHTML= tx;
    setInterval(plt_update(),500);
  }

    //plt_draw();

v2();    
yo();



function upd_tag(ntag){
    tag = ntag;

}
function rst_cnt(){
    count=0;
}

// setup websocket stuff

function loadWebSocket() {
    console.log('in');
    ws = new WebSocket(`ws://${window.location.host}/ws`);
    ws.onopen = function(e) {
        //submitButton.disabled = false;
    };
    ws.onclose = ws.onerror = function(e) {
        //submitButton.disabled = true;
    };
    ws.onmessage = function(e) {
        console.log(e.data);
        //serverResp.innerText = e.data;
        if (logging){
        mem.push([count,e.data,tag]);
        count+=1;
        }
    };
}


function plt_draw(){
  console.log("drawww");
  plot_win = document.getElementById("mit_flow");
  Plotly.newPlot (plot_win ,  [{
    x: mem.map((dp) => dp[0]),
    y: mem.map((dp) => dp[1]) }], {
      datarevision : 0,
      margin: { t: 0 } } );
    }
    
    // datarevision
    
function plt_update_t(){
      
      plot_win = document.getElementById("mit_flow");
      let act_tag = document.getElementById("tag0").value;
      mem.push([Math.random()*10, Math.random()*100,act_tag]);
      Plotly.react(plot_win ,  [{
        x: mem.map((dp) => dp[0]),
        y: mem.map((dp) => dp[1]) }], 
        { //datarevision : b,
          margin: { t: 0 } } );
          
          b=  1+b;
          console.log(b);
          console.log(mem);
}

function plt_update(){
          
          plot_win = document.getElementById("mit_flow");
 let act_tag = document.getElementById("tag0").value;
  //mem.push([Math.random()*10, Math.random()*100,act_tag]);
  Plotly.react(plot_win ,  [{
    x: mem.map((dp) => dp[0]),
    y: mem.map((dp) => dp[1]) }], 
    { //datarevision : b,
      margin: { t: 0 } } );
      
}
    
    // data manipulation
function log_toggle(){
      logging = !logging;
      s = Number(document.getElementById("log_timeout").value);
      if (logging && s>0){
        setTimeout(()=>{logging=false},s*1000);
      }
}

    function stash(){
      logging = false;
  memhl.push( mem);
  mem = [];
}

function into_bloburl(data){
  bl = new Blob(data,{type: "text/csv",endings:"native"});
  url = URL.createObjectURL(bl);
  return url;
}

function into_csv(d_in){
  //return d_in.map((memi)=>memi.join('\\n')).join('\\n');
  return d_in.map((memi)=>memi.join("\n"));
}
function export_csv(){
  stash();
  csv = into_csv(memhl);
  url = into_bloburl(csv);
  document.getElementById("url").href = url;
  document.getElementById("url").hidden = false;
  console.log(url);
  
}

function clear_curr(){
  logging = false;
  mem = [];
}

//deprecated > for reference only
function draw_old(){
  let plt_win = document.getElementById('graphhh');
  new Chart(plt_win, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

loadWebSocket()
//window.onload(setInterval(plt_update(),500));