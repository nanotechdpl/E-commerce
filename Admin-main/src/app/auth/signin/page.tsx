import LoginForm from "./components/Login-form";

function SignIn() {
  return (
    <>
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] sm:w-[60%] sm:h-[60%] md:w-[70%] md:h-[70%] lg:w-[729px] lg:h-[729px] lg:top-[-70px] lg:left-[-290px] rounded-full z-0 opacity-50 lg:opacity-100"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 40.22%, #FFC72C 78.06%)",
        }}
      ></div>
      <div
        className="absolute bottom-[10%] left-[20%] w-[20%] h-[20%] md:w-[25%] md:h-[25%] lg:w-[192px] lg:h-[193px] lg:bottom-[200px] lg:left-[250px] rounded-full z-0 opacity-50 lg:opacity-100 hidden sm:block"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 34.81%, #FFB200 85.62%)",
        }}
      ></div>
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] md:w-[35%] md:h-[35%] lg:w-[354px] lg:h-[354px] lg:bottom-[-40px] lg:left-[-80px] rounded-full z-0 opacity-50 lg:opacity-100"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 38.78%, #FFB200 85.62%)",
        }}
      ></div>
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] md:w-[45%] md:h-[45%] lg:w-[354px] lg:h-[354px] lg:bottom-[-150px] lg:right-[-150px] rounded-full z-0 opacity-50 lg:opacity-100"
        style={{
          background:
            "linear-gradient(147.77deg, #DE9F0C 38.78%, #FFB200 85.62%)",
        }}
      ></div>

      <header className="text-left 2xl:mb-[8px] mb-10 text-black">
        <h1 className="text-2xl text-black font-extrabold lg:text-2xl 2xl:text-[35px] 2xl:leading-[97.52px] mb-[13px]">
          Sign In
        </h1>
      </header>
      <main className="">
        <LoginForm />
      </main>
    </>
  );
}

export default SignIn;