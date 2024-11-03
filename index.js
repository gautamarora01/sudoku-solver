document.addEventListener('DOMContentLoaded',function (){
    const gridSize=9;
    const solveButton= document.getElementById("solve-btn");
    solveButton.addEventListener('click',solveSudoku);

    const sudokuGrid=document.getElementById("sudoku-grid");
    //create the sudoku grid and input cells

    for(let row=0;row<gridSize;row++){
        const newRow=document.createElement("tr");
        for(let col=0;col<gridSize;col++){
            const cell=document.createElement("td");
            const input=document.createElement("input");
            input.type="number";
            input.className="cell";
            input.id=`cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solveSudoku() {
    const gridSize=9;
    const sudokuArray=[];

    // fill the sudokuArray with input values from the grid
    
    for(let row=0;row<gridSize;row++){
        sudokuArray[row]=[];
        for(let col=0;col<gridSize;col++){
            const cellId= `cell-${row}-${col}`;
            const cellValue=document.getElementById(cellId).value;
            sudokuArray[row][col]=cellValue!==""?parseInt(cellValue):0;
        }
    }

    // check for validity of input

    if(!isValidInput(sudokuArray)){
        alert("Invalid Input.");
        return;
    }

    // identify user-input cells and mark them

    for(let row=0;row<gridSize;row++){
        for(let col=0;col<gridSize;col++){
            const cellId=`cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if(sudokuArray[row][col]!==0){
                cell.classList.add("user-input");
            }
        }
    }

    // solve the sudoku and display the result

    if (!solveSudokuHelper(sudokuArray)) {
        alert("No Solution exists for the given Sudoku Puzzle.");
        return; // exit the function if there's no solution
    }

    for(let row=0;row<gridSize;row++){
        for(let col=0;col<gridSize;col++){
            const cellId=`cell-${row}-${col}`;
            const cell = document.getElementById(cellId); 
        
            // fill in solved values and apply animation

            if(!cell.classList.contains("user-input")){
                cell.value=sudokuArray[row][col];
                cell.classList.add("solved");
                await sleep(20);
                //adding a delay for visualization
            }
        }
    }
}


function isValidInput(board){
    const gridSize=9;

    for(let i=0;i<gridSize;i++){
        const rowCheck= new Set();
        const colCheck= new Set();

        for(let j=0;j<gridSize;j++){
            if(board[i][j]>9 || board[i][j]<0) return false;

            if(board[i][j]!==0){
                if(rowCheck.has(board[i][j])) return false;
                rowCheck.add(board[i][j]);
            }

            if(board[j][i]!==0){
                if(colCheck.has(board[j][i])) return false;
                colCheck.add(board[j][i]);
            }
        }
    }

    for(let row=0;row<gridSize;row+=3){
        for(let col=0;col<gridSize;col+=3){
            const gridCheck=new Set();
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    const value=board[row+i][col+j];
                    if(value!=0){
                        if(gridCheck.has(value)) return false;
                        gridCheck.add(value);
                    }
                }
            }
        }
    }
    

    return true;
}

function solveSudokuHelper(board){
    const gridSize=9;

    for(let row=0;row<gridSize;row++){
        for(let col=0;col<gridSize;col++){
            if(board[row][col]===0){
                for(let num=1;num<=9;num++){
                    if(isValidMove(board,row,col,num)){

                        board[row][col]=num;
                        //recursively attempt to solve the sudoku
                        if(solveSudokuHelper(board)==true) return true;
                        
                        board[row][col]=0;
                        //backtracking
                    }
                }
                return false;
                //all numbers have been exhausted without a solution
                //if a solution is found we would never reach here since all cells would be filled
            }
        }
    }

    return true;
    //all cells filled
}

function isValidMove(board,row,col,num){
    //checking for valid moves in row, column and 3*3 subgrid for that cell
    const gridSize=9;

    for(let i=0;i<gridSize;i++){
        if(board[i][col]===num) return false;
        if(board[row][i]===num) return false;
    }

    const subgridStartRow=3*Math.floor(row/3);
    const subgridStartCol=3*Math.floor(col/3);

    for(let i=subgridStartRow;i<subgridStartRow+3;i++){
        for(let j=subgridStartCol;j<subgridStartCol+3;j++){
            if(board[i][j]===num) return false;
        }
    }

    return true; //No conflicts found
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

