// node는 CommomJs문법을 사용
// import는 require(경로)
const http = require('http');
// 본인컴퓨터의 주소 : 127.0.0.1
const hostname = "127.0.0.1";
const port = 8080;

// 서버만들기 createServer(함수(request,response))
const server = http.createServer(function(request,response){
    // 웹브라우저가 요청한 정보를 request가 받고
    // 응답은 response
    // console.log(request);
    // http://localhost:8080/product/
    // http://localhost:8080는 루트
    // /product/ 는 path
    const path = request.url;
    const method = request.method;
    if(path === "/products") {
        if(method === "GET") {
            // 응답을 보낼떄 타입을 제이슨 객체를 해더에 보낸다
            response.writeHead(200,{"Content-Type": "application/json"})
            // 자바스크립트 배열을 JSON형태로 변경해서 products에 담기
            const products = JSON.stringify([
                {
                    name: "거실조명",
                    price: 50000,
                },
                {
                    name: "어린이조명",
                    price: 50000,
                },
            ])
            response.end(products);
        }
    }
    console.log(path);
    console.log(method);
    response.end("Hello Client");
})

//listen은 대기 호스트네임과 프트번호로 요청을 기다림
server.listen(port, hostname);
console.log("조명쇼핑몰 서버가 돌아가고 있습니다.");

// 주소창에 http://localhost:8080/ Hello Client나옴