import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");  
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

let cache = {
    count : process.env.COUNT
}

app.get('/payment/list', async (req, res) => {
    
    try {
      
        const {code} = req.query
        
        const response = await fetch('https://my.sepay.vn/userapi/transactions/list', {
            method: 'GET',
            // mode: 'cors',
            headers: {
                
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${process.env.SEPAY_TOKEN}`
            }
        })
        
        const data = await response.json();

        const check = data.transactions.find(item => item.code === code);

       
        if (!check) {
            res.status(404).json({
                message : "Chưa chuyển khoản",
                status : 404,
                success : false
            })
        } else {
              res.status(200).json  ({
                message : "Chuyển khoản thành công",
                status : 200,
                success : true,
                data : check
            })
        }
    
    } catch (error) {
        console.error(`Error: ${error}`);
    }

}


);
app.get('/payment/create', async (req, res) => {
    // const id = req.query.id;
    // console.log(id);
    cache.count += 1
    try {
        const  { amount } = req.query;
        const response = await fetch(`https://qr.sepay.vn/img?acc=${process.env.SEPAY_ACC_NUMBER}&bank=MBBank&amount=${amount}&des=DH0${cache.count}&template=TEMPLATE&download=DOWNLOAD`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${process.env.SEPAY_TOKEN}`,
                // "responseType" : "stream"
            }
        })


        res.setHeader("Content-Type", "image/jpeg")
      
        const data = await response.arrayBuffer()
        const base64Image = Buffer.from(data, "binary").toString("base64");
return res.send({ image: `data:image/jpeg;base64,${base64Image}` , code : `DH0${cache.count}`});
        // res.send(data);
        // console.log(data);
        // res.send(data)
        
        // console.log(data);
        
        // return res.send(Buffer.from(data,"binary"))
        
        // console.log(response.url);
    //   const test = await response.json()
    //     const data = await response.blob();
    //     // console.log(data);
        
        // const imageObjectURL = URL.createObjectURL(data);
        // console.log(imageObjectURL);
        
    //         // console.log(data);
            
    //         // console.log(data)
    //     if (data) return res.send(data);
     } catch (error) {
        console.error(`Error: ${error}`);
    }
});
// app.post('/payment/create', async (req, res) => {
//     try {
//         const response = await fetch('https://qr.sepay.vn/img?acc=0582138826&bank=Mbank&amount=2000&des=MOV365', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 // "Authorization": "Bearer HPKG5ALAIHNY1WZY3Q4P2JHSGBWSVTR4CM01O29JJPB766EUQRYCJBMPOVKEXIAN"
//             },
//             // body: JSON.stringify(req.body)
            
//         })
//         const data = await response.json();
//         console.log(data)
//         if (data) res.json(data);
//     } catch (error) {
//         console.error(`Error: ${error}`);
//     }
// });

app.listen(PORT, "0.0.0.0",  () => {
    console.log('Server is running on port 3000');
}
);


// //  xac nhan web hook
// const bodyParser = require("body-parser");
// const crypto = require("crypto");

// const app = express();
// const PORT = 3000;

// // Middleware để parse JSON
// app.use(bodyParser.json());

// // Khóa bí mật (lấy từ SePay Dashboard)
// const SECRET_KEY = "YOUR_SECRET_KEY"; // Thay bằng khóa bí mật của bạn

// // Hàm xác minh chữ ký
// function verifySignature(req) {
//     const signature = req.headers["x-sepay-signature"];
//     const payload = JSON.stringify(req.body);
    
//     // Tạo chữ ký bằng HMAC SHA256
//     const expectedSignature = crypto
//         .createHmac("sha256", SECRET_KEY)
//         .update(payload)
//         .digest("hex");

//     return signature === expectedSignature;
// }

// // Xử lý Webhook
// app.post("/sepay-webhook", (req, res) => {
//     if (!verifySignature(req)) {
//         return res.status(401).send("Unauthorized");
//     }

//     const transaction = req.body;

//     console.log("🔔 Nhận được giao dịch mới từ SePay:", transaction);

//     // Kiểm tra trạng thái giao dịch
//     if (transaction.status === "success") {
//         console.log("✅ Giao dịch thành công, xử lý đơn hàng...");
//         // TODO: Cập nhật trạng thái đơn hàng trong database
//     } else {
//         console.log("❌ Giao dịch thất bại");
//     }

//     res.status(200).send("Webhook received");
// });
