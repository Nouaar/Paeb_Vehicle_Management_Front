"use client"

import React ,  {useEffect} from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


const ProtectedRoute : React.FC<{children : React.ReactNode}> = ({children}) => {
    const {user} = useAuth() ;
	const router = useRouter();

	if(!user) {
		useEffect(()=> {
			router.replace("/auth/login");
		} , [router , user])
	}

	if(!user) {
		return null ;
	}


	return (
		<>
			{children}
		</>
	);
}

export default ProtectedRoute ;

