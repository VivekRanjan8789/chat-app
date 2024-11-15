import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useAppStore } from "@/store";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getColor } from "@/lib/utils";

import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  // handle search contact
  const handleSearchContact = async (searchTerm) => {
    if (searchTerm.length === 0) {
      setSearchedContacts([]);
      return;
    }
    if (searchTerm.length > 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/contact/searchContacts`,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && searchTerm.length>0) {
          setSearchedContacts(response?.data?.contacts);
          console.log(response?.data?.contacts);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message || "error while fetching contacts"
        );
      }
    }
  };

  // set new contact
  const selectNewContact = (contact) => {
    console.log("contact is: ", contact);   
    setOpenNewContactModal(false);
    setSearchedContacts([]);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
  };

  return (
    <>
      {/* // tooltip button for opening dialog boc */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className=" text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => {
                setOpenNewContactModal(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1b1c1e] border-none mb-2 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* dialog box */}
      <Dialog
        open={openNewContactModal}
        onOpenChange={() => {
          setOpenNewContactModal(false);
          setSearchedContacts([]);
        }}
      >
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                handleSearchContact(e.target.value);
              }}
            />
          </div>
          {/* contacts fetched */}

          {searchedContacts.length > 0 && (
            <ScrollArea className=" h-[200px] ">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => {
                    selectNewContact(contact);
                      
                    }}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                        {contact?.image?.imageData ? (
                          <AvatarImage
                            src={`data:${contact.image.mimeType};base64,${contact.image.imageData}`}
                            alt="profile"
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contact.color
                            )}`}
                          >
                            {contact.firstName
                              ? contact.firstName.split("").shift()
                              : contact.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>

                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : `${contact.email}`}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* lottie image */}
          {searchedContacts.length <= 0 && (
            <div className="flex-1 mt-5  md:mt-0 md:flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500 ">! </span>Search New{" "}
                  <span className="text-purple-500 "> Contact </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
