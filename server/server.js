import express from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

//lembre de sincronizar com o banco de dados - prisma
// use cors caso de erro ( npm i cors - app.use(cors("http...") ))

// enviar os usuarios
app.post("/users", async (req, res) =>{
    // o retorno do console.log mostrou os dados do body enviado por um arquivo json no Postman API

    // criar os dados com as requisicoes - await para esperar o retorno(nessecita ser uma funcao assincrona)
    await prisma.user.create({
        data:{
            email: req.body.email,
            name: req.body.name,
            sobrenome: req.body.sobrenome
        }
    })

    // app.push usado para pegar esses dados

    // retornando um status de que está tudo ok e algo foi criado
    res.status(201).send("post ok")
})

app.get("/users/check-email", async(req, res) =>{
        // verficar se o email está em uso
        const { email } = req.query
        const existingEmail = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
    
        if(existingEmail){
            return res.status(409).json({ message: "Email já em uso"})
        }else{
            return res.status(200).json({ message: "Email disponivel"})
        }
    
})

// acessar a rota do usuario e retornar algo
app.get("/users", async(req, res) =>{

    // o retorno
    // mostando os usuarios

    let users = []

    if(req.query){
        users = await prisma.user.findMany({
            where:{
                name: req.query.name
            }
        })
    } else{
        const users = await prisma.user.findMany()

    }

    // status de que está tudo ok
    res.status(201).json(users)

})



// alterar os ususarios
//  : = variavel na url
app.put("/users/:id", async(req, res) =>{

    await prisma.user.update({
        where:{
            id: req.params.id,
        },
        data:{
            email: req.body.email,
            name: req.body.name,
            sobrenome: req.body.sobrenome
        }
    })
})

// deletar usuarios
app.delete("/users/:id", async(req, res) =>{
    await prisma.user.delete({
        where:{
            id: req.params.id,
        },
    })

    res.status(200).json( { message: " usuario deletado"})

})

// porta usada
app.listen(3000)

