let ws;
//setup context stuff | js v: 0
let tag = 'raw_adc';
let mem = []; 
let memhl =[];
let count = 0;
let b = 0;
let logging = false;
let wpg_url = is_dev ?
  "./hate.html"
  : "https://raw.githubusercontent.com/hxdvka/dump/refs/heads/main/hate.html" ;
let plt_layout = {
  datarevision : 1,
  margin: { t: 0 },
  yaxis: {
  range : [0,4095]}
};





async function setup_logger(){
  loadWebSocket();
  await v3();
  setup_obs();
  plt_draw();
  setInterval(plt_update,500);
}


function setup_obs(){
  const trgt_tag = document.getElementById("tag0");
  const cb_tag = (m)=> {tag = trgt_tag.value;console.log("tag upd");}
  trgt_tag.oninput = cb_tag;

  }    

async function v3(){
  jen = document.createElement("body");
  jen.style = "background-color: Canvas; color: CanvasText; color-scheme: light dark;";
  let wpg = await fetch(wpg_url);
  let wtx = await wpg.text();
  jen.innerHTML = wtx;
  document.getElementById("gin").replaceWith(jen);
  document.getElementById("vcont").innerText+=ver;

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
  //console.log("drawww");
  plot_win = document.getElementById("mit_flow");
  Plotly.newPlot (plot_win ,  [{
    x: mem.map((dp) => dp[0]),
    y: mem.map((dp) => dp[1]) }], 
    {template : template} );
    }
    
    // datarevision
    
function plt_update_t(){
      //act_tag = document.getElementById("tag0").value;
      mem.push([Math.random()*100, (Math.random()*10000) %4095,tag]);
      console.log(b, tag);
      console.log(mem);
}

function plt_update(){
  //console.log("pltupd");
  plot_win = document.getElementById("mit_flow");
  plt_layout.datarevision = !plt_layout.datarevision
  Plotly.react(plot_win ,  [{
  x: mem.map((dp) => dp[0]),
  y: mem.map((dp) => dp[1]) }], 
  {template : template});
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
  rst_cnt();

}

function into_bloburl(data){
  bl = new Blob([data],{type: "text/csv",endings:"native"});
  url = URL.createObjectURL(bl);
  return url;
}

function into_csv(d_in){
  //return d_in.map((memi)=>memi.join('\\n')).join('\\n');
  return d_in.map((memi)=>memi.join("\n")).join("\n");
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
  rst_cnt();

}


