import connect from "@/lib/db"
import Category from "@/lib/models/category"
import User from "@/lib/models/user"
import { Types } from "mongoose"
import { NextResponse } from "next/server"

export const PATCH=async(request:Request,context:{params:any})=>{

    const categoryId=context.params.category

    try {
        const {searchParams}=new URL(request.url)
        const userId=searchParams.get("userId")

        const body=await request.json()
        const title=body.title

        if(!userId || !Types.ObjectId.isValid(userId) ){
            return new NextResponse(JSON.stringify(
                {message:"Invalid or mising user id"}    
            ),{status:400})
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId) ){
            return new NextResponse(JSON.stringify(
                {message:"Invalid or mising category id"}    
            ),{status:400})
        }

        await connect()

        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify(
                {message:"No user in database"}    
            ),{status:404})
        }

        const category=await Category.findOne({
            _id:categoryId,user:userId
        })
        if(!category){
            return new NextResponse(JSON.stringify(
                {message:"No category in database"}    
            ),{status:404})
        }

        const updatedCategory=await Category.findByIdAndUpdate( 
            categoryId,
            {title},
            {new:true}    
        )

        return new NextResponse(JSON.stringify(
            {message:"Category updated",
                category:updatedCategory
            }    
        ),{status:200})

    } catch (error:any) {
        return new NextResponse(
            "Error in updating category" + error.message
        )
    }
}

export const DELETE=async(request:Request,context:{params:any})=>{

    const categoryId=context.params.category

    try {
        const {searchParams}=new URL(request.url)
        const userId=searchParams.get("userId")

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify(
                {message:"Invalid or mising user id"}    
            ),{status:400})
        }

        if(!categoryId || !Types.ObjectId.isValid(categoryId)){
            return new NextResponse(JSON.stringify(
                {message:"Invalid or mising category id"}    
            ),{status:400})
        }

        await connect()

        const user=await User.findById(userId)
        if(!user){
            return new NextResponse(JSON.stringify(
                {message:"No user in database"}    
            ),{status:404})
        }

        const category=await Category.findOne({
            _id:categoryId,
            user:userId
        })
        if(!category){
            return new NextResponse(JSON.stringify(
                {message:"No category in database"}    
            ),{status:404})
        }

        await Category.findByIdAndDelete(categoryId)

        return new NextResponse(
            JSON.stringify({ message: "Category is deleted" }),
            { status: 200 }
          );

    } catch (error:any) {
        return new NextResponse(
            "Error in deleting category" + error.message
        )
    }

    
}