import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import useSWR from "swr"

export default function useUser(args = {}) {
    let { redirectIfFound, redirectTo } = args
    const { data: user, mutate: mutateUser } = useSWR("/api/auth/session")

    let history = useHistory()

    useEffect(() => {
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            history.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo, history])

    return { user, mutateUser }
}
