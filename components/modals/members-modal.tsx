"use client";

import React, {useState} from 'react';
import qs from 'query-string';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent, DialogDescription
} from "@/components/ui/dialog";

import {useModal} from "@/hooks/use-modals-store";
import {ServerWithMembersWithProfiles} from "@/type";
import {ScrollArea} from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";
import {Check, Gavel, Loader, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MemberRole} from "@prisma/client";
import axios from "axios";
import {useRouter} from "next/navigation";

const roleIconMap = {
  'GUEST': null,
  'MODERATOR': <ShieldCheck className="w-4 h-4 text-indigo-500" />,
  'ADMIN': <ShieldAlert className="w-4 h-4 text-rose-500"/>
}

const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();

  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'members';

  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });

      const { data } = await axios.delete(url);

      router.refresh();
      onOpen('members', { server: data });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId('')
    }
  }

  const onRoleChanged = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        }
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen('members', { server: response.data })
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId('');
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose }>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            { server?.members.length } members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member) => (
            <div key={member.id} className="flex items-center mb-6 gap-x-2">
              <UserAvatar src={member.profile.imageUrl}/>
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  { member.profile.name }
                  { roleIconMap[member.role] }
                </div>
                <p className="text-xs text-zinc-500">
                  { member.profile.email }
                </p>
              </div>
              {server.profileId !== member.profileId && loadingId !== member.id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4 text-zinc-500 "/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center">
                          <ShieldQuestion
                            className="w-4 h-4 mr-2"
                          />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChanged(member.id, MemberRole.GUEST)}
                            >
                              <Shield className="w-4 h-4 mr-2"/>
                              Guest
                              {member.role === 'GUEST' && (
                                <Check className="w-4 h-4 ml-auto"/>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChanged(member.id, MemberRole.MODERATOR)}
                            >
                              <ShieldCheck className="w-4 h-4 mr-2"/>
                              Moderator
                              {member.role === 'MODERATOR' && (
                                <Check className="w-4 h-4 ml-auto"/>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem onClick={() => onKick(member.id)}>
                        <Gavel className="w-4 h-4 mr-2"/>
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member.id && (
                <Loader
                  className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal ;