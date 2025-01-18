const container = document.querySelector('.container');
const gamefield = document.querySelector('.gamefield');
const gameover =document.getElementById('game-over');
const message=document.getElementById('help');

//segítségek és üzenetek szövegének eltárolása változókba
const starthelp=`Click 'play' to start a New Game`;
const playhelp=`Click any Field`;
const miss =`Miss!`;
const hit =`Hit!`;
const destroyed=`Ship destroyed!`;





//---PÁLYA MEGRAJZOLÁSA (csak az első játék előtt van rá szükség)

//sorok és oszlopok száma(később könnyű lesz módosítani)
const rows=10;//sor
const columns =10;//oszlop


//Egy bool-okból álló mátrix,ami tárolja, hogy az adott mezőt érte-e találat
let hitmatrix=[]; 
for(let i=0;i<columns;i++){
    hitmatrix[i]=[];
    for(let j=0;j<rows;j++){
        hitmatrix[i][j]=false;
    }
}

//CSS grid feltöltése gombokkal
for(let i =0; i<(rows*columns);i++){
    let newbtn = document.createElement('button');
    newbtn.classList.add('gamebutton','btnstyle');
    //newbtn.setAttribute('id', i)
    newbtn.value =0;
    gamefield.appendChild(newbtn);
}



//Mátrix a játék logikájához
let matrix =[];

for(let i =0;i<rows;i++){
    matrix[i] =[];
    for(let j=0;j<columns;j++){
        matrix[i][j] =gamefield.children[i*columns+j];
        //console.log(typeof(matrix[i][j])); //ell
        //matrix[i][j].innerText = matrix[i][j].value; //ell, fejlesztés

        matrix[i][j].setAttribute('id',i*columns+j);
        //console.log(matrix[i][j].id)
    }
}
//console.log(typeof(matrix[0][0].value)) //ell






//-------------------------------------------------------------------------//






let to; //a késleltetéshez van rá szükség


function disable(){
    for(let i=0;i<columns;i++){
        for(let j=0;j<rows;j++){
            matrix[i][j].removeEventListener('click', shoot);
            matrix[i][j].classList.remove('btneffect');
        }
    }
    if(shipsleft>0){
        to =setTimeout(enable, 1300);  
    }  
}
function enable(){
    for(let i=0;i<columns;i++){
        for(let j=0;j<rows;j++){
            if(hitmatrix[i][j]==false){
                matrix[i][j].addEventListener('click', shoot);
                matrix[i][j].classList.add('btneffect');
            } 
        }
    }
    message.innerText=playhelp;
}






//------------------------------------------------------------------------//




const ships =[2,3,3,4,5];
const shipid =[1,2,3,4,5];
const nexttoshipvalue=[-1,-2,-3,-4,-5];

let shipshp=[]; 
let shipsleft;
//--- JÁTÉKTÉR FELÁLLÍTÁSA

const startbtn =document.getElementById('startbtn');
startbtn.addEventListener('click', build);
startbtn.classList.add('startbtn-active');


//-----A HAJÓKAT ELHELYEZŐ FÜGGVÉNY-----


