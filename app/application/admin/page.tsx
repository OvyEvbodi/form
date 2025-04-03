import UserInfo from "@/components/UserInfo"
import { getSession } from "@/lib"
import { redirect } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary";

const Admin = async () => {
  const session = await getSession();
  if (session === null) redirect("/application/auth")

  return (
    <div>
      <h1>Admin page</h1>
      <ErrorBoundary fallback={<div className="text-center">Something's not right. Please refresh the page.</div>}>
        <UserInfo />
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </ErrorBoundary>
    </div>
  )
};

export default Admin