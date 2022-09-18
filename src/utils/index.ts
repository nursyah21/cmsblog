import { supabase } from "../supabase";
import bcrypt from "bcryptjs"

const visited = async function(){
  const {data, error} = await supabase.from('visited').select().match({time: new Date().toDateString()})
    
  if (error) return console.log(error)
  const prevcount = (data[0] === undefined) ? 0 : data[0].counts

  var datas = {
    time: new Date().toDateString(),
    counts: 1+prevcount,
  }

  if(prevcount != 0){
    const {error} = await supabase.from('visited').update({counts: datas.counts}).match({time: datas.time})
    if(error) console.log(error)
  }else{
    const {error} = await supabase.from('visited').insert(datas)
    if(error)console.log(error)
  }
}

const login = async function(name:string, pass:string){
  const {data, error} = await supabase.from('users').select().match({name:name});
  
  if (error) return console.log(error)

  if(data[0] != undefined) return (this.comparePass(data[0].pass, pass)) ? "":"wrong password"
  return "wrong username"
}

const encryptPass = function(pass:string): boolean{
  return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
}

const comparePass = function(pass:string, hash:string): boolean{
  return bcrypt.compareSync(pass, hash)
}

export default{visited, login, encryptPass, comparePass}