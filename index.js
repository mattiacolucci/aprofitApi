const express = require('express');
const app = express();
const port = 4000;
const db=require("./jsFile/db");
const validPassword=require("./jsFile/validPassword");
const hashPassword=require("./jsFile/hashPassword");
const { getDocs, collection, query, where, setDoc, doc, updateDoc } = require('firebase/firestore');
const { update } = require('tar');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/auth/login",async(req,res)=>{
    //genera un jwt che viene inviato come risposta, da memorizzare nella memoria locale di sessione del client
	const username=req.body.username;
    const password=req.body.password;

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    try{
        const q=query(collection(db,"users"),where("username","==",username));
        const users= await getDocs(q);
        if(!users.empty.valueOf()){  //se ci sono records
            const user=users.docs.at(0);
            if(await validPassword(password,user.get("password"))){  //vedo se la passw inserita corrisponde con l'hash memorizzato
                res.status(200).send({message:"Login Avvenuto Con Successo!",username:user.get("username")});  //restituisco un json
            }else{
                res.status(401).send({message:"Password Errata"});
            }
        }else{
            res.status(401).send({message:"Utente Non Esistente"});
        }
    }catch(err){
        console.log(err.message+" line:"+err.lineNumber);
        res.status(401).send({message:err.message});
    }
});

app.post("/auth/register",async(req,res)=>{
    //genera un jwt che viene inviato come risposta, da memorizzare nella memoria locale di sessione del client
	const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;

    console.log(username);

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    try{
        const q=query(collection(db,"users"),where("username","==",username));
        const users= await getDocs(q);
        if(users.empty.valueOf()){  //se non ci sono records
            const hashedPassw=await hashPassword(password);
            await setDoc(doc(db, "users",Math.floor(Date.now()/1000).toString()), {
                username: username,
                password: hashedPassw,
                email: email
            });
            res.status(200).send({message:"Registrazione Avvenuta Con Successo!"});
        }else{
            res.status(401).send({message:"Username Già Utilizzato",errType:"Username"});
        }
    }catch(err){
        console.log(err);
        res.status(401).send({message:err.message});
    }
});

app.post("/getUserData",async(req,res)=>{
    //genera un jwt che viene inviato come risposta, da memorizzare nella memoria locale di sessione del client
	const username=req.body.username;

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    try{
        const q=query(collection(db,"users"),where("username","==",username));
        const users= await getDocs(q);
        if(!users.empty.valueOf()){  //se ci sono records
            const user=users.docs.at(0);
            res.status(200).send({message:"Successo",email:user.get("email"),
            nome:((user.get("nome")!=undefined)?user.get("nome"):""),
            cognome:((user.get("cognome")!=undefined)?user.get("cognome"):""),
            eta:((user.get("eta")!=undefined)?user.get("eta"):""),
            peso:((user.get("peso")!=undefined)?user.get("peso"):""),
            altezza:((user.get("altezza")!=undefined)?user.get("altezza"):""),
            });  //restituisco un json
        }else{
            res.status(401).send({message:"Utente Non Esistente"});
        }
    }catch(err){
        console.log(err.message+" line:"+err.lineNumber);
        res.status(401).send({message:err.message});
    }
});

app.post("/editPassword",async(req,res)=>{
    //genera un jwt che viene inviato come risposta, da memorizzare nella memoria locale di sessione del client
	const username=req.body.username;
    const actualPassword=req.body.actualPassword;
    const newPassword=req.body.newPassword;

    console.log(username);

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    try{
        const q=query(collection(db,"users"),where("username","==",username));
        const users= await getDocs(q);
        if(!users.empty.valueOf()){  //se ci sono records
            const user=users.docs.at(0);
            if(await validPassword(actualPassword,user.get("password"))){  //vedo se la passw attuale inserita corrisponde con l'hash memorizzato
                const hashedPassw=await hashPassword(newPassword);
                await updateDoc(user.ref,{password:hashedPassw});
                res.status(200).send({message:"Modifica Avvenuta Con Successo"});  //restituisco un json
            }else{
                res.status(401).send({message:"Password Attuale Errata"});
            }
        }else{
            res.status(401).send({message:"Utente Non Esistente"});
        }
    }catch(err){
        console.log(err);
        res.status(401).send({message:err.message});
    }
});


app.post("/editUserData",async(req,res)=>{
    //genera un jwt che viene inviato come risposta, da memorizzare nella memoria locale di sessione del client
	const username=req.body.username;
    const nome=req.body.nome;
    const cognome=req.body.cognome;
    const eta=req.body.eta;
    const email=req.body.email;
    const peso=req.body.peso;
    const altezza=req.body.altezza;
    const newUsername=req.body.newUsername;

    console.log(username);

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    try{
        const q=query(collection(db,"users"),where("username","==",username));
        const users= await getDocs(q);
        if(!users.empty.valueOf()){  //se ci sono records
            if(username!=newUsername){
                const q2=query(collection(db,"users"),where("username","==",newUsername));
                const users2= await getDocs(q2);

                if(!users2.empty.valueOf()){  //se cce un username
                    res.status(401).send({message:"Utente con nuovo username scelto già esistente"});
                    return;
                }
            }

            await updateDoc(users.docs.at(0).ref,{
                nome:nome,
                cognome:cognome,
                eta:eta,
                email:email,
                peso:peso,
                altezza:altezza,
                username:newUsername
            });
            res.status(200).send({message:"Modifica Dei Dati Avvenuta Con Successo"});  //restituisco un json
        }else{
            res.status(401).send({message:"Utente Non Esistente"});
        }
    }catch(err){
        console.log(err);
        res.status(401).send({message:err.message});
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
