import { useParams } from "react-router-dom"

export default function DailyLog() {

  const {username} = useParams()

    return <h1>{username}'s daily log</h1>
}