function build(ev){
    startbtn.removeEventListener('click',build);
    startbtn.classList.remove('startbtn-active');
    startbtn.classList.add('startbtn-disabled');
    gameover.style.display='none';
    message.innerText=playhelp;

    
    
    shipsleft =ships.length;
    //hajók életpontjainak beállítása
    for(let i =0;i<ships.length;i++){
        shipshp[i]=ships[i];
    }
    

    let shipalign; //ha 0 akkor fekszik a hajó((balról kezdjük el lerakni)
//, ha 1 akkor függőlegesen van(fekülről kezdjük el lerakni)

    let y,x; //A hajók lerakásának kezdetének koordinátái
    let succesfulshipplacement;
    let freeplaces;

    //startbtn.removeEventListener('click',build);

    //összes mező nullázása, találat esemény minden gombhoz
    for(let i=0;i<columns;i++){
        for(let j=0;j<rows;j++){
            hitmatrix[i][j]=false;
            matrix[i][j].innerText="";//matrix[i][j].value;
            matrix[i][j].value=0;
            matrix[i][j].classList.remove('ship-destroyed','ship-hitted','water');
            matrix[i][j].classList.add('gamebutton','btneffect');
            matrix[i][j].addEventListener('click',shoot);
        }
    }
    //ev.preventDefault();





    //--- ELLENSÉGES HAJÓK ELHELYEZÉSE(később lesz saját is)

    for(let i=ships.length-1;i>=0;i--){
        shipalign =Math.round(Math.random()*100);
        succesfulshipplacement =false;
        
        if(shipalign%2 ==0){ //álló hajó
            do{
                freeplaces=0;
                do{
                    y =Math.round(Math.random()*(columns-ships[i]));
                    x =Math.round(Math.random()*(rows-1));
                    //console.log(`${i+1}. hajó: x:${x} y:${y}`);//ell
                }while(matrix[y][x].value!=0);
                let j=0;
                do{
                    if(matrix[y+j][x].value ==0){
                        freeplaces++;
                        j++;
                    }
                    else{
                        break;
                    }
                }while(freeplaces<ships[i])
                if(freeplaces >=ships[i]){
                    
                    //console.log(`${i+1}. feltétel`)//ell
                    for(let k=0;k<ships[i];k++){
                        matrix[y+k][x].value =shipid[i];
                        //matrix[y+k][x].innerText=matrix[y+k][x].value;//ez írja ki a mezőkre a hajók helyzetét
                    
                    }
                    succesfulshipplacement=true;
                    //console.log(`${i+1}. hajó lerakva`);//ell
                }
            }while(! succesfulshipplacement);
            
        } else { //fekvő hajó
            do{
                freeplaces=0;
                do{
                    x =Math.round(Math.random()*(columns-ships[i]));
                    y =Math.round(Math.random()*(rows-1));
                    //console.log(`${i+1}. hajó: x:${x} y:${y}`);//ell
                }while(matrix[y][x].value!=0);
                let j=0;
                do{
                    if(matrix[y][x+j].value ==0){
                        freeplaces++;
                        j++;
                    }
                    else{
                        break;
                    }
                }while(freeplaces<ships[i])
                if(freeplaces >=ships[i]){
                    //console.log(`${i+1}. feltétel`)//ell
                    for(let k=0;k<ships[i];k++){
                        matrix[y][x+k].value =shipid[i];
                        //matrix[y][x+k].innerText=matrix[y][x+k].value;//ez írja ki a mezőkre a hajók helyzetét
                    }
                    succesfulshipplacement=true;
                    //console.log(`${i+1}. hajó lerakva`);//ell
                }
            }while(!succesfulshipplacement);
        }
    }
}






//---LÖVÉS---------------------------------------------------//




function shoot(ev){
    setTimeout(clearTimeout(to),1000);
    let y =Math.floor(ev.target.id/10);
    let x=ev.target.id%10;
    //console.log(x,y); //ell
    if(matrix[y][x].value <=0){
        hitmatrix[y][x]=true;
        //matrix[y][x].value =-1;
        matrix[y][x].classList.remove('gamebutton','btneffect');
        matrix[y][x].classList.add('water');
        matrix[y][x].removeEventListener('click', shoot);
        matrix[y][x].innerText= 'X';
        message.innerText=miss;
        disable();
    }else{
        let targetvalue =ev.target.value;//az eredeti érték vmiért egy idő után undefined lesz
        hitmatrix[y][x]=true;
        matrix[y][x].removeEventListener('click',shoot);
        matrix[y][x].classList.remove('gamebutton','btneffect');
        matrix[y][x].classList.add('ship-hitted');
        
        message.innerText=hit;
        disable();

        shipshp[targetvalue-1]--;
        if(shipshp[targetvalue-1] ==0){
            shipsleft--;
            message.innerText=destroyed;
            for(let i =0;i<columns;i++){
                for(let j =0;j<rows;j++){
                    //console.log(shipid); hibajavításhoz
                    //console.log(matrix[i][j], matrix[i][j].value,ev.target.value,shipid[ev.target.value-1]);
                    if(matrix[i][j].value==shipid[targetvalue-1]){
                        
                        matrix[i][j].value=-1;
                        matrix[i][j].classList.remove('ship-hitted');
                        matrix[i][j].classList.add('ship-destroyed');
                    }
                }
            }
            disable();
            gameendcheck();
        }
    }
}



function gameendcheck(){ //játék végének vizsgálata
    if(shipsleft==0){
        clearTimeout(to);
        //console.log("game over");
        startbtn.addEventListener('click',build);
        startbtn.classList.remove('startbtn-disabled');
        startbtn.classList.add('startbtn-active');
        gameover.style.display='block';
        message.innerText=starthelp;
    
        for(let i=0;i<columns;i++){
            for(let j =0;j<rows;j++){
                matrix[i][j].removeEventListener('click', shoot);
                matrix[i][j].classList.remove('btneffect');
            }
        }
    }
}
