import connect from "@/lib/db"
import User from "@/lib/models/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

const ObjectId=require("mongoose").Types.ObjectId

export const GET=async ()=>{
    try {
        await connect()

        const users=await User.find()
    
        return new  NextResponse(JSON.stringify(users),{status:200})
    } catch (error:any) {
        return new NextResponse("Error in fetching users" + error.message,{status:500})
    }
   
}

export const POST=async(req:Request)=>{
    try {
        const body=await req.json()

        await connect()

        const newUser=new User(body)

        await newUser.save()

        return new NextResponse(JSON.stringify({message:"New user created",user:newUser}),{status:200})
    } catch (error:any) {
        return new NextResponse("Error in creating user" + error.message,{status:500})
    }
}

export const PATCH=async(req:Request)=>{

    try {
        const body=await req.json()

        const{userId,newUsername}=body
    
       await connect()
    
       if(!userId || !newUsername){
        return new NextResponse(JSON.stringify({message:"ID or new username not found"},
            
        ),{status:400})
       }

       if(!Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify({message:"ID  is not valid"},   
    ),{status:400})
       }

       const updatedUser=await User.findOneAndUpdate(
        {_id:new ObjectId(userId)},
        {username:newUsername},
        {new:true}
    
       )

       if(!updatedUser){
        return new NextResponse(JSON.stringify({message:"updated user doesnt exists"},   
    ),{status:400})
       }

       return new NextResponse(JSON.stringify({message:"User updated",user:updatedUser}),{status:200})
    } catch (error:any) {
        return new NextResponse("Error in creating user" + error.message,{status:500})
    }
  
}

export const DELETE=async(request:Request)=>{

    const{searchParams}=new URL(request.url)

    const userId=searchParams.get("userId")

    if(!userId){
        return new NextResponse(JSON.stringify(
            {message:"User id not found"}),
            {status:400}
        )
    }

    if(!Types.ObjectId.isValid(userId)){
        return new NextResponse(JSON.stringify(
            {message:"type is not valid"}),
            {status:400}
        )
    }

    await connect()

    const deletedUser=await User.findByIdAndDelete(
        new Types.ObjectId(userId)
    )

    if(!deletedUser){
        return new NextResponse(JSON.stringify(
            {message:"User is not deleted"}),
            {status:400}
        )
    }

    return new NextResponse(JSON.stringify({message:"User deleted"}),{
        status:200
    })
}