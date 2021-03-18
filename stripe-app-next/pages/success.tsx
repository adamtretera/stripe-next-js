export default function CheckoutSuccess(){
    const url = window.location.href
    const sessionID = new URL(url).searchParams.get("session_id")
    return <h1>Checkout success {sessionID}"</h1>
}