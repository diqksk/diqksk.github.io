const $userNum = document.getElementById("userNumInput");
const $submitBtn = document.getElementById("submitBtn");
const $generateBtn = document.getElementById("generateBtn");
const $modalContainer = document.getElementById("modalContainer");
const $soloBtn = document.getElementById("soloBtn");
const $comBtn = document.getElementById("comBtn");
const $match = document.querySelectorAll(".match");
const realArr=[]; //유저가 맞춰야 할 숫자
let userRealArr=[]; //컴퓨터가 맞춰야 할 숫자
const userNumList=[];
const tenNums=[...Array(10).keys()];
const allList=[];
let copyList;
let count;
let flag = false;

for(let i1 in tenNums) // 완전 탐색을 통한 경우의 수 도출
    if(i1 != 0)
        for(let i2 in tenNums){
            if (i2 != i1)
                for(i3 in tenNums)
                    if(i3 != i1 && i3 != i2){
                        allList.push([+i1,+i2,+i3]);
                    }
    }     

/**
 * 혼자하기 버튼
 */
$soloBtn.addEventListener("click",()=>{ 
    flag = false;
    for(let i = 0 ; i < $match.length ; i++) {
        $match[i].style.display="none";
    }

    document.body.style.background="white";
    $soloBtn.style.background="#c3c3c3";
    $comBtn.style.background="#f0f0f0";
});

/**
 * 컴퓨터와 하기 버튼
 */
$comBtn.addEventListener("click",()=>{
    flag = true;
    for(let i = 0 ; i < $match.length ; i++) {
        $match[i].style.display="block";
    }
    document.body.style.background="rgb(246 224 37)";
    document.querySelector(".vs").style.display="flex";
    $comBtn.style.background="#c3c3c3";
    $soloBtn.style.background="#f0f0f0";

});

/**
 * GameStart 버튼
 */
$generateBtn.addEventListener('click',()=>{
    count = 1;
    realArr.length=0;
    userNumList.length=0;

    generateNumber();
    startGame();
});

/**
 * 실시간 유저 인풋 유효성 검사
 */
