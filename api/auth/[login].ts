import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string
}

export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
) {
    const {action} = req.query;

    if(req.method === 'POST' && action === 'login'){
        try{
            const {email, password} = req.body;

            const response = await axios.post('https://api.escuelajs.co/api/v1/auth/login', {
                email,
                password
            })
            res.status(200).json(response.data);
        }catch(error){
            if(axios.isAxiosError(error)){
                if(error.response){
                    res.status(error.response.status).json(error.response.data)
                }else{
                    res.status(500).jsom({message: 'Nenhuma resposta do servidor de autenticação'})
                }
            }
           
        }
    }
}
