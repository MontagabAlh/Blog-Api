
export default function hashing(code:string){
    const newCode = (process.env.PASSWORD_PRIVET_KEY + code) as string
    return newCode
}