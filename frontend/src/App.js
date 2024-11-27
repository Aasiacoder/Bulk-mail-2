import {useState} from 'react';
import axios from 'axios'
import * as XLSX from 'xlsx'//* as XLSX means you didn't use only xlsx function instead apply all xlsx function here now it will work

function App() {

  const [message, setmessage] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handleMessage(e){//textarea la onchange agura apa message-variable la antha value store agum
    setmessage(e.target.value)
  }

  function handlefile(event){
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader();//file ah read pana FileReader object ah create pandra
    //eppo load agutho apo antha file reader click ana apro Excel file ah yeduthu thana kulla load panikum
    reader.onload = function (e) {
        console.log(e)//1st choose file btn click and select excel file,here i get file (check console)

        const data = e.target.result;
        console.log(data)//check console now more words are showing but it not a readable format coz it is binary format la eruku

        //now i change excel file data in readable format
        const workbook = XLSX.read(data, { type: 'binary' })//XLSX.read(data,)data-padika mudiyama eruntha antha binary file ah XLXS file la read panna pora, and padika mudiyama eruntha antha data oda type enna binary so i mention here{type:"binary"}.XLSX file ah tha cdn la erunthu yeduthu html la use pani eruka athaye tha ingayum use pana pora
        console.log(workbook);
        const sheetName = workbook.SheetNames[0]//workbook kulla SheetNames[0] la 0 index la 
        const worksheet = workbook.Sheets[sheetName]
        console.log(worksheet)//here i got the actuall excel sheet data,here i change format into json array
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})//utils la sheet_to_json nu oru function (here worksheet ah podanu,{here entha header A nu eruko atha matum particular ah select pannu yana inga tha excel la eruka email eruku})
        console.log(emailList)//here oru array eruku antha array la 2 emails um eruku
        const totalemail = emailList.map(function(item){return item.A})//item is email and .A means perticular A value only i want
        console.log(totalemail);
        setEmailList(totalemail)
    }

    reader.readAsBinaryString(file); //Excel ellamey binary format la erukum so atha binary format la tha read panna mudiyum

  }

  //textarea la eruka msg send-btn click pandra apa backend ku poganum
  function send(){//here axios use pani req ah send pana pora "/sendemail page la",{msg:meesage}msg ah ena send panapora message-value va 
    //default axios is get
    setstatus(true)//when btn click btn status was change into sending
    axios.post("http://localhost:5000/sendemail",{msg:message,emailList:emailList}) 
    //sendemail page ku req pogum athu kudavey message and emailList um pogum
    .then(function(data){
      if(data.data === true){
        alert("Email sent Successfully")
        setstatus(false)
      }else{
        alert("Failed to Load")
      }
    })
  }

  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handleMessage} value={message} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text... "></textarea>

        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5" />
        </div>

        <p>Total Emails in th file: {emailList.length}</p> {/*how many email have in emailList it will shown here */}

        <button onClick={send} className="bg-blue-950 py-2 px-2 mt-2 text-white font-medium rounded-md w-fit">{status?"Sending...":"Send"}</button>

      </div>

      <div className="bg-blue-300 text-white text-center p-8">
      </div>

      <div className="bg-blue-200 text-white text-center p-8">
      </div>

    </div>
  );
}

export default App;
