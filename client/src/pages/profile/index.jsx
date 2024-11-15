import { AuthContext } from "@/context/Auth";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  
  const fileInputRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  // const [imageUpdate, setImageUpdate] = useState(false)
  const [hovered, setHovered] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);

  // if user profile is updated then we update states accordingly
  useEffect(() => {
    if (auth?.user?.profileSetup) {
      setFirstName(auth?.user?.firstName);
      setLastName(auth?.user?.lastName);
      setSelectedColor(auth?.user?.color);
      setImage(auth?.user?.image)
    }
  }, [auth, navigate]);

  
  // validate update-profile
  const validateProfile = () => {
    if (!firstName) {
      toast.error("firstName is required");
      return false;
    }
    if (!lastName) {
      toast.error("lastname is required");
      return false;
    }
    return true;
  };

  // update changes in profile
const saveChanges = async () => {
  if (validateProfile()) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/auth/update-profile`,
        { firstName, lastName, color: selectedColor },
        { withCredentials: true }
      );
      if(response.status===200){
        toast.success(response?.data?.message);        
        setAuth({  // updating auth
          ...auth,
            user: {
            ...auth.user,
            firstName: response?.data?.user?.firstName,
            lastName: response?.data?.user?.lastName,
            color: response?.data?.user?.color,
            profileSetup: response?.data?.user?.profileSetup
            }
        })
        navigate("/chat");        
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
};

  // handle file input click using ref by add button
  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  //  upload profile photo
  const handleImageChange = async (event) => {
    const file = await event.target.files[0];
    if(!file){
        toast.error("file must required for profile update")
        return;
    }
    const formData = new FormData()
    formData.append('image', file)
    try {
        const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/auth/update-profile-image`,  formData , {withCredentials: true})
        if(response.status===200){
          toast.success(response?.data?.message || "profile image updated");
          getProfilePhoto() // call for profile photo
        }             
    } catch (error) {
        toast.error(error?.response?.data?.message || "error while updating profile")
    }
  };


  //get profile photo
  const getProfilePhoto = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/auth/get-profile-photo`, { withCredentials: true});
      if(response.status===200){
          setImage(`data:${response?.data?.base64Image?.image?.mimeType};base64,${response?.data?.base64Image?.image?.imageData}`); 
          
          ({
            ...auth,
            user: {
              ...auth.user,
               image: `data:${response?.data?.base64Image?.image?.mimeType};base64,${response?.data?.base64Image?.image?.imageData}`               
            }
          })

          
      }

    } catch (error) {
       toast.error(error?.response?.data?.message || "error while fetching profile photo")
    }
 
  }

  // delete profile photo
  const handleDeleteImage = async() => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_SERVER_API}/auth/delete-profile-image`,{}, {withCredentials: true});
      if(response.status===200){
        toast.success(response?.data?.message || "profile image removed");
        setImage("");
        setAuth({
           ...auth,
           user: {
             ...auth.user,
             image: ""
           }
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "error while removing profiloe photo")
    }
  };

  // handle navigate of back button
  const handlenavigate = () => {
    if (auth?.user?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("please setup your profile");
    }
  };

  return (
    <>
      <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
        <div className="flex flex-col gap-10 w-[80vw] md:w-max">
          <div>
            <IoArrowBack
              className="text-4xl lg:text-6xl text-white/90 cursor-pointer hover:text-white/80"
              onClick={() => {
                handlenavigate();
              }}
            />
          </div>
          <div className="grid grid-cols-2">
            <div
              className="h-32 md:w-48 md:h-48 relative flex items-center justify-center"
              onMouseEnter={() => {
                setHovered(true);
              }}
              onMouseLeave={() => {
                setHovered(false);
              }}
            >
              <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : auth?.user?.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                  onClick={image ? handleDeleteImage : handleFileInputClick }
                >
                  {image ? (
                    <FaTrash className=" text-white text-3xl cursor-pointer" />
                  ) : (
                    <>
                      <FaPlus className=" text-white text-3xl cursor-pointer" />
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept=".png, .jpg, .jpeg, .svg, .webp"
                        onChange={handleImageChange}
                      />
                    </>
                  )}
                </div>
              )}
              {/* <input type="text" /> */}
            </div>
            <div className="flex min-w-32 md:min-w-64 flex-col text-white items-center justify-center gap-5">
              <div className="w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={auth?.user?.email}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="First Name"
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="Last Name"
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full flex gap-5">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                    ${
                      selectedColor === index
                        ? "outline outline-white/50 outline-3"
                        : ""
                    }
                    
                    `}
                    key={index}
                    onClick={() => {
                      setSelectedColor(index);
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <button
              className="h-16 w-full text-white bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={() => {
                saveChanges();
              }}
            >
              save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
