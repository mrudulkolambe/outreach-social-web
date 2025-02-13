import Sidebar from "../../components/Sidebar";

export default function RootLayout({
	children,
	sidebar,
	loading,
}: Readonly<{
	children: React.ReactNode;
	sidebar?: React.ReactNode;
	loading?: boolean;
}>) {
	return (
		<main className="flex flex-col md:flex-row w-screen h-screen mulish relative overflow-hidden">
			<Sidebar children={sidebar} collapsed={false}/>
			<section className="flex-1 w-full md:w-[calc(100vw-20vw)] h-[calc(100vh-64px)] md:h-screen pb-16 md:pb-0">
				{children}
			</section>
			<div 
				className={`flex items-center justify-center backdrop-blur fixed inset-0 z-50 transition-all duration-200 ${
					loading 
						? "bg-black/30 opacity-100 pointer-events-auto" 
						: "bg-transparent opacity-0 pointer-events-none"
				}`}
			>
				<div className="overflow-hidden h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] rounded-lg flex items-center justify-center shadow-xl bg-white">
					<img className="object-contain w-full h-full p-2" src="/assets/logo/main.gif" alt="Loading..." />
				</div>
			</div>
		</main>
	);
}
