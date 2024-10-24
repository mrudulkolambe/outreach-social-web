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
		<main className="flex w-screen h-screen mulish relative">
			<Sidebar children={sidebar} />
			<section className="w-[80vw] h-screen">
				{children}
			</section>
			<div className={loading ? "flex items-center justify-center backdrop-blur bg-black/30 h-screen w-screen fixed top-0 left-0 z-50 opacity-100 duration-200" : "pointer-events-none flex items-center justify-center backdrop-blur-0 loading h-screen w-screen fixed top-0 left-0 z-50 opacity-0 duration-200"}>
				<div className="overflow-hidden h-[100px] w-[100px] rounded-lg flex items-center justify-center shadow-xl">
					<img className="object-fill" src="/assets/logo/main.gif" alt="" />
				</div>
			</div>
		</main>
	);
}
