import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
    <ReactQueryProvider >
      <div className="w-full bg-gray-950 text-gray-100  min-h-screen flex justify-center items-start">
         <div className="w-full flex  flex-col justify-start items-start">
             {children}
         </div>
      </div>
    </ReactQueryProvider>
      </body>
    </html>
  );
}
