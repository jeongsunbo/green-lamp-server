const express = require("express");
// cors 모든 브라우져가 내서버에 요청할 수 있도록
const cors = require("cors");
const app = express();
const port = 3000;

// json형식의 데이터를 처리할 수 있게 설정
app.use(express.json());
// 브라우저 cors이슈를 막기위해 사용(모든 브라우저의 요청을 일정하게 받겠다.)
app.use(cors());
// upload폴더에 있는 파일에 접근할 수 있도록 설정
app.use("/upload", express.static("upload"));

const models = require("./models"); //데이터베이스
// 업로드 이미지를 관리하는 스토리지 서버를 연결 -> 멀터를 사용하겠다
const multer = require("multer");
// 이미지 파일이 요청오면 어디에 저장할건지 지정 upload가 생김
const upload = multer({ 
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            // 어디에 저장할것인가? upload/
            cb(null, 'upload/')
        },
        filename: function(req, file, cb){
            // 어떤 이름으로 저장할건가?
            // file 객체의 오리지널 이름으로 저장하겠다
            cb(null, file.originalname)
        }
    })
})  
// 요청처리
// app.메서드(경로,함수(응답))
// 이미지파일을 post로 요청이 왔을때 upload라는 폴더에 이미지를 저장하기
// 이미지가 하나일때 single
app.post('/image', upload.single('image'), (req, res)=>{
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl: "http://localhost:3000/" +file.destination+file.filename
    })
})


// 요청처리
// app.메서드(경로,함수(응답))
// 경로 /products임
app.get('/products',async (req,res)=>{
    // 데이터베이스 조회하기
    models.Product.findAll()
    .then(result=>{
        console.log("제품전체조회", result);
        res.send({  //서버가 전달 웹브라우져는 send로 받음
            product: result  //data를 객체로 받아옴
        })
        // res.send(result);
    })
    .catch((e)=>{
        console.error(e);
        res.send('파일 조회에 문제가 있습니다.');
    })
})
// method get요청이 오고 url은 /product/2로 요청이 온 경우
app.get('/product/:id', async (req, res)=> {
    const params = req.params;
    // const { id } = params;
    // 하나만 조회할때는 findOne -> select문
    models.Product.findOne({
        // 조건절
        where: {
            id:params.id
        }
    })
    .then(result=>{
        res.send(result);
    })
    .catch((e)=>{
        console.log(e);
        res.send("상품조회에 문제가 생겼습니다.");
    })
});

app.post('/products',(req, res)=>{
    // http body에 있는 데이터
    const body = req.body;
    // body객체에 있는 값을 각각 변수에 할당
    const { name, price, seller, imageUrl } = body;
    if(!name || !price || !seller) {
        res.send("모든 필드를 입력해주세요");
    }
    // Product테이블에 레코드를 삽입
    models.Product.create({
        name,
        price,
        seller,
        imageUrl
    }).then(result=>{
        console.log("상품 생성결과 : ", result);
        res.send({
            result
        })
    })
    .catch(e=>{
        console.error(e);
        res.send("상품업로드에 문제가 생겼습니다.");
    })
})

// 실행, sequelize와 데이터베이스
app.listen(port, ()=>{
    console.log('쇼핑몰 서버가 동작중입니다.');
    // sequelize와 데이터베이스 연결작업node 
    // 데이터베이스 동기화
    models.sequelize
    .sync()
    .then(()=>{
        console.log("db연결 성공");
    })
    .catch((e)=>{
        console.error(e);
        console.log("db연결 에러");
        // 서버실행이 안되면 프로세서 종료
        process.exit();
    })
})
