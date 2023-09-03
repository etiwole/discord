import React, {FC} from 'react';
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ src, className}) => {
  return (
    <Avatar className={cn(
      'h-4 w-4 md:h-10 md:w-10',
      className
    )}>
      <AvatarImage src={src}/>
    </Avatar>
  );
};

export default UserAvatar;