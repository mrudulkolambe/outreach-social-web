import Sidebar from "../../components/Sidebar";

export default function RootLayout({
	children,
	sidebar
}: Readonly<{
	children: React.ReactNode;
	sidebar?: React.ReactNode;
}>) {
	return (
		<main className="flex w-screen h-screen mulish">
			<Sidebar children={sidebar}/>
			<section className="w-[80vw] h-screen">
				{children}
			</section>
		</main>
	);
}
