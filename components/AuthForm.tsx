"use client"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import FormField from "@/components/FormField"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signUp } from "@/lib/actions/auth.action"
import { signInWithEmailAndPassword } from "firebase/auth"
import { signIn } from "@/lib/actions/auth.action"
const authFormSchema = (type: FormType) => 
  {
    return z.object({
      name: type === "sign-in" ? z.string().optional() : z.string().min(3),
      email: z.string().email(),
      password: z.string().min(8),
    })
  }

const AuthForm = ({ type }:{type: FormType}) => {
    const router = useRouter();
    const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // Check for form errors
  console.log("Form errors:", form.formState.errors)

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values)
    try{
      if(type === "sign-up"){
        const{name, email, password} = values;
        const userCredential = await createUserWithEmailAndPassword(auth,email,password);
        const result=await signUp({
          uid: userCredential.user.uid,
          name: name as string,
          email,
          password,
        })
        if(result?.success){
          toast.success(result?.message)
          return;
        }
        toast.success("Account created successfully. Please sign in.")
        router.push("/sign-in")
        
      }else{ 
        const{ email, password} = values;
        const userCredential = await signInWithEmailAndPassword(auth,email,password);
        const idToken = await userCredential.user.getIdToken();
        if(!idToken){
          toast.error("Failed to get ID token")
          return;
        }
        await signIn({
          email, idToken
      })
        
        toast.success("Sign in successfully")
        setTimeout(() => {
          router.push("/")
        }, 1000)
      }
    }catch(error){
      console.log("Error in onSubmit:", error);
      toast.error(`There was an error: ${error}`)
    }
  }

  function onError(errors: unknown) {
    console.log("Form validation errors:", errors);
    if (errors && typeof errors === "object") {
      type ErrorObject = { [key: string]: { message?: string } };
      console.log(
        "Error details:",
        Object.keys(errors).map(
          (key) => `${key}: ${(errors as ErrorObject)[key]?.message}`
        )
      );
      toast.error(
        `Please fix the form errors: ${Object.keys(errors).join(", ")}`
      );
    } else {
      toast.error("Please fix the form errors.");
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <section className="flex-center size-full max-sm:px-6">
      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-col gap-2.5 justify-center items-center">
            <div className="flex flex-row gap-2 justify-center">
              <Image src="/logo.svg" alt="logo" width={32} height={38} />
              <h2 className="text-primary-100">PrepWise</h2>
            </div>
            <h3 className="text-2xl">Practice job interview with AI</h3>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className=" w-full space-y-6 mt-4 form">
              {!isSignIn && ( <FormField control={form.control} 
              name="name"
              label="Name" 
              placeholder="Enter your name" 
              />)}
              <FormField control={form.control} 
              name="email" 
              label="Email" 
              placeholder="Enter your email" 
              type="email"
              />
              <FormField control={form.control}
              name="password" 
              label="Password" 
              placeholder="Enter your password" 
              type="password"
              />
        
              <button className="btn" type ="submit">{isSignIn ? "Sign In" : "Create an Account"}</button>
            </form>
          </Form>
          <p className ="text-center">
            {isSignIn ? "no account yet?" : "Have an account already?" }
            <Link href = {!isSignIn ? "/sign-in" : "/sign-up"} className ="font-bold text-user-primary ml-1">
            {!isSignIn ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default AuthForm