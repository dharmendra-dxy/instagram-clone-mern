import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'

const Post = () => {

    const [text, setText] = useState('');

    const [open, setOpen] = useState(false);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()){
            setText(inputText)
        }
        else{
            setText('');
        }
    }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>

        <div className='flex items-center justify-between'>

            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src='' alt='userProfileImg'/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1>username</h1>
            </div>

            <Dialog>

                <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer'/> 
                </DialogTrigger>

                <DialogContent  className='flex flex-col items-center text-sm text-center'>

                    <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4957] font-bold'>
                        Unfollow
                    </Button>

                    <Button variant='ghost' className='cursor-pointer w-fit '>Add to Fav</Button>
                    <Button variant='ghost' className='cursor-pointer w-fit '>Delete</Button>
                </DialogContent>
            </Dialog>

        </div>


        <img 
        src='https://images.pexels.com/photos/163235/hot-air-balloon-balloon-sky-hot-air-balloon-ride-163235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
        alt='userpostimg'
        className='rounded-sm my-2 w-full aspect-square object-cover'
        />

       

        <div className='flex items-center justify-between my-2'>

            <div className='flex items-center gap-3'>
                <FaHeart size={'22px'} className='cursor-pointer hover:text-gray-600'/>
                <MessageCircle onClick={()=> setOpen(true)} className='cursor-pointer hover:text-gray-600'/>
                <Send className='cursor-pointer hover:text-gray-600'/>    
            </div>
            <Bookmark className='cursor-pointer hover:text-gray-600'/>

        </div>

        <span className='font-medium block mb-2'>1k likes</span>

        <p>
            <span className='font-medium mr-2'>username</span>
            caption.....
        </p>

        <span onClick={()=> setOpen(true)} className='cursor-pointer text-sm text-gray-400'>View all 10 comments</span>

        <CommentDialog open={open} setOpen={setOpen} />

        <div className='flex items-center justify-between'>
            <input 
            type="text" 
            placeholder='Add a comment'
            value={text}
            onChange={changeEventHandler}
            className='outline-none text-sm w-full'
            />
            {
                text && <span className='text-[#3BADF9]'>Post</span>
            }
            
        </div>
        
        

    </div>
  )
}

export default Post