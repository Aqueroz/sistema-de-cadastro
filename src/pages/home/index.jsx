import "./style.css"
import Trash from "../../assets/trash.svg"

import { useEffect, useRef, useState } from "react"
import api from "../../services/api"

function Home() {


  // atualizar as mensagens de erro
  const [messageError, setMessageError] = useState("")

  // aplicando estilo a tag
  const [errorColor, setErrorColor] = useState(false)

  // ter as alterações na tela
  const [users, setUsers] = useState([])

  // useRef para ler os valores e posterioemente enviar para o banco de dados
  const inputName = useRef()
  const inputSobrenome = useRef()
  const inputEmail = useRef()

  // assincrona para esperar a resposta do servidor
  async function getUsers() {
    const usersFromApi = await api.get("/users")

    // coloca os dados em users
    setUsers(usersFromApi.data)

  }

  // criar um novo cadastro
  async function createUsers() {

    const name = inputName.current.value
    const sobrenome = inputSobrenome.current.value
    const email = inputEmail.current.value

    // tratamento de erro
    try {

      const checkEmail = await api.get(`/users/check-email?email=${email}`)

      if (checkEmail.status === 409) {
        setMessageError("Email em uso")
        setErrorColor(true)
        return
      }
      await api.post("/users", {
        name,
        sobrenome,
        email
      },
      )
      // atualizar  tela quando um novo cadastro for feito
      getUsers()

      inputName.current.value = ""
      inputSobrenome.current.value = ""
      inputEmail.current.value = ""
      setMessageError("Cadastrado com sucesso")
      setErrorColor(false)

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessageError("Email em uso")
        setErrorColor(true)
      } else {
        console.error("Erro ao criar usuario", error)
        setMessageError("Ocorreu um erro")
        setErrorColor(true)
      }
    }

  }

  async function deleteUsers(id) {
    await api.delete(`/users/${id}`, {

    })

    getUsers()

  }

  // chamar a funcao quando a pagina carregar
  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="container">
      <form action="">
        <h2>Cadastro</h2>
        <label>Nome:</label>
        <input name="name" type="text" placeholder="Nome" ref={inputName} required />

        <label>Sobrenome:</label>
        <input name="sobrenome" type="text" placeholder="Sobrenome" ref={inputSobrenome} required />

        <label>E-mail:</label>
        <input name="email" type="email" placeholder="E-mail" ref={inputEmail} required />
        {/* operador ternairo para verficar uma condicao e retorna uma cor especifica */}
        <h4 style={{color: errorColor ? "#ff2f2f" : "green"}}>{messageError}</h4>
        <button type="button" onClick={createUsers}>Cadastrar</button>
      </form>


      {users.map(user => (
        <div key={user.id} className="cards">
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Sobrenome: <span>{user.sobrenome}</span> </p>
            <p>E-mail: <span>{user.email}</span></p>
          </div>
          <div>
            <button>
              <img src={Trash} onClick={() => deleteUsers(user.id)} alt="imagem da lixeira" />
            </button>
          </div>
        </div>
      ))}


    </div>
  )
}

export default Home
