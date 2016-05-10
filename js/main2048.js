var board = new Array();
var score = 0;
var newNumberCount=0;
$(document).ready(function() {
    prepareForMobile();
	newgame();
});

function prepareForMobile(){

    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame() {
	//初始化
	init();
	//在随机两个格子生成数字
    for(var i=0;i<2;i++){
    	if(newNumberCount<2){
            generateOneNumber();
            newNumberCount++;
        }
    }
}

function init() {
  newNumberCount=0;
  score=0;
  $("#score").text(score);
  for (var i = 0; i <4; i++) {
    for (var j = 0; j <4; j++) {
      var gridcell=$("#grid-cell-"+i+"-"+j);
      gridcell.css('top', getPosTop(i,j));
      gridcell.css('left', getPosLeft(i,j));
    };
  };
  for (var i = 0; i < 4; i++) {
  	board[i]=new Array();
  	for (var j = 0; j < 4; j++) {
  		board[i][j]=0;
  	};
  };
  updateBoardView();
}

function updateBoardView() {
  $(".number-cell").remove();
  for (var i = 0; i <4; i++) {
    for (var j = 0; j <4; j++) {
    	$("#grid-container").append("<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>");
    	var theNumberCell=$('#number-cell-'+i+'-'+j);
    	if (board[i][j]==0) {
    		theNumberCell.css('width', '0px');
    		theNumberCell.css('height', '0px');
    		theNumberCell.css('top', getPosTop(i,j)+cellSideLength/2);
    		theNumberCell.css('left', getPosLeft(i,j)+cellSideLength/2);
    	} else{
    		theNumberCell.css('width', cellSideLength);
    		theNumberCell.css('height', cellSideLength);
    		theNumberCell.css('top', getPosTop(i,j));
    		theNumberCell.css('left', getPosLeft(i,j));
    		theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
    		theNumberCell.text(board[i][j]);
    	};

	};
  };
}

function generateOneNumber () {
	if(nospace(board)){
		return false;
	}else{
		//random position
		var randx=parseInt(Math.floor(Math.random()*4));
		var randy=parseInt(Math.floor(Math.random()*4));
		for(var times=0;times<50;times++){
			if(board[randx][randy]==0)
				break;
			randx=parseInt(Math.floor(Math.random()*4));
			randy=parseInt(Math.floor(Math.random()*4));
		}
		//random number
		var randNumber=Math.random()<0.5?2:4;
		//show number
		board[randx][randy]=randNumber;
		showNunberWithAnimation(randx,randy,randNumber);
		return true;
	}

}

$(document).keydown(function(event) {
    event=event||window.event;
	switch(event.keyCode){
		case 37://left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			return false;
			break;
		case 38://up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			return false;
			break;
		case 39://right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			return false;
			break;
		case 40://down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			return false;
			break;
		default:
			break;
	}
});

function isgameover () {
	if(nospace(board)&&nomove(board)){
		var msg=confirm("GAME OVER! TRY AGAIN?");
		if(msg){
			newgame();
		}
	}
}

function moveLeft () {
	if(!canMoveLeft(board)){
		return false;
	}
    for (var i = 0; i <4; i++) {
        for (var j = 1; j <4; j++) {
        	if(board[i][j]!=0){
        		for(var k=0;k<j;k++){
        			if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
        				//move
        				showMoveAnimation(i,j,i,k);
        				board[i][k]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)){
        				//move
        				showMoveAnimation(i,j,i,k);
        				board[i][k]*=2;
        				board[i][j]=0;
        				//add
        				score+=board[i][k];
        				$("#score").text(score);
        				continue;
        			}
        		}
        	}
       }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight () {
	if(!canMoveRight(board)){
		return false;
	}
    for (var i = 0; i <4; i++) {
        for (var j = 2; j >=0; j--) {
        	if(board[i][j]!=0){
        		for(var k=3;k>j;k--){
        			if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
        				//move
        				showMoveAnimation(i,j,i,k);
        				board[i][k]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)){
        				//move
        				showMoveAnimation(i,j,i,k);
        				board[i][k]*=2;
        				board[i][j]=0;
        				//add
        				score+=board[i][k];
        				$("#score").text(score);
        				continue;
        			}
        		}
        	}
       }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp () {
	if(!canMoveUp(board)){
		return false;
	}
    for (var j = 0; j <4; j++) {
        for (var i = 1; i <4; i++) {
        	if(board[i][j]!=0){
        		for(var k=0;k<i;k++){
        			if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
        				//move
        				showMoveAnimation(i,j,k,j);
        				board[k][j]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)){
        				//move
        				showMoveAnimation(i,j,k,j);
        				board[k][j]*=2;
        				board[i][j]=0;
        				//add
        				score+=board[k][j];
        				$("#score").text(score);
        				continue;
        			}
        		}
        	}
       }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown () {
	if(!canMoveDown(board)){
		return false;
	}
    for (var j = 0; j <4; j++) {
        for (var i = 2; i >=0; i--) {
        	if(board[i][j]!=0){
        		for(var k=3;k>i;k--){
        			if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
        				//move
        				showMoveAnimation(i,j,k,j);
        				board[k][j]=board[i][j];
        				board[i][j]=0;
        				continue;
        			}else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)){
        				//move
        				showMoveAnimation(i,j,k,j);
        				board[k][j]*=2;
        				board[i][j]=0;
        				//add
        				score+=board[k][j];
        				$("#score").text(score);
        				continue;
        			}
        		}
        	}
       }
    }
    setTimeout("updateBoardView()",200);
    return true;
}