const template = {
  data: {
    barpolar: [
      {
        marker: {
          line: {
            color: "rgb(17,17,17)",
            width: 0.5,
          },
          pattern: {
            fillmode: "overlay",
            size: 10,
            solidity: 0.2,
          },
        },
        type: "barpolar",
      },
    ],
    bar: [
      {
        error_x: {
          color: "#f2f5fa",
        },
        error_y: {
          color: "#f2f5fa",
        },
        marker: {
          line: {
            color: "rgb(17,17,17)",
            width: 0.5,
          },
          pattern: {
            fillmode: "overlay",
            size: 10,
            solidity: 0.2,
          },
        },
        type: "bar",
      },
    ],
    carpet: [
      {
        aaxis: {
          endlinecolor: "#A2B1C6",
          gridcolor: "#506784",
          linecolor: "#506784",
          minorgridcolor: "#506784",
          startlinecolor: "#A2B1C6",
        },
        baxis: {
          endlinecolor: "#A2B1C6",
          gridcolor: "#506784",
          linecolor: "#506784",
          minorgridcolor: "#506784",
          startlinecolor: "#A2B1C6",
        },
        type: "carpet",
      },
    ],
    choropleth: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        type: "choropleth",
      },
    ],
    contourcarpet: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        type: "contourcarpet",
      },
    ],
    contour: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        colorscale: [
          [0.0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1.0, "#f0f921"],
        ],
        type: "contour",
      },
    ],
    heatmapgl: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        colorscale: [
          [0.0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1.0, "#f0f921"],
        ],
        type: "heatmapgl",
      },
    ],
    heatmap: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        colorscale: [
          [0.0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1.0, "#f0f921"],
        ],
        type: "heatmap",
      },
    ],
    histogram2dcontour: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        colorscale: [
          [0.0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1.0, "#f0f921"],
        ],
        type: "histogram2dcontour",
      },
    ],
    histogram2d: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        colorscale: [
          [0.0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1.0, "#f0f921"],
        ],
        type: "histogram2d",
      },
    ],
    histogram: [
      {
        marker: {
          pattern: {
            fillmode: "overlay",
            size: 10,
            solidity: 0.2,
          },
        },
        type: "histogram",
      },
    ],
    mesh3d: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        type: "mesh3d",
      },
    ],
    parcoords: [
      {
        line: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "parcoords",
      },
    ],
    pie: [
      {
        automargin: true,
        type: "pie",
      },
    ],
    scatter3d: [
      {
        line: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scatter3d",
      },
    ],
    scattercarpet: [
      {
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scattercarpet",
      },
    ],
    scattergeo: [
      {
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scattergeo",
      },
    ],
    scattergl: [
      {
        marker: {
          line: {
            color: "#283442",
          },
        },
        type: "scattergl",
      },
    ],
    scattermapbox: [
      {
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scattermapbox",
      },
    ],
    scatterpolargl: [
      {
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scatterpolargl",
      },
    ],
    scatterpolar: [
      {
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scatterpolar",
      },
    ],
    scatter: [
      {
        marker: {
          line: {
            color: "#283442",
          },
        },
        type: "scatter",
      },
    ],
    scatterternary: [
      {
        marker: {
          colorbar: {
            outlinewidth: 0,
            ticks: "",
          },
        },
        type: "scatterternary",
      },
    ],
    surface: [
      {
        colorbar: {
          outlinewidth: 0,
          ticks: "",
        },
        colorscale: [
          [0.0, "#0d0887"],
          [0.1111111111111111, "#46039f"],
          [0.2222222222222222, "#7201a8"],
          [0.3333333333333333, "#9c179e"],
          [0.4444444444444444, "#bd3786"],
          [0.5555555555555556, "#d8576b"],
          [0.6666666666666666, "#ed7953"],
          [0.7777777777777778, "#fb9f3a"],
          [0.8888888888888888, "#fdca26"],
          [1.0, "#f0f921"],
        ],
        type: "surface",
      },
    ],
    table: [
      {
        cells: {
          fill: {
            color: "#506784",
          },
          line: {
            color: "rgb(17,17,17)",
          },
        },
        header: {
          fill: {
            color: "#2a3f5f",
          },
          line: {
            color: "rgb(17,17,17)",
          },
        },
        type: "table",
      },
    ],
  },
  layout: {
    annotationdefaults: {
      arrowcolor: "#f2f5fa",
      arrowhead: 0,
      arrowwidth: 1,
    },
    autotypenumbers: "strict",
    coloraxis: {
      colorbar: {
        outlinewidth: 0,
        ticks: "",
      },
    },
    colorscale: {
      diverging: [
        [0, "#8e0152"],
        [0.1, "#c51b7d"],
        [0.2, "#de77ae"],
        [0.3, "#f1b6da"],
        [0.4, "#fde0ef"],
        [0.5, "#f7f7f7"],
        [0.6, "#e6f5d0"],
        [0.7, "#b8e186"],
        [0.8, "#7fbc41"],
        [0.9, "#4d9221"],
        [1, "#276419"],
      ],
      sequential: [
        [0.0, "#0d0887"],
        [0.1111111111111111, "#46039f"],
        [0.2222222222222222, "#7201a8"],
        [0.3333333333333333, "#9c179e"],
        [0.4444444444444444, "#bd3786"],
        [0.5555555555555556, "#d8576b"],
        [0.6666666666666666, "#ed7953"],
        [0.7777777777777778, "#fb9f3a"],
        [0.8888888888888888, "#fdca26"],
        [1.0, "#f0f921"],
      ],
      sequentialminus: [
        [0.0, "#0d0887"],
        [0.1111111111111111, "#46039f"],
        [0.2222222222222222, "#7201a8"],
        [0.3333333333333333, "#9c179e"],
        [0.4444444444444444, "#bd3786"],
        [0.5555555555555556, "#d8576b"],
        [0.6666666666666666, "#ed7953"],
        [0.7777777777777778, "#fb9f3a"],
        [0.8888888888888888, "#fdca26"],
        [1.0, "#f0f921"],
      ],
    },
    colorway: [
      "#636efa",
      "#EF553B",
      "#00cc96",
      "#ab63fa",
      "#FFA15A",
      "#19d3f3",
      "#FF6692",
      "#B6E880",
      "#FF97FF",
      "#FECB52",
    ],
    font: {
      color: "#f2f5fa",
    },
    geo: {
      bgcolor: "rgb(17,17,17)",
      lakecolor: "rgb(17,17,17)",
      landcolor: "rgb(17,17,17)",
      showlakes: true,
      showland: true,
      subunitcolor: "#506784",
    },
    hoverlabel: {
      align: "left",
    },
    hovermode: "closest",
    mapbox: {
      style: "dark",
    },
    paper_bgcolor: "rgb(17,17,17)",
    plot_bgcolor: "rgb(17,17,17)",
    polar: {
      angularaxis: {
        gridcolor: "#506784",
        linecolor: "#506784",
        ticks: "",
      },
      bgcolor: "rgb(17,17,17)",
      radialaxis: {
        gridcolor: "#506784",
        linecolor: "#506784",
        ticks: "",
      },
    },
    scene: {
      xaxis: {
        backgroundcolor: "rgb(17,17,17)",
        gridcolor: "#506784",
        gridwidth: 2,
        linecolor: "#506784",
        showbackground: true,
        ticks: "",
        zerolinecolor: "#C8D4E3",
      },
      yaxis: {
        backgroundcolor: "rgb(17,17,17)",
        gridcolor: "#506784",
        gridwidth: 2,
        linecolor: "#506784",
        showbackground: true,
        ticks: "",
        zerolinecolor: "#C8D4E3",
        

      },
      zaxis: {
        backgroundcolor: "rgb(17,17,17)",
        gridcolor: "#506784",
        gridwidth: 2,
        linecolor: "#506784",
        showbackground: true,
        ticks: "",
        zerolinecolor: "#C8D4E3",
      },
    },
    shapedefaults: {
      line: {
        color: "#f2f5fa",
      },
    },
    sliderdefaults: {
      bgcolor: "#C8D4E3",
      bordercolor: "rgb(17,17,17)",
      borderwidth: 1,
      tickwidth: 0,
    },
    ternary: {
      aaxis: {
        gridcolor: "#506784",
        linecolor: "#506784",
        ticks: "",
      },
      baxis: {
        gridcolor: "#506784",
        linecolor: "#506784",
        ticks: "",
      },
      bgcolor: "rgb(17,17,17)",
      caxis: {
        gridcolor: "#506784",
        linecolor: "#506784",
        ticks: "",
      },
    },
    title: {
      text : "ADC read vs Count",
      x: 0.05,
    },
    updatemenudefaults: {
      bgcolor: "#506784",
      borderwidth: 0,
    },
    xaxis: {
      automargin: true,
      gridcolor: "#283442",
      linecolor: "#506784",
      ticks: "",
      title: {
        standoff: 15,
      },
      zerolinecolor: "#283442",
      zerolinewidth: 2,
    },
    yaxis: {
      automargin: true,
      range : [0,4095],
      gridcolor: "#283442",
      linecolor: "#506784",
      ticks: "",
      title: {
        standoff: 15,
      },
      zerolinecolor: "#283442",
      zerolinewidth: 2,
    },
  },
  
}