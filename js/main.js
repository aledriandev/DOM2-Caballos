var tablero = document.getElementById('tablero');
var pasos = document.getElementById('pasos');

function printMatrix (M){
  console.log ("___________________");
  for (var i = 0; i < M.length; i++)
    console.log (M[i]);   
  console.log ("___________________");
}
function check (i, j, n) {
  if (  i >= 0 && j >= 0 && i < n && j < n)
    return true;
  return false;   
}
function randInt (n) {
  return Math.floor(Math.random () * n);
}


function gen_heuristic (n){  
  var M = initMatrix (n);
  var p = 1;
  while (p <= n / 2 + 1 ) {
    for (var i = p-1; i <= n - p; i++){
      M[p - 1][i] = p;
      M[i][p - 1] = p;
      M[i][n - p] = p;
      M[n - p][i] = p;
    }
    p++;    
  }
  M[0][0] = 0;
  M[0][n - 1] = 0;
  M[n - 1][0] = 0;
  M[n - 1][n - 1] = 0;
  return M;
}


function shuffleArray(d) {
  for (var c = d.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d
};

function use_helper (soluciones, helper) {
  var pos = -1;
  var min = 10000;
  soluciones = shuffleArray (soluciones);
  for (var i = 0; i < soluciones.length; i++) {
    var x = soluciones[i].x;
    var y = soluciones[i].y;      
    if ( helper[x][y] < min) {
      min = helper[x][y] ;
      pos = i;
    }
  }
  return pos;
}

function gen_solution (M, helper, n) {
  var mov_x = [-2, -1, +1, +2, +2, +1, -1, -2];
  var mov_y = [-1, -2, -2, -1, +1, +2, +2, +1];    
  var step = 1;
  var x = 0; var y = 0;
    
  M[x][y] = step;
  while ( true ) {
    if ( step == n * n) {
      console.log ('eureka!!!');
      return true;
    }
    var soluciones = [];
    for (var index = 0; index < mov_x.length; index++) {
      var i = x + mov_x[index];
      var j = y + mov_y[index];   
      if (check (i, j, n) && M [i][j] == 0) {
        soluciones.push ( {x:i, y:j});
      }
    }
    if (soluciones.length == 0) {
      console.log ("fail!!");
      break;
    }
    var idx = use_helper (soluciones, helper) ;
    x =  soluciones[ idx ].x;
    y =  soluciones[ idx ].y;
    step++;
    M[x][y] = step;  
  }
  return false;
} 

//matriz inicial llena de ceros
function initMatrix (n) {
  var matrix = [];
  for (var i = 0; i < n; i++) {
    var fila = [];
    for (var j = 0; j < n; j++) {
      fila[j] = 0;
    }
    matrix[i] = fila;
  }
  return matrix;
}

//genera la tabla
function generar() {
  tablero.innerHTML = '';
  var n = parseInt(document.getElementById('lados').value);
    
  var tabla = document.createElement('table');
  tabla.border = "1";
  for (var i = 0; i < n; i++) {
    var fila = document.createElement('tr');
    for (var j = 0; j < n; j++) {
      var celda = document.createElement('td');
      if (i % 2 == 0 && j % 2 != 0 || i % 2 != 0 && j % 2 == 0) {
        celda.setAttribute('class', 'negro');
      }else{
        celda.setAttribute('class','blanco');
      }
            
      fila.appendChild(celda);
    }
    tabla.appendChild(fila);
  }
  tablero.appendChild(tabla);
}

//funcion que devuelve la matriz resultado
function matrizSolucion(){
  //generar();
  var n = parseInt(document.getElementById('lados').value);
  for( var i = 0; i < 1000; i++) {
    var M = initMatrix (n);
    var helper = gen_heuristic (n);
    if (gen_solution (M, helper, n) ) {
      printMatrix (M);
    break;
    }
  }
  return M;
}


//funcion que muestra la respuesta en el taalero
function solucionM(){
  generar();
  var M = matrizSolucion();
  var n = parseInt(document.getElementById('lados').value);
  var celdas = document.getElementsByTagName('td');
  var ind=0;
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      var celda=celdas[ind];   
      var p = document.createElement('p');
      p.innerHTML = "♘"+M[i][j];
      celda.appendChild(p);
      ind++;
    }
  }
}

function sigSolucion(){
  click=0;
  generar();
  var M = matrizSolucion();
  var n = parseInt(document.getElementById('lados').value);
  var celdas = document.getElementsByTagName('td');
  var num = 2;
  var linealM = [];
  for (var i = 0; i < n; i++) {
    linealM = linealM.concat(M[i])
  }
  //console.log(linealM)
  for (var i = 0; i < n*n; i++) {  
      celdas[i].textContent = "♘"+ linealM[i];
  }

  var negro = document.getElementsByClassName("negro");
  var blanco = document.getElementsByClassName("blanco");

  for (var i = 0; i < negro.length; i++) {
    negro[i].style.color = "black";
  }
  
  for (var i = 0; i < blanco.length; i++) {
    blanco[i].style.color = "white";
  }
  /*
  $(document).ready(function(){
    $( ".negro" ).css( "color", "black" )
  $( ".blanco" ).css( "color", "white" )
  });
  */
  return true;
}

var click=0;

pasos.onclick = function(){
  click=click+1;
  console.log(click)
  var n = parseInt(document.getElementById('lados').value);
  var celdas = document.getElementsByTagName('td');

  var valCeldas = [];
  for (var i = 0; i < celdas.length; i++) {
    valCeldas.push(celdas[i].textContent.substr(1));
  }
   
  var numero = click.toString();
  var posicion = valCeldas.indexOf(numero);
  //console.log(posicion);
  
  if(celdas[posicion].style.color == "black"){
    celdas[posicion].style.color = "white";
  }else{
    celdas[posicion].style.color = "black";
  }
  
  if(click==n*n){
    click=0;
  }
}


