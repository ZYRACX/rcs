import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
// components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SignUp() {
  const navigate = useNavigate();

  // form states
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // form submit handler
  function handleSubmit(event) {
    event.preventDefault()
    // console.log(username, email, password, confirmPassword)

    if(!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    axios.post("http://localhost:8000/auth/register", {
      username: username,
      email: email,
      password: password,
    }).then((response) => {
      if(response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate('/auth/login');
      }
    }).catch((error) => {
      console.error("There was an error!", error);
      if (error.response) {
        alert("Error: " + error.response.data.error_message);
      }
    });

    // Handle form submission logic here
    // axios.post("http://localhost:8000/api/register", {
    //   username: username,
    //   email: email,
    //   password: password,
    //   confirmPassword: confirmPassword,
    // }
    // ).then((response) => {
    //   console.log(response);
    //   if (response.status === 201) {
    //     alert("Registration successful! Please log in.");
    //     navigate('/auth/login');
    //   }
    // }).catch((error) => {
    //   console.error("There was an error!", error);
    //   if (error.response) {
    //     alert("Error: " + error.response.data.error);
    //   }
    // });
  }

  useEffect(() => {
    // Redirect if already logged in
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("User is already logged in with userId:", userId);

      navigate('/game/overview');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Create an Account
          </CardTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Join ServNect and get started
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="name"
                type="text"
                placeholder="John123"
                required
                onChange={(e) => setUsername(e.target.value)}
                
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}

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

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}

              />
            </div>

            {/* Sign Up Button */}
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              Register
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}