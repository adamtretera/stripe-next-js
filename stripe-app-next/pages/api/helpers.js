const API = "http://localhost:3001"
import { auth } from './firebase';
export async function fetchFromApi(endpointURL,opts){
  const {method,body} = {method:"POST",body:null}
  const user = auth.currentUser
  const token = user && (await user.getIdToken())

  const res= await fetch(`${API}/${endpointURL}`,{
    method,
    ...(body &&{body:JSON.stringify(body)}),
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${token}`,

    }

  })
  return res.json()
}