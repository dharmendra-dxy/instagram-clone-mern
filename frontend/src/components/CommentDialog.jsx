import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

const CommentDialog = ({open, setOpen}) => {
  
  const [text, setText] = useState("");

  // changeEventHandler:
  const changeEventHandler=(e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText);
    }
    else{
      setText("");
    }
  }

  // sendMessageHandler:
  const sendMessageHandler = async() => {
    alert(text);
  }

  return (
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=>setOpen(false)} className='max-w-5xl p-0 flex flex-col'>

          <div className='flex flex-1'>

            <div className='w-1/2'>
              <img 
                src='https://images.pexels.com/photos/163235/hot-air-balloon-balloon-sky-hot-air-balloon-ride-163235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' 
                alt='userpostimg'
                className='w-full h-full object-cover rounded-lg'
              />
            </div>
            
            <div className='w-1/2 flex flex-col justify-between'>
              <div className='flex items-center justify-between p-4'>

                  <div className='flex gap-3 items-center'>

                    <Link>
                      <Avatar>
                        <AvatarImage src=''/>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>

                    <div>
                      <Link className='font-semibold text-xs'> Username </Link>
                      {/* <span className='text-gray-600 text-sm'> Bio here... </span> */}
                    </div>

                  </div>

                  <Dialog>

                    <DialogTrigger asChild>
                      <MoreHorizontal className='cursor-pointer'/>
                    </DialogTrigger>

                    <DialogContent className='flex flex-col text-center text-sm'>
                      <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                        Unfollow 
                      </div>
                      <div className='cursor-pointer w-full'>
                        Add to Favourites
                      </div>

                      

                    </DialogContent>

                  </Dialog>
 
              </div>

              <hr />

              <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                comments ayenge...
              </div>

              <div className='p-4 '>
                <div className='flex items-center gap-2'>
                  <input 
                  onChange={changeEventHandler}
                  value={text}
                  type="text" 
                  placeholder='Add a comment...'
                  className='w-full outline-none border-gray-600 p-2 rounded'
                  />
                  <Button 
                  disabled={!text.trim()} 
                  onClick={sendMessageHandler} 
                  variant='outline'>Post</Button>
                </div>

              </div>

            </div>

          </div>
          



        </DialogContent>
    </Dialog>
  )
}

export default CommentDialog