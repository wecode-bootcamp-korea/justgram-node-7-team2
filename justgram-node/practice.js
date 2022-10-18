// express 를 사용하기 전 기본 문법 세팅
const express = require("express");
const app = express();

// .listen = 우리 컴퓨터에 서버를 열 수 있음
// 8080 이라는 포트에 서버를 띄워주세요!
app.listen(8080, function () {
    // 8080 포트로 웹서버를 열고 잘 열리면 콘솔을 출력해주세요!
    console.log("listening on 8080");
});

// xx 경로로 들어오면 xx 를 보내줌
// 누군가가 /pet 으로 방문을 하면...
// pet 관련된 안내문을 띄워주자
// app.get ('경로', function(요청, 응답){
//        응답.send('펫 용품을 쇼핑할 수 있는 페이지 입니다.')
//})
app.get("/pet", function (req, res) {
    res.send("펫 용품을 쇼핑할 수 있는 페이지 입니다.");
});

app.get("/beauty", (req, res) => {
    res.send("뷰티 용품을 쇼핑할 수 있는 페이지 입니다.");
});

// '/' 슬래시 하나는 Home 이라는 뜻
app.get("/", (req, res) => {
    // .sendFile(보낼파일경로)
    res.sendFile(__dirname + "/index.html");
});
