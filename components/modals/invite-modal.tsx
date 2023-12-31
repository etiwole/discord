"use client";

import React, {useState} from 'react';

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent
} from "@/components/ui/dialog";

import {useModal} from "@/hooks/use-modals-store";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, Copy, RefreshCw} from "lucide-react";
import {useOrigin} from "@/hooks/use-origin";
import axios from "axios";

const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${data?.server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const onGenerate = async () => {
    try {
      setIsCopied(true);

      const response = await axios.patch(`/api/servers/${data.server?.id}/invite-code`);

      onOpen('invite', { server: response.data });

    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose }>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
          >
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {isCopied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
            </Button>
          </div>
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-400 mt-4"
          >
            Generate new link
            <RefreshCw className="w-4 h-4 ml-2"/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;