$userNum.addEventListener("keydown",function(e){
    let key = e.key;
    if(!( key>=0 && key<10 || key.includes("Arrow") ||  key === "Backspace" || key === "Enter" || 
    (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 229) || //for key pad and mobile 
    key.trim().length === 0) //spacebar

    { // 48~57이 ascii 0-9           
        fadeIn("숫자만 적을 수 있습니다.");
    }else if($userNum.value.length===0 && key===48){
        fadeIn("첫번째는 0이 올 수 없습니다.");
    }
    
});

/**
 * 모달 클릭시 fadeOut
 */
$modalContainer.addEventListener("click",()=>{
    fadeOut();
});

/**
 * 모달에서 아무 행동이나 해도 fadeOut
 */
onkeydown = (e) => {
    if(e.target!==$userNum){
        setTimeout(()=>{ //stack에 쌓이는 호출을 흘리기 위한 비동기 처리
            fadeOut() 
        },0); 
    }
}

/**
 * 사용자 입력정보 제출 버튼 클릭시 로직 수행
 */
$submitBtn.addEventListener("click",()=>{
    judgeValues();
});

/**
 * 사용자 입력창에서 엔터시 제출 로직 수행
 */
$userNum.addEventListener("keydown",(e)=>{
    if(e.keyCode === 13){
        judgeValues();
    }
})

/**
 * 중복되지 않는 3자리 난수 생성
 */
const generateNumber = ()=>{
    const temArr = [...Array(10).keys()];

    for(let i = 0 ; i <3 ; i++){
        let ranIdx = Math.floor(Math.random()*temArr.length);

        if(i === 0 && ranIdx === 0) ranIdx++;                

        realArr.push(temArr.splice(ranIdx,1)[0]);
    }// end of for loop
    
    console.log("사용자가 맞춰야 할 정답->",realArr);
}

/**
 * 모달 fade on
 * @param {string} str 
 */
const fadeIn = (str)=>{
    $userNum.blur();
    document.getElementById("warningText").innerText=str;
    $modalContainer.style.visibility="visible";
    $modalContainer.style.opacity="1";
}

/**
 * 모달 fade out
 */
const fadeOut = ()=>{
    $modalContainer.style.visibility="hidden";
    $modalContainer.style.opacity="0";
    $userNum.focus();
}

/**
 * 게임시작시 HTML 게임모드로 변경 및 경우의 수 초기화
 */
const startGame = ()=>{
    
    if(flag){
        copyList=[...allList];
        $userNum.placeholder="컴퓨터가 맞출 번호를 입력!";
    }

    document.getElementById("ranNum").style.display="none";
    document.getElementById("userNum").style.display="block";
    document.getElementById("resultList").innerHTML="";
    document.getElementById("comResultList").innerHTML="";
    document.getElementById("counter").innerText="";
    document.getElementById("ballCounter").innerText="";
    
}

/**
 * 게임 패배 or 승리 시 모달팝업 및 HTML초기화
 * @param {string}} str 
 */
const restartGame = (str)=>{
    copyList = [...allList];
    userRealArr=[];
    fadeIn(str);
    document.getElementById("ranNum").style.display="block";
    document.getElementById("userNum").style.display="none";
}

/**
 * 사용자 입력값을 제출시 판단해 유효성을 검증한다.
 * @param {Array} strArr 
 * @returns boolean
 */
const checkInput = (strArr)=>{
    const numSize = new Set(strArr).size;

    if($userNum.value.length !== 3){
        fadeIn("3자리 숫자를 입력해 주세요.");
        return false;
    }
                   
    if(numSize !== 3){
        fadeIn("중복되지 않는 숫자를 입력해 주세요.");
        return false;
    }

    if(userNumList.includes($userNum.value)){
        fadeIn("이미 입력한 적 있는 숫자입니다.");
        return false;
    }

    if(flag === true && userRealArr.length === 0){

        for(let i = 0; i < $userNum.value.length ; i++){
            userRealArr.push(+$userNum.value[i]);
        }

        $userNum.value="";
        $userNum.placeholder="3자리 숫자를 입력해 주세요";
        return false;    
    }

    userNumList.push($userNum.value);
    return true;
}

/**
 * 사용자의 제출값을 바탕으로 Strike, Ball 유무 검출
 * @returns 올바르지 않은 Input 제출 시 경고 후 함수 종료
 */
const judgeValues = ()=>{
    const tempArr = $userNum.value.split("");
    const userNumArr = tempArr.map(i=>Number(i));
    const inputFlag= checkInput(userNumArr);

    if(!inputFlag){
        return;
    }
    
    const result = calculateResult(userNumArr,"user");

    document.getElementById("ballCounter").innerText=`🔵Strike : ${result.strike} / 🔴Ball : ${result.ball}`
    document.getElementById("counter").innerText=`${count}회차`
    document.getElementById("resultList").innerHTML=
               `<tr ${result.strike===3 && "style='background:#ffeb3b'"}>
                    <td>${count}</td>
                    <td>${$userNum.value}</td>
                    <td>
                        <p>🔵Strike : ${result.strike}</p>
                        <p>🔴Ball : ${result.ball}</p>
                    </td>
                </tr>` 
                + document.getElementById("resultList").innerHTML;
    
    count++

    if(result.strike === 3){
        restartGame('게임에서 승리하셨습니다!🎉');
    }
    else if(count>9 && !flag){
        restartGame(`패배하셨습니다.. 정답은 ${realArr.join("")}입니다.`);
    }
    
    $userNum.value="";
    
    if(flag)
    setTimeout(judgeUserNumber,1000); //컴퓨터가 고민해보이기 위해서 넣은 Delay

}

/**
 * strike / ball 여부를 판단해 result 객체를 참조해 연산
 * @param {array} numArr 
 * @param {object} result 
 * @param {string} player 
 */
const calculateResult = (numArr,player) =>{
    const temArr = player === "user" ? realArr : userRealArr ;
    const result = {strike:0, ball:0};

    if(player==="computer"){
        console.log("컴퓨터 맞춰야할 숫자",temArr);
        console.log("가져온 숫자",numArr);
    }

    for(let i = 0 ; i<numArr.length ; i++){     

        for(let j = 0 ; j < temArr.length ; j++){
            
            if(numArr[i] === temArr[j])  i === j ? result.strike++ : result.ball++;
        }// end of for loop
    }// end of for loop
    return result;
}

/**
 * Computer 번호 추측 로직
 * 
 * 1. 0~9로 만들수 있는 3자리의 모든 경우의 수를 도출한다. (완전탐색)
 * 2. 경우의 수 중 랜덤으로 값을 답변한다.
 * 3. 계산된 Ball/Strike Count를 토대로 같은 Count가 아닌 경우의 수를 모두 제외한다.
 * 4. 2 ~ 3을 정답을 맞출때 까지 반복
 * 5. 정답을 맞추면 게임을 종료한다.
 * 
 */
const judgeUserNumber = () => {

    const randomChoice = copyList[Math.ceil(Math.random()*copyList.length)-1]; // 모든 경우의 수 배열
    
    const result = calculateResult(randomChoice,"computer"); // strike ball여부 체크
    
    if(result.strike===3){
        restartGame(`컴퓨터가 정답을 맞췄습니다! \n 당신의 정답은 ${realArr.join("")}입니다.`);
    }

    for(let a = 0 ; a < copyList.length ; a++){
        let strNum=0;
        let ballNum=0;
        let numFlag=false

        NumberCount :
        for (let b = 0 ; b < 3 ; b++){
            for(let c = 0 ; c < 3 ; c++){

                //컴퓨터가 말한 숫자의 c번째가 이번 경우의수와 자릿수와 값이 일치하면 스트라이크++ / 자릿수가 다르면 볼++
                if (randomChoice[c] === copyList[a][b] && b === c) strNum++; 
                if (randomChoice[c] === copyList[a][b] && b !== c) ballNum++;
                
                // 스트라이크 볼카운트가 0 - 0 이었을때 해당하는 숫자가 들어간 경우의수를 모두 제거
                if(result.strike === 0 && result.ball === 0 && randomChoice[c] === copyList[a][b]) {
                    numFlag= true;
                    break NumberCount;
                }
            }
        }
        // 컴퓨터가 말한수와 이번에 가져온 경우의수의 Strike / ball 수가 일치하지 않는다면 경우의수 배열에서 제거
        if (strNum !== result.strike || ballNum !== result.ball || numFlag === true) {
            copyList.splice(a,1);
            a--;
        }

    }
    console.log("남은 경우의 수의 갯수:" + copyList.length);

    document.getElementById("comResultList").innerHTML=
    `<tr ${result.strike===3 && "style='background:#ffeb3b'"}>
         <td>${count-1}</td>
         <td>${randomChoice.join("")}</td>
         <td>
             <p>🔵Strike : ${result.strike}</p>
             <p>🔴Ball : ${result.ball}</p>
         </td>
     </tr>` 
     + document.getElementById("comResultList").innerHTML;
}


