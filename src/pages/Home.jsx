import { useEffect } from "react";
import { getLoanProducts } from "../api/loanApi";
import LoanForm from "../components/LoanForm/LoanForm";

function Home() {

    useEffect(() =>{
    getLoanProducts().then(data => console.log(data))
}, []);


  return (
    <div className="w-full py-5 flex items-center justify-center">
      <LoanForm />
    </div>
  );
}

export default Home;
