
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
// import { useNavigate } from "react-router-dom"

import { account } from "@/appwrite"

// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axios from "axios"

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(event) {
    event.preventDefault()
   account.createEmailPasswordSession({
    email: email,
    password: password,
   }).then((response) => {
    // console.log(response);
    navigate('/game/overview')
   }).catch((error) => {
    console.error("There was an error!", error);
    alert("Error: " + error.message)
   })

    // axios.post("http://localhost:8000/api/login", {
    //   email: email,
    //   password: password,

    //   }
    // ).then((response) => {
    //   console.log(response);
    //   localStorage.setItem("userId", response.data.userId)
    //   navigate('/game/overview')
    // }).catch((error) => {
    //   console.error("There was an error!", error);
    //   if(error.response){
    //     alert(error.response.data.error);
    //   }
    // });
  }

useEffect(() => {
  account.get().then((response) => {
    console.log("User is already logged");
    console.log(response)
    navigate('/game/overview')
  }).catch((error) => {
    console.log("No active session found");
    // console.error(error)
  })
}, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to continue to RCS
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                to="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                Get Started
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}