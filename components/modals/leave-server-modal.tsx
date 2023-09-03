"use client";

import React, {useState} from 'react';
import axios from "axios";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

import {useModal} from "@/hooks/use-modals-store";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";


const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const {server} = data;

  const isModalOpen = isOpen && type === 'leaveServer';

  const [isLoading, setIsLoading] = useState(false );

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push('/');
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
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want leave <span className="text-indigo-500 font-semibold">{server?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              Confirm
            </Button>
          </div>
         </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal ;