import LoginComponent from "./components/login";

export default async function Home() {

  return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
         <LoginComponent/>
      </div>     
  );
}
