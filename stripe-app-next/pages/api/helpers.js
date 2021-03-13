const API = "http://localhost:3001"

export async function fetchFromApi(endpointURL,opts){
  const {method,body} = {method:"POST",body:null}

  const res= await fetch(`${API}/${endpointURL}`,{
    method,
    ...(body &&{body:JSON.stringify(body)}),
    headers:{
      "Content-Type":"application/json",

    }

  })
  return res.json()
}