import { authClient } from "@workspace/api";

export async function GET() {
  const { data, error } = await authClient.signIn.email({
        /**
         * The user email
         */
        email: "brsantos197@gmail.com",
        /**
         * The user password
         */
        password: "123456789",
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        callbackURL: "/",
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: false
}, {
    //callbacks
})
  return Response.json({
    data,
    error
  })
}
