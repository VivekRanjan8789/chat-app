import { useContext } from "react";
import { AuthContext } from "@/context/Auth";
import { getColor } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@radix-ui/react-avatar";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("auth in profile-info ", auth?.user);

  const handleLogoutUser =  () =>{
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setAuth({
        user: ""
      })
      toast.success("logout successflly")
      navigate("/auth")
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-8 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {auth?.user?.image ? (
              <AvatarImage
                src={auth?.user?.image}
                alt="profile"
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                  auth?.user?.color
                )}`}
              >
                {auth?.user?.firstName
                  ? auth?.user?.firstName.split("").shift()
                  : auth?.user?.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {auth?.user?.firstName && auth?.user?.lastName
            ? `${auth?.user?.firstName} ${auth?.user?.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <FiEdit2
                    className="text-purple-500 text-xl font-medium  cursor-pointer"
                    onClick={() => {
                      navigate("/profile");
                    }}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e] border-none text-white px-2">
                Edit Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* power button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <IoPowerSharp
                    className="text-red-500 text-xl font-medium  cursor-pointer"
                    onClick={handleLogoutUser}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1b1e] border-none text-white px-2"
              >
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
