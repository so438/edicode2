const express = require("express");
const axios = require("axios");
const app = express();

const PORT = 3000;
const TEST_URL = `http://127.0.0.1:${PORT}/edicode2?serviceKey=2a48f93a5348af17db0d725602e187d8bbb0569c6092441acaf20573b0985fb0&numOfRows=10&pageNo=1&mcatCd=G8705087`;

app.get("/edicode2", async (req, res) => {
  console.log("✅ /edicode2 요청 감지됨!");
  const { serviceKey, numOfRows, pageNo, mcatCd } = req.query;

  const url =
    "https://apis.data.go.kr/B551182/mcatInfoService1.2/getPaymentNonPaymentList1.2";

  try {
    const response = await axios.get(url, {
      params: {
        ServiceKey: decodeURIComponent(serviceKey),
        numOfRows,
        pageNo,
        mcatCd,
        _type: "xml",
      },
      timeout: 60000,
      responseType: "text",
    });

    console.log("⚙️ 상태 코드:", response.status);
    console.log("📦 응답 내용:", String(response.data).slice(0, 200)); 

    res.writeHead(200, { "Content-Type": "text/xml; charset=utf-8" });  
    res.end(response.data);  
  } catch (error) {
    if (error.response) {
      console.error(
        `❌ 요청 에러: ${error.message}, 상태 코드: ${error.response.status}`
      );
      res.status(error.response.status).send(error.response.data);
    } else {
      console.error("❌ 요청 에러:", error.message);
      res.status(500).send("API 요청 실패");
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다!`);
  console.log(`👉 테스트 링크:\n${TEST_URL}`);
});
