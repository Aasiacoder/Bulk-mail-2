import express from 'express';//"type":"module" code write in package.json
import cors from 'cors';
import nodemailer from 'nodemailer';//1 Install Nodemailer
import mongoose from 'mongoose'

const app = express();

const PORT = 5000;

//MiddleWare functions
app.use(express.json());
app.use(cors());

//connect mongoose(mongodb version/database name)  password                                 database name  
mongoose.connect("mongodb+srv://aasia:aasiapasskeybulkmail@cluster0.1sfxc.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Connected to Database")
}).catch(function () {
    console.log("Failed to connect")
})

//create model for to get a date from bulkmail collection {}-schema is not use here coz i didn't add any values here so i didn't give 
const credential = mongoose.model("credentialmodel", {}, 'bulkmail')

app.post("/sendemail", (req, res) => {//when /sendemail req is send then the mail is res

    let msg = req.body.msg
    let emailList = req.body.emailList
    //console.log(msg)

    credential.find().then(function (data) {

        console.log(data[0].toJSON())//toJSON() ah convert pana tha data va use pana mudiyum
    
        //mail code begins
        const transporter = nodemailer.createTransport({
            //2 service:"here gmail service use",
            service: "gmail",
            auth: {
                user: data[0].toJSON().user, //2 give your mail id
                pass: data[0].toJSON().pass, //2 create app password from your google acc, don't put your original mail pwd 
            },
        });

        //odaney mail send ayduchi nu kamikuthu so i solve the problem 
        new Promise(async function (resolve, reject) {
            try {
                for (let i = 0; i < emailList.length; i++)//emailList la eruka all email um use pana i use for loop
                {
                    await transporter.sendMail(
                        {
                            from: "aasia3017@gmail.com",
                            to: emailList[i], //search- temp mail, click 1st link and copy temporary email
                            subject: "A message from BulkMail App",
                            text: msg,//frontend la erunthu send pandra message ah inga podura
                        },
                    )
                    console.log("Email sent to:" + emailList[i])
                }
                resolve("Success")
                //res.send(true)//email send ana paro true aydum suppose false achuna catch error show agum
            }
            catch (error) {
                reject("Failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })
    
    }).catch(function (error) {
        console.log(error)
    })

    //3 who's you want to send mail give here
    //1st it take object{} and take function()


});

app.listen(PORT, () => {
    console.log(`Server Begins at port: ${PORT}`);